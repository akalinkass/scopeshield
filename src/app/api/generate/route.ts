import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { canGenerate } from "@/lib/entitlements";
import { generateDocuments } from "@/lib/claude";
import { PROJECT_TYPE_VALUES, type ProjectType } from "@/lib/presets";

// Simple in-memory rate limiter: 1 req / 10s per user
const rateLimitMap = new Map<string, number>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(userId) ?? 0;
  if (now - last < 10_000) return false;
  rateLimitMap.set(userId, now);
  return true;
}

const bodySchema = z.object({
  clientName: z.string().min(1).max(200),
  projectType: z.enum(PROJECT_TYPE_VALUES as [ProjectType, ...ProjectType[]]),
  deliverables: z.array(z.string()).min(1),
  exclusions: z.array(z.string()),
  acceptanceCrit: z.array(z.string()),
  assumptions: z.array(z.string()),
  timeline: z.string().min(1).max(500),
  budget: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  const start = Date.now();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Rate limit ────────────────────────────────────────────────────────────
  if (!checkRateLimit(userId)) {
    return NextResponse.json(
      { error: "Rate limit: wait 10 seconds before generating again." },
      { status: 429 }
    );
  }

  // ── Entitlements ──────────────────────────────────────────────────────────
  const entitlement = await canGenerate(userId);
  if (!entitlement.allowed) {
    return NextResponse.json(
      { error: entitlement.reason, upgrade: true },
      { status: 402 }
    );
  }

  // ── Validate body ─────────────────────────────────────────────────────────
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Generate documents via Claude ─────────────────────────────────────────
  let docs: Awaited<ReturnType<typeof generateDocuments>>;
  try {
    docs = await generateDocuments(body);
  } catch (e) {
    console.error(JSON.stringify({ event: "generate_error", userId, error: String(e) }));
    return NextResponse.json(
      { error: "Document generation failed. Please try again." },
      { status: 500 }
    );
  }

  // ── Ensure User row exists (fallback if Clerk webhook hasn't fired) ───────
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
  await db.user.upsert({
    where: { id: userId },
    create: { id: userId, email },
    update: {},
  });

  // ── Save to DB ────────────────────────────────────────────────────────────
  const proposal = await db.proposal.create({
    data: {
      userId,
      clientName: body.clientName,
      projectType: body.projectType,
      deliverables: body.deliverables,
      exclusions: body.exclusions,
      acceptanceCrit: body.acceptanceCrit,
      assumptions: body.assumptions,
      timeline: body.timeline,
      budget: body.budget,
      proposalMd: docs.proposalMd,
      sowMd: docs.sowMd,
      changeReqEmail: docs.changeReqEmail,
    },
  });

  console.log(
    JSON.stringify({
      event: "proposal_created",
      userId,
      proposalId: proposal.id,
      duration_ms: Date.now() - start,
    })
  );

  return NextResponse.json({ id: proposal.id });
}

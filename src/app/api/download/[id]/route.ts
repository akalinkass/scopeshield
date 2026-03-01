import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { canDownloadClean } from "@/lib/entitlements";
import { generateDocx } from "@/lib/docx";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const start = Date.now();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Load proposal (verify ownership) ─────────────────────────────────────
  const proposal = await db.proposal.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      userId: true,
      clientName: true,
      proposalMd: true,
      sowMd: true,
      changeReqEmail: true,
    },
  });

  if (!proposal || proposal.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ── Entitlement: watermark for Free, clean for Pro ────────────────────────
  const clean = await canDownloadClean(userId);

  // ── Combine all three sections into one document ──────────────────────────
  const combinedContent = [
    proposal.proposalMd,
    "\n\n---\n\n",
    proposal.sowMd,
    "\n\n---\n\n",
    "## Change Request Email Template\n\n",
    proposal.changeReqEmail,
  ].join("");

  const buffer = await generateDocx(combinedContent, {
    watermark: !clean,
    title: `Proposal — ${proposal.clientName}`,
  });

  const filename = `ScopeShield-${proposal.clientName.replace(/[^a-z0-9]/gi, "-")}-${proposal.id.slice(0, 8)}.docx`;

  console.log(
    JSON.stringify({
      event: "docx_download",
      userId,
      proposalId: proposal.id,
      watermarked: !clean,
      duration_ms: Date.now() - start,
    })
  );

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

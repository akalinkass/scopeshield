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

  const buffer = await generateDocx({
    watermark: !clean,
    title: `Proposal — ${proposal.clientName}`,
    sections: [
      { title: "Proposal", content: proposal.proposalMd },
      { title: "Statement of Work", content: proposal.sowMd },
      { title: "Change Request Email Template", content: proposal.changeReqEmail },
    ],
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

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

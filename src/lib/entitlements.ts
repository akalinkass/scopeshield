import { db } from "@/lib/db";

const FREE_MONTHLY_LIMIT = 3;

/** Returns the number of proposals created by the user in the current calendar month. */
async function getMonthlyProposalCount(userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return db.proposal.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });
}

/** Returns true if the user has an active Pro subscription. */
async function hasPro(userId: string): Promise<boolean> {
  const sub = await db.subscription.findUnique({
    where: { userId },
    select: { status: true },
  });
  return sub?.status === "active" || sub?.status === "trialing";
}

/** Server-side gate for /api/generate */
export async function canGenerate(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  monthlyCount?: number;
}> {
  const pro = await hasPro(userId);
  if (pro) return { allowed: true };

  const count = await getMonthlyProposalCount(userId);
  if (count >= FREE_MONTHLY_LIMIT) {
    return {
      allowed: false,
      reason: `Free plan limit reached (${FREE_MONTHLY_LIMIT}/month). Upgrade to Pro for unlimited proposals.`,
      monthlyCount: count,
    };
  }

  return { allowed: true, monthlyCount: count };
}

/** Server-side gate for /api/download/[id] — true = clean DOCX, false = watermarked */
export async function canDownloadClean(userId: string): Promise<boolean> {
  return hasPro(userId);
}

/** Returns usage info for dashboard display. */
export async function getUsage(userId: string): Promise<{
  isPro: boolean;
  monthlyCount: number;
  limit: number;
}> {
  const [pro, count] = await Promise.all([
    hasPro(userId),
    getMonthlyProposalCount(userId),
  ]);
  return {
    isPro: pro,
    monthlyCount: count,
    limit: FREE_MONTHLY_LIMIT,
  };
}

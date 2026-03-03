import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getUsage } from "@/lib/entitlements";
import { type ProjectType, PROJECT_TYPE_LABELS } from "@/lib/presets";
import BillingButtons from "./billing-buttons";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgraded?: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [proposals, usage] = await Promise.all([
    db.proposal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        clientName: true,
        projectType: true,
        createdAt: true,
      },
    }),
    getUsage(userId),
  ]);

  return (
    <div>
      {searchParams.upgraded === "1" && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm">
          🎉 Welcome to Pro! You now have unlimited proposals and clean downloads.
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
        <Link
          href="/new"
          className="bg-brand-600 text-white px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          + New proposal
        </Link>
      </div>

      {/* Usage + billing */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {!usage.isPro && usage.monthlyCount >= 2 ? (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-5">
            <p className="text-sm font-semibold text-amber-900 mb-1">
              {usage.monthlyCount >= usage.limit
                ? "You've hit your free limit this month"
                : `${usage.monthlyCount} of ${usage.limit} free proposals used`}
            </p>
            <p className="text-sm text-amber-800 leading-relaxed">
              Upgrade to Pro ($14/mo) — less than the hourly rate you lost the last time a client said &ldquo;I thought this was included.&rdquo;
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-block text-sm font-semibold text-amber-900 underline"
            >
              Upgrade to Pro →
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">Plan</p>
            <p className="text-lg font-semibold text-gray-900">
              {usage.isPro ? "Pro ✓" : "Free"}
            </p>
            {!usage.isPro && (
              <p className="text-sm text-gray-500 mt-1">
                {usage.monthlyCount} / {usage.limit} proposals used this month
              </p>
            )}
            {!usage.isPro && (
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-brand-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min((usage.monthlyCount / usage.limit) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
          <BillingButtons isPro={usage.isPro} />
        </div>
      </div>

      {/* Proposal list */}
      {proposals.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">No proposals yet.</p>
          <Link
            href="/new"
            className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Create your first proposal →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Client
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Created
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {proposals.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {p.clientName}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {PROJECT_TYPE_LABELS[p.projectType as ProjectType]}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/proposals/${p.id}`}
                      className="text-sm text-brand-600 hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

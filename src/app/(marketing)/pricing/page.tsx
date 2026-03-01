"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FREE_FEATURES = [
  "3 proposals per month",
  "Proposal + SOW + Change Request Email",
  "Scope Builder with smart presets",
  "Watermarked DOCX download",
];

const PRO_FEATURES = [
  "Unlimited proposals",
  "Proposal + SOW + Change Request Email",
  "Scope Builder with smart presets",
  "Clean DOCX download (no watermark)",
  "All future features included",
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpgrade() {
    setLoading(true);
    try {
      const priceId =
        billing === "monthly"
          ? process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY
          : process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL;

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/sign-up");
        return;
      }
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Simple pricing</h1>
          <p className="mt-4 text-lg text-gray-600">
            Start free. Upgrade when you need unlimited proposals.
          </p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billing === "monthly"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billing === "annual"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 29%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="border border-gray-200 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900">Free</h2>
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">3 proposals per month</p>
            <ul className="mt-6 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="mt-8 block text-center py-3 px-6 border border-brand-600 text-brand-600 rounded-xl hover:bg-brand-50 transition-colors font-medium"
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-brand-600 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              Most popular
            </div>
            <h2 className="text-xl font-bold text-gray-900">Pro</h2>
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900">
                {billing === "annual" ? "$9.92" : "$14"}
              </span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {billing === "annual"
                ? "Billed $119/year — save $49"
                : "Billed monthly"}
            </p>
            <ul className="mt-6 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-8 w-full py-3 px-6 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors font-medium disabled:opacity-60"
            >
              {loading ? "Redirecting..." : "Upgrade to Pro →"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          All prices in USD. Cancel anytime. Not legal advice.
        </p>
      </div>
    </div>
  );
}

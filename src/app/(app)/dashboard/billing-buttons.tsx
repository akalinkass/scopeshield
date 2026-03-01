"use client";

import { useState } from "react";

// NEXT_PUBLIC_ vars are safe to expose — Stripe price IDs are not secret
const PRICE_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? "";
const PRICE_ANNUAL = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL ?? "";

export default function BillingButtons({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(priceId: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  if (isPro) {
    return (
      <>
        <p className="text-sm text-gray-500">Billing</p>
        <button
          onClick={handlePortal}
          disabled={loading}
          className="text-sm text-brand-600 hover:underline disabled:opacity-60 text-left"
        >
          {loading ? "Loading..." : "Manage billing →"}
        </button>
      </>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-500">Upgrade to Pro — unlimited proposals</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleUpgrade(PRICE_MONTHLY)}
          disabled={loading}
          className="flex-1 text-sm border border-brand-600 text-brand-600 px-3 py-2 rounded-lg hover:bg-brand-50 disabled:opacity-60"
        >
          $14/mo
        </button>
        <button
          onClick={() => handleUpgrade(PRICE_ANNUAL)}
          disabled={loading}
          className="flex-1 text-sm bg-brand-600 text-white px-3 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-60"
        >
          $119/yr ✦
        </button>
      </div>
    </>
  );
}

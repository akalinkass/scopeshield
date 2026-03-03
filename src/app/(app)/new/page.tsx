"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type ProjectType, PRESETS, PROJECT_TYPE_LABELS, PROJECT_TYPE_VALUES } from "@/lib/presets";
import ScopeBuilder from "@/components/scope-builder";

const LOADING_STEPS = [
  { label: "Analysing your scope...", delay: 0 },
  { label: "Drafting your Proposal...", delay: 4000 },
  { label: "Writing the Statement of Work...", delay: 10000 },
  { label: "Adding scope protection language...", delay: 18000 },
  { label: "Almost done...", delay: 24000 },
];

function GeneratingOverlay() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = LOADING_STEPS.slice(1).map((s, i) =>
      setTimeout(() => setStep(i + 1), s.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-lg max-w-sm w-full mx-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 mb-4">
            <svg className="animate-spin w-6 h-6 text-brand-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <p className="font-semibold text-gray-900">Generating your documents</p>
          <p className="text-sm text-gray-500 mt-1">This takes about 20–30 seconds</p>
        </div>
        <ul className="space-y-3">
          {LOADING_STEPS.map((s, i) => (
            <li key={s.label} className="flex items-center gap-3 text-sm">
              {i < step ? (
                <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : i === step ? (
                <span className="w-5 h-5 rounded-full border-2 border-brand-600 flex-shrink-0 animate-pulse" />
              ) : (
                <span className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
              )}
              <span className={i <= step ? "text-gray-900" : "text-gray-400"}>
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type FormState = {
  clientName: string;
  projectType: ProjectType;
  deliverables: string[];
  exclusions: string[];
  acceptanceCrit: string[];
  assumptions: string[];
  timeline: string;
  budget: string;
};

const PROJECT_TYPES = PROJECT_TYPE_VALUES.map(
  (v) => [v, PROJECT_TYPE_LABELS[v]] as [ProjectType, string]
);

function initialState(projectType: ProjectType): FormState {
  const p = PRESETS[projectType];
  return {
    clientName: "",
    projectType,
    deliverables: [...p.deliverables],
    exclusions: [...p.exclusions],
    acceptanceCrit: [...p.acceptanceCrit],
    assumptions: [...p.assumptions],
    timeline: "",
    budget: "",
  };
}

export default function NewProposalPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState("web_dev"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleProjectTypeChange(pt: ProjectType) {
    // Reset scope presets when project type changes
    const p = PRESETS[pt];
    setForm((prev) => ({
      ...prev,
      projectType: pt,
      deliverables: [...p.deliverables],
      exclusions: [...p.exclusions],
      acceptanceCrit: [...p.acceptanceCrit],
      assumptions: [...p.assumptions],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.deliverables.length === 0) {
      setError("Please select at least one deliverable.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError("You've used all 3 free proposals this month. Upgrade to Pro ($14/mo) — less than the hourly rate you lost the last time a client said 'I thought this was included.'");
          return;
        }
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(`/proposals/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const presets = PRESETS[form.projectType];

  return (
    <div className="max-w-3xl mx-auto">
      {loading && <GeneratingOverlay />}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New proposal</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Define your scope below — AI will polish it into a Proposal + SOW + Change Request Email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Project basics</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client name *
            </label>
            <input
              type="text"
              required
              value={form.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              placeholder="Acme Corp"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project type *
            </label>
            <select
              value={form.projectType}
              onChange={(e) =>
                handleProjectTypeChange(e.target.value as ProjectType)
              }
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {PROJECT_TYPES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeline *
              </label>
              <input
                type="text"
                required
                value={form.timeline}
                onChange={(e) => updateField("timeline", e.target.value)}
                placeholder="e.g. 4 weeks, delivered by April 30"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget / Rate *
              </label>
              <input
                type="text"
                required
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                placeholder="e.g. $5,000 flat or $150/hr"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Scope Builder */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-8">
          <div>
            <h2 className="font-semibold text-gray-900">Scope Builder</h2>
            <p className="text-xs text-gray-500 mt-1">
              Presets are pre-selected. Uncheck anything that doesn&apos;t apply or add custom items.
            </p>
          </div>

          <ScopeBuilder
            label="Deliverables *"
            presets={presets.deliverables}
            value={form.deliverables}
            onChange={(v) => updateField("deliverables", v)}
            placeholder="Add custom deliverable..."
          />

          <ScopeBuilder
            label="Exclusions (not included)"
            presets={presets.exclusions}
            value={form.exclusions}
            onChange={(v) => updateField("exclusions", v)}
            placeholder="Add custom exclusion..."
          />

          <ScopeBuilder
            label="Acceptance criteria"
            presets={presets.acceptanceCrit}
            value={form.acceptanceCrit}
            onChange={(v) => updateField("acceptanceCrit", v)}
            placeholder="Add acceptance criterion..."
          />

          <ScopeBuilder
            label="Assumptions"
            presets={presets.assumptions}
            value={form.assumptions}
            onChange={(v) => updateField("assumptions", v)}
            placeholder="Add assumption..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
            {error.includes("upgrade") && (
              <a href="/pricing" className="ml-2 underline font-medium">
                Upgrade to Pro →
              </a>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || form.deliverables.length === 0}
          className="w-full py-4 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 text-base"
        >
          Generate Proposal + SOW →
        </button>
      </form>
    </div>
  );
}

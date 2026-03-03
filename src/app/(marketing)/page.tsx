import Link from "next/link";

const STEPS = [
  { n: "1", title: "Describe your project", desc: "Pick your project type and check off deliverables, exclusions, and acceptance criteria from smart presets." },
  { n: "2", title: "AI polishes everything", desc: "Claude turns your structured scope into a professional proposal and SOW — in under 30 seconds." },
  { n: "3", title: "Download and send", desc: "Download a clean DOCX, review it, and send to your client. Done." },
];

const SAMPLE_DOCS = [
  {
    label: "Proposal",
    preview: `## Project Proposal
Client: Acme Corp
Budget: $5,000 flat fee
Delivered by: April 30, 2026

This proposal outlines a 5-page website redesign including mobile-responsive layout, CMS integration, and deployment to your hosting. Work begins upon receipt of 50% deposit and signed Statement of Work.

A signature block and payment schedule are included at the end of this document.`,
  },
  {
    label: "Statement of Work",
    preview: `## Deliverables (included)
- Homepage + 4 inner pages
- Mobile-responsive layout
- Contact form with email notifications
- Deployment to provided hosting

## Explicitly Excluded
- Ongoing maintenance after launch
- Copywriting or photography
- Third-party integrations not listed above

## Scope Change Process
Any additions require a written change order signed by both parties. Work on the original deliverables continues; new items begin only after the change order is approved.`,
  },
  {
    label: "Change Request Email",
    preview: `Subject: Change Order — Acme Corp Website

Hi [Client Name],

Thank you for the additional request. Adding a blog section falls outside our original Statement of Work dated [Date].

I've prepared a change order for $800 and 1 additional week. Work on this item will begin once the change order is signed by both parties.

Please review and reply to confirm, and I'll send the formal document.

[Your Name]`,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-3 py-1 bg-brand-100 text-brand-700 text-sm font-medium rounded-full">
            For freelance developers, designers &amp; consultants
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Write proposals in 2 minutes.
            <br />
            <span className="text-brand-600">Lock scope forever.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Freelancers lose $15,000/year to scope creep. ScopeShield generates a professional
            Proposal + Statement of Work + Change Request Email — ready to send in 2 minutes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-brand-600 text-white text-lg font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
            >
              Generate your first proposal free →
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-gray-700 text-lg font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              See pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">Free for 3 proposals/month. No credit card required.</p>
        </div>
      </section>

      {/* Problem — emotional */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 border-l-4 border-brand-600 rounded-r-2xl p-8 mb-10">
            <p className="text-2xl font-bold text-gray-900 mb-4">
              You quoted $3,000. You&apos;ve done $7,000 of work.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Most freelancers don&apos;t have a scope problem — they have a documentation problem.
              Your proposal was a paragraph. Your SOW was copy-pasted from the last job. When the
              client asked for &ldquo;one more thing,&rdquo; you had nothing to point to.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              ScopeShield fixes that. Before you start any project.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              { stat: "$15,000", label: "lost per year to scope creep on average" },
              { stat: "2 min", label: "to generate a complete Proposal + SOW" },
              { stat: "$14/mo", label: "Pro — less than one bad scope-creep hour" },
            ].map((s) => (
              <div key={s.stat} className="bg-brand-50 rounded-xl p-5">
                <p className="text-3xl font-bold text-brand-700">{s.stat}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="space-y-8">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-gray-600 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Output */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What you get in 2 minutes</h2>
            <p className="mt-3 text-gray-500">Three documents, generated from your actual project details.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SAMPLE_DOCS.map((doc) => (
              <div key={doc.label} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-brand-600 px-5 py-3">
                  <span className="text-white text-sm font-semibold tracking-wide uppercase">
                    {doc.label}
                  </span>
                </div>
                <div className="p-5 bg-gray-50 font-mono text-xs text-gray-600 leading-relaxed whitespace-pre-wrap min-h-[220px]">
                  {doc.preview}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            Sample output — your documents are generated from your actual project details.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "2-minute proposals",
                desc: "Fill a structured form, get a polished Proposal + SOW + Change Request Email — ready to send.",
              },
              {
                title: "Scope protection built in",
                desc: "Every SOW includes a scope change process section with best-practice language — not invented, just structured.",
              },
              {
                title: "Editable DOCX download",
                desc: "Get a properly formatted Word document your client can sign and return. No locked PDFs.",
              },
            ].map((b) => (
              <div key={b.title} className="p-6 rounded-2xl border border-gray-200 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor callout */}
      <section className="py-16 px-4 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-600">
            <span className="font-semibold text-gray-900">Proposify is for agencies. PandaDoc is for sales teams.</span>
            <br className="hidden sm:block" />
            {" "}ScopeShield is for freelancers who just need the documents done and sent.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-brand-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start protecting your scope today
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Free for 3 proposals/month. Upgrade to Pro for $14/month.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-white text-brand-700 text-lg font-medium rounded-xl hover:bg-brand-50 transition-colors shadow"
          >
            Get started free →
          </Link>
          <p className="mt-4 text-brand-200 text-sm">No credit card required.</p>
        </div>
      </section>
    </>
  );
}

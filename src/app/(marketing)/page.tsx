import Link from "next/link";

const BENEFITS = [
  {
    icon: "⚡",
    title: "2-minute proposals",
    desc: "Fill a structured form, get a polished Proposal + SOW + Change Request Email — ready to send.",
  },
  {
    icon: "🔒",
    title: "Scope protection built in",
    desc: "Every SOW includes a scope change process section using best-practice language freelancers need.",
  },
  {
    icon: "📄",
    title: "Editable DOCX download",
    desc: "Get a properly formatted Word document your client can sign and return. No locked PDFs.",
  },
];

const STEPS = [
  { n: "1", title: "Describe your project", desc: "Pick your project type and check off deliverables, exclusions, and acceptance criteria from smart presets." },
  { n: "2", title: "AI polishes everything", desc: "Claude turns your structured scope into a professional proposal and SOW — in under 30 seconds." },
  { n: "3", title: "Download and send", desc: "Download a clean DOCX, review it, and send to your client. Done." },
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
            Stop losing $15,000/year to scope creep. ScopeShield generates a professional
            Proposal + Statement of Work with scope protection language in under 2 minutes —
            no templates, no lawyers, no guesswork.
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

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {BENEFITS.map((b) => (
              <div key={b.title} className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
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

      {/* Problem */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            The average freelancer loses $15,000/year to scope creep
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Vague proposals lead to &ldquo;can you just add this one thing?&rdquo; requests.
            Existing tools like Proposify cost $49/month and are built for agencies.
            There was no fast, affordable tool built for solo freelancers.
          </p>
          <p className="text-xl font-semibold text-brand-700">Until now.</p>
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
        </div>
      </section>
    </>
  );
}

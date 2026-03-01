const FAQS = [
  {
    q: "What exactly does ScopeShield generate?",
    a: "Three documents: (1) a professional client-facing Proposal, (2) a detailed Statement of Work (SOW) with scope protection language, and (3) a Change Request Email template for when clients ask for work outside the original scope. All delivered as a single downloadable DOCX.",
  },
  {
    q: "Is this legal advice?",
    a: "No. ScopeShield documents are not legal advice. They use best-practice scope protection language common in freelance contracts. For legally binding contracts or complex agreements, consult a qualified attorney in your jurisdiction.",
  },
  {
    q: "How is ScopeShield different from Proposify or PandaDoc?",
    a: "Proposify costs $49/month and is built for agency sales teams with 10+ features you'll never use. ScopeShield is purpose-built for solo freelancers: one focused workflow, one fair price, no bloat. We also bundle the SOW and change-request email — not just the proposal.",
  },
  {
    q: "What project types are supported?",
    a: "Web development, design, consulting, writing/content, and a free-form 'other' option. Each type comes with smart presets for deliverables, exclusions, acceptance criteria, and assumptions — all editable.",
  },
  {
    q: "Can I edit the generated documents?",
    a: "Yes. Downloads are in DOCX format (compatible with Microsoft Word and Google Docs), so you can edit before sending.",
  },
  {
    q: "What's the free plan limit?",
    a: "3 proposals per month. Free plan downloads include a ScopeShield watermark in the footer. Upgrade to Pro ($14/month or $119/year) for unlimited proposals and clean downloads.",
  },
  {
    q: "What does 'scope protection language' mean?",
    a: "The SOW includes a 'Scope Change Process' section that clarifies: changes require written approval, additional work is billed separately, and work is paused pending approval of any scope additions. This sets professional expectations upfront and gives you a paper trail.",
  },
];

export default function FaqPage() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Frequently asked questions
        </h1>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              className="border border-gray-200 rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.q}
              </h2>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-gray-500">
          Not legal advice. ScopeShield documents are for business communication purposes only.
        </p>
      </div>
    </div>
  );
}

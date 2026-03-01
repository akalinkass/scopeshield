export default function PrivacyPage() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-3xl mx-auto prose prose-gray">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">What we collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect your email address (via Clerk authentication), the project details you enter into
            ScopeShield (client name, project type, deliverables, timeline, budget), and the AI-generated
            documents we create for you. We do not collect payment details — those are handled directly by
            Stripe.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">How we use it</h2>
          <p className="text-gray-600 leading-relaxed">
            We use your data to provide the ScopeShield service: generating documents, storing your proposal
            history, and managing your subscription. We do not sell your data to third parties or use it
            for advertising.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Third-party services</h2>
          <ul className="text-gray-600 space-y-2 list-disc pl-5">
            <li><strong>Clerk</strong> — authentication and identity management</li>
            <li><strong>Stripe</strong> — payment processing and subscription management</li>
            <li><strong>Anthropic</strong> — AI document generation (your project details are sent to Anthropic&apos;s API to generate documents)</li>
            <li><strong>Neon / Vercel</strong> — hosting and database</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data retention</h2>
          <p className="text-gray-600 leading-relaxed">
            Your proposals are retained until you delete your account. You can request account deletion
            by emailing us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
          <p className="text-gray-600">Questions? Email us at privacy@scopeshield.io</p>
        </section>

        <p className="text-sm text-gray-400 border-t pt-6 mt-8">
          Not legal advice. ScopeShield documents are for business communication purposes only.
        </p>
      </div>
    </div>
  );
}

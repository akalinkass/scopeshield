import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import { type ProjectType, PROJECT_TYPE_LABELS } from "@/lib/presets";

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export interface ScopeInput {
  clientName: string;
  projectType: ProjectType;
  deliverables: string[];
  exclusions: string[];
  acceptanceCrit: string[];
  assumptions: string[];
  timeline: string;
  budget: string;
}

export interface GeneratedDocuments {
  proposalMd: string;
  sowMd: string;
  changeReqEmail: string;
}

const SYSTEM_PROMPT = `You are a professional freelance proposal writer. You produce polished, clear Proposals and Statements of Work (SOW) that protect the freelancer's scope. Your writing is professional but approachable — friendly, not legalistic.

IMPORTANT: All documents are for business communication purposes only. They are NOT legal advice. Include "Not legal advice." in the footer of every document you generate.

Format rules:
- Use Markdown with proper headings (## and ###)
- Be concise and clear — no filler phrases
- Use descriptive named placeholders in [BRACKETS] for anything the freelancer must fill in. Examples: [YOUR FULL NAME], [YOUR BUSINESS NAME], [CLIENT LEGAL NAME], [PROJECT START DATE], [HOURLY RATE], [REVISION DEADLINE], [MILESTONE DESCRIPTION]. Never use a generic [PLACEHOLDER] — always name it specifically.
- The Proposal must end with a signature block: lines for freelancer name/signature/date and client name/signature/date
- The SOW Acceptance Criteria section must explicitly state: "Final payment is released upon written client confirmation that all acceptance criteria above are met."
- The SOW Payment Terms must include: (1) 50% deposit on signing before work begins, (2) a milestone payment tied to a specific deliverable, (3) final 25% on written acceptance. Add: invoices unpaid after 14 days will pause all work until settled.
- The Change Request Email must use these exact placeholders: [ORIGINAL SOW DATE], [CHANGE DESCRIPTION], [REASON OUT OF SCOPE], [ADDITIONAL COST], [ADDITIONAL TIME], [YOUR NAME]. Keep under 120 words.`;

function buildUserPrompt(input: ScopeInput): string {
  const projectLabel = PROJECT_TYPE_LABELS[input.projectType];

  return `Generate three documents for a freelance project. Use EXACTLY this structure in your response:

<proposal>
[Full professional proposal in Markdown]
</proposal>

<sow>
[Full Statement of Work in Markdown]
</sow>

<change_request>
[Change Request Email template in Markdown — client fills in [brackets]]
</change_request>

---

PROJECT DETAILS:
- Client Name: ${input.clientName}
- Project Type: ${projectLabel}
- Timeline: ${input.timeline}
- Budget: ${input.budget}

SCOPE (use these exactly — do not invent new scope):

**Deliverables:**
${input.deliverables.map((d) => `- ${d}`).join("\n")}

**Exclusions (not included):**
${input.exclusions.map((e) => `- ${e}`).join("\n")}

**Acceptance Criteria:**
${input.acceptanceCrit.map((a) => `- ${a}`).join("\n")}

**Assumptions:**
${input.assumptions.map((a) => `- ${a}`).join("\n")}

---

For the Proposal: write a professional client-facing proposal with these sections:
1. Introduction — 1 paragraph welcoming the client and summarising the project opportunity
2. Our Approach — 2–3 sentences describing how the freelancer will execute the project and why it will succeed
3. Deliverables — what is included (from the list above)
4. Timeline — key milestones from the input timeline
5. Investment — the budget, payment structure (50% deposit, milestone, final on acceptance)
6. Next Steps — a clear call to action: sign and return the proposal, then sign the SOW and submit the deposit to begin
7. Signature block — lines for [YOUR FULL NAME] / [YOUR SIGNATURE] / [DATE] and [CLIENT LEGAL NAME] / [CLIENT SIGNATURE] / [DATE]

For the SOW: write a detailed Statement of Work with these sections in this exact order:
1. Overview — one paragraph project summary
2. Deliverables — bulleted list verbatim from the input
3. Exclusions — bulleted list verbatim from the input; note that any work not listed above is explicitly out of scope
4. Revision Policy — state that [NUMBER] rounds of revisions are included; additional revisions are billed at [HOURLY RATE]/hr, billed in 30-minute increments, invoiced before work resumes
5. Client Responsibilities — the client must provide: all content, copy, and brand assets by [CONTENT DEADLINE]; feedback on deliverables within [FEEDBACK TURNAROUND] business days of submission; access to required accounts/platforms by [PROJECT START DATE]. Delays caused by late client delivery may extend the project timeline at no additional cost to the client.
6. Acceptance Criteria — bulleted list verbatim from the input; explicitly state that final payment is released upon written client confirmation that all criteria are met
7. Assumptions — bulleted list verbatim from the input
8. Timeline — project phases tied to deliverables, based on the input timeline
9. Payment Terms — 50% deposit ([DEPOSIT AMOUNT]) due on signing before any work begins; [MILESTONE PAYMENT AMOUNT] due upon [MILESTONE DESCRIPTION]; final [FINAL PAYMENT AMOUNT] due upon written acceptance. Invoices unpaid after 14 days pause all work until settled.
10. Project Commencement — work begins only after both parties have signed this SOW and the deposit has been received
11. Project Abandonment — if the client is unresponsive for 30 consecutive days, the project is placed on hold; the deposit is non-refundable after 60 days of inactivity
12. Scope Change Process — any request for work not listed in the Deliverables section requires a written change order signed by both parties; work on the change begins only after the change order is approved; the freelancer will provide a cost and timeline estimate within [ESTIMATE TURNAROUND] business days of receiving a change request

For the Change Request Email: write a short professional email using these exact placeholders:
[ORIGINAL SOW DATE], [CHANGE DESCRIPTION], [REASON OUT OF SCOPE], [ADDITIONAL COST], [ADDITIONAL TIME], [YOUR NAME].
State that work on this addition will not begin until a change order is signed. Keep it under 120 words and professional in tone — no apologies, just clear business communication.

End each document with: *Not legal advice. Generated by ScopeShield · scopeshield.io*`;
}

/** Parse the three document sections from Claude's response */
function parseDocuments(text: string): GeneratedDocuments {
  const extract = (tag: string): string => {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
    if (!match) throw new Error(`Missing <${tag}> section in AI response`);
    return match[1].trim();
  };

  return {
    proposalMd: extract("proposal"),
    sowMd: extract("sow"),
    changeReqEmail: extract("change_request"),
  };
}

export async function generateDocuments(
  input: ScopeInput
): Promise<GeneratedDocuments> {
  const start = Date.now();

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(input) }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  console.log(
    JSON.stringify({
      event: "claude_generate",
      model: "claude-haiku-4-5-20251001",
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      duration_ms: Date.now() - start,
    })
  );

  return parseDocuments(text);
}

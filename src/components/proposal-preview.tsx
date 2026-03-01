"use client";

import { useState } from "react";

type Tab = "proposal" | "sow" | "email";

interface Props {
  proposalMd: string;
  sowMd: string;
  changeReqEmail: string;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "proposal", label: "Proposal" },
  { id: "sow", label: "Statement of Work" },
  { id: "email", label: "Change Request Email" },
];

/** Convert basic markdown to HTML for preview (headings, bold, bullets). */
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gm, "<ul>$&</ul>")
    .replace(/^---$/gm, "<hr />")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])(.+)$/gm, "<p>$1</p>");
}

export default function ProposalPreview({ proposalMd, sowMd, changeReqEmail }: Props) {
  const [tab, setTab] = useState<Tab>("proposal");

  const content = {
    proposal: proposalMd,
    sow: sowMd,
    email: changeReqEmail,
  }[tab];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-b-2 border-brand-600 text-brand-700 bg-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="p-8 prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-base prose-h3:text-gray-600 prose-ul:space-y-1"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
      />
    </div>
  );
}

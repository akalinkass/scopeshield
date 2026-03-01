// Define locally so this file is safe to import in client components.
// Values match the Prisma ProjectType enum exactly.
export type ProjectType = "web_dev" | "design" | "consulting" | "writing" | "other";

export const PROJECT_TYPE_VALUES: ProjectType[] = [
  "web_dev",
  "design",
  "consulting",
  "writing",
  "other",
];

export interface PresetSection {
  deliverables: string[];
  exclusions: string[];
  acceptanceCrit: string[];
  assumptions: string[];
}

export const PRESETS: Record<ProjectType, PresetSection> = {
  web_dev: {
    deliverables: [
      "Homepage",
      "Up to 5 inner pages",
      "Mobile-responsive layout",
      "Basic SEO meta tags (title, description, OG)",
      "Contact form with email notification",
      "Deployment to client-provided hosting",
      "CMS integration (e.g. Sanity, Contentful)",
    ],
    exclusions: [
      "Ongoing maintenance or hosting",
      "Copywriting or content creation",
      "Stock photography or licensed media",
      "SEO campaigns or paid advertising",
      "Third-party integrations not listed in deliverables",
      "Backend API or database development",
      "E-commerce / payment processing",
    ],
    acceptanceCrit: [
      "Renders correctly in latest Chrome, Firefox, and Safari",
      "All navigation links functional with no broken links",
      "Contact form submits successfully and delivers email",
      "Page load time under 3 seconds on a fast connection",
      "Passes basic WCAG 2.1 AA accessibility checks",
    ],
    assumptions: [
      "Client provides all final copy and content before kickoff",
      "Client provides brand assets (logo, colors, fonts) by Day 3",
      "Client provides domain access and hosting credentials by Day 3",
      "Up to 2 rounds of revisions included; additional rounds billed at hourly rate",
      "Client responds to feedback requests within 2 business days",
    ],
  },
  design: {
    deliverables: [
      "Brand identity kit (logo, color palette, typography)",
      "Up to 5 high-fidelity mockups (Figma)",
      "Component library / design system",
      "Responsive mobile and desktop variants",
      "Exported assets in required formats (PNG, SVG, PDF)",
      "Style guide document",
    ],
    exclusions: [
      "Frontend development or coding",
      "Print production or physical materials",
      "Photography or illustration (unless specified)",
      "Animation or motion design",
      "Social media management",
    ],
    acceptanceCrit: [
      "All deliverables provided in agreed file formats",
      "Designs reviewed and approved by client stakeholder",
      "All fonts and assets licensed for client's intended use",
      "Figma file organized with named layers and components",
    ],
    assumptions: [
      "Client provides brand brief or reference materials before kickoff",
      "Client provides any existing brand guidelines",
      "Up to 2 rounds of revisions included per deliverable",
      "Final approval from a single designated decision-maker",
      "Client responds to feedback requests within 2 business days",
    ],
  },
  consulting: {
    deliverables: [
      "Discovery and requirements gathering sessions (up to 3 hours)",
      "Written strategy document or recommendations report",
      "Technical architecture diagram",
      "Implementation roadmap with prioritized milestones",
      "Async Q&A support for 2 weeks post-delivery",
    ],
    exclusions: [
      "Hands-on implementation or development work",
      "Ongoing retainer or advisory services",
      "Legal, financial, or HR advice",
      "Vendor selection or contract negotiations",
      "Team training or onboarding",
    ],
    acceptanceCrit: [
      "All deliverables submitted in agreed format (PDF, Notion, Slides)",
      "Recommendations document reviewed and signed off by client",
      "All sessions recorded and recordings shared with client",
    ],
    assumptions: [
      "Client provides access to relevant stakeholders and existing documentation",
      "All required meetings scheduled within the project timeline",
      "Client responds to information requests within 2 business days",
      "Scope limited to the defined subject area in this agreement",
    ],
  },
  writing: {
    deliverables: [
      "Up to 5 long-form articles or blog posts (1,000–2,000 words each)",
      "SEO keyword research and optimization for each piece",
      "1 round of revisions per piece",
      "Final delivery in Google Docs or Markdown format",
    ],
    exclusions: [
      "Content strategy or editorial calendar",
      "Social media copy or ad copy",
      "Graphic design or image sourcing",
      "Content publishing or CMS upload",
      "Ghostwriting for legal or medical topics",
    ],
    acceptanceCrit: [
      "All pieces pass Grammarly or equivalent grammar check",
      "Each piece meets agreed word count range",
      "Each piece reviewed and approved by designated client contact",
      "Content is original and passes plagiarism check",
    ],
    assumptions: [
      "Client provides topic briefs, target audience, and keyword list before kickoff",
      "Client designates a single point of contact for feedback",
      "Revisions requested within 5 business days of delivery",
      "Client owns rights to all delivered content upon final payment",
    ],
  },
  other: {
    deliverables: [],
    exclusions: [],
    acceptanceCrit: [],
    assumptions: [],
  },
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web_dev: "Web Development",
  design: "Design",
  consulting: "Consulting",
  writing: "Writing / Content",
  other: "Other",
};

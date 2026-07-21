export type DemoProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
};

export const demoProjects: DemoProject[] = [
  {
    id: "ai-analytics",
    title: "Nexus AI Analytics",
    category: "Enterprise Platform",
    description:
      "Real-time intelligence dashboard with predictive insights, secure multi-tenant access, and automated reporting pipelines.",
    tags: ["AI", "Analytics", "Security"],
  },
  {
    id: "secure-portal",
    title: "Fortis Client Portal",
    category: "Web Application",
    description:
      "Encrypted document workflows, role-based permissions, and seamless integrations for modern organizations.",
    tags: ["Web", "Encryption", "RBAC"],
  },
  {
    id: "mobile-automation",
    title: "Pulse Mobile Suite",
    category: "Mobile Application",
    description:
      "Cross-platform app with intelligent task automation, offline sync, and performance-optimized native experiences.",
    tags: ["Mobile", "Automation", "Sync"],
  },
  {
    id: "infra-dashboard",
    title: "Atlas Infrastructure",
    category: "Systems Monitoring",
    description:
      "High-performance observability stack with autonomous alerting, scalable metrics, and infrastructure health scoring.",
    tags: ["Infrastructure", "Monitoring", "Scale"],
  },
];

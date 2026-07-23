export type ExperienceStage = {
  year: string;
  title: string;
  dateRange?: string;
  highlights: string[];
  promotion?: boolean;
};

export const experienceStages: ExperienceStage[] = [
  {
    year: "2022",
    title: "Junior DevOps Engineer",
    dateRange: "June 2022 – February 2024",
    highlights: [
      "Built and maintained release pipelines",
      "Supported AWS infrastructure",
      "Migrated 8 legacy applications",
      "Automated 30+ servers using Ansible",
      "Supported 10+ microservices",
      "Configured monitoring and alerts",
      "Maintained incident documentation",
    ],
  },
  {
    year: "2024",
    title: "DevOps Engineer",
    dateRange: "March 2024 – present",
    promotion: true,
    highlights: [
      "Owned delivery automation",
      "Operated production Kubernetes workloads",
      "Introduced Jenkins and ArgoCD GitOps delivery",
      "Developed Terraform modules",
      "Integrated DevSecOps controls",
      "Implemented Prometheus and Grafana observability",
      "Improved MTTR by 50%",
      "Reduced cloud spend by 25%",
    ],
  },
  {
    year: "2026",
    title: "Platform / SRE direction",
    highlights: [
      "Platform Engineering",
      "Site Reliability Engineering",
      "Secure self-service infrastructure",
      "Developer experience",
      "Scalable cloud platforms",
      "Automation and operational excellence",
    ],
  },
];

export type LabProject = {
  name: string;
  what: string;
  tech: string[];
  status: string; // TODO(real-assets): confirm actual status per project
  demo?: string; // TODO(real-assets): fill in once a real demo URL exists
  repo?: string; // TODO(real-assets): fill in once a real repo URL exists
};

export const featuredBuild = {
  name: "Git File Explainer",
  tagline: "Built by me, idea to release.",
  description:
    "A Chrome extension that explains source files directly inside GitHub and GitLab: file-purpose summaries, key points, a complexity rating and follow-up questions, across more than 21 file types.",
  features: [
    "File-purpose summaries",
    "Key-point highlighting",
    "Complexity rating",
    "Follow-up questions",
    "Shareable explanations",
    "21+ supported file types",
    "GitHub and GitLab integration",
    "Manifest V3 architecture",
  ],
  chromeStoreUrl: "", // TODO(real-assets): add once verified
  repo: "", // TODO(real-assets): add repo URL
};

export const labProjects: LabProject[] = [
  {
    name: "EKS GitOps Sandbox",
    what: "A personal EKS environment for testing GitOps delivery patterns before they reach production case studies.",
    tech: ["EKS", "ArgoCD", "Helm"],
    status: "TODO(real-assets): confirm status",
  },
  {
    name: "Terraform Module Library",
    what: "Reusable modules for VPC, EKS, RDS, S3 and IAM, versioned and tested independently of any one project.",
    tech: ["Terraform", "AWS"],
    status: "TODO(real-assets): confirm status",
  },
  {
    name: "Kubernetes Troubleshooting Playground",
    what: "A sandbox for practicing failure scenarios — crash loops, resource limits, networking — to sharpen incident response.",
    tech: ["Kubernetes", "kubectl"],
    status: "TODO(real-assets): confirm status",
  },
  {
    name: "CI/CD Visualiser",
    what: "A small tool for visualising pipeline stages and status, similar in spirit to the pipeline strip on this site.",
    tech: ["React", "TypeScript"],
    status: "TODO(real-assets): confirm status",
  },
  {
    name: "Cloud Cost Optimisation Dashboard",
    what: "Tracks AWS spend by service and surfaces rightsizing opportunities, following the same approach used to cut cost by 25%.",
    tech: ["AWS Cost Explorer", "Python"],
    status: "TODO(real-assets): confirm status",
  },
  {
    name: "DevOps Interview Practice App",
    what: "A self-quizzing tool covering AWS, Kubernetes, Terraform and CI/CD scenarios.",
    tech: ["React", "TypeScript"],
    status: "TODO(real-assets): confirm status",
  },
];

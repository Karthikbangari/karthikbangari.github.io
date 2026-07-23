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
  tagline: "Founder & Sole Developer — solo-shipped, idea to release.",
  description:
    "An open-source Manifest V3 Chrome extension, live on the Chrome Web Store, that explains code directly on GitHub and GitLab blob pages via an injected sidebar: file-purpose summaries, key-point highlighting, a complexity rating, follow-up Q&A and shareable summaries across 21+ file types including .tf, .ts, .py, .go, .java and .cpp.",
  features: [
    "File-purpose summaries",
    "Key-point highlighting",
    "Complexity rating",
    "Follow-up Q&A",
    "Shareable summaries",
    "21+ supported file types",
    "GitHub and GitLab integration",
    "Manifest V3 architecture",
  ],
  chromeStoreUrl: "", // TODO(real-assets): confirmed live on the Chrome Web Store per CV — add the direct listing URL
  repo: "", // TODO(real-assets): add repo URL
};

export const labProjects: LabProject[] = [
  {
    name: "Kubernetes GitOps Delivery Platform",
    what: "A declarative, auditable GitOps delivery platform on Amazon EKS with Helm and ArgoCD, using a Horizontal Pod Autoscaler to handle variable load and improve resilience under peak traffic.",
    tech: ["Amazon EKS", "Helm", "ArgoCD", "HPA"],
    status: "Personal project",
  },
  {
    name: "Highly Available 3-Tier AWS Architecture",
    what: "A multi-AZ, 3-tier architecture with horizontal auto-scaling, provisioned with fully version-controlled, repeatable Terraform; sensitive configuration managed via AWS Secrets Manager.",
    tech: ["Terraform", "AWS", "Multi-AZ", "Secrets Manager"],
    status: "Personal project",
  },
  {
    name: "Kubernetes Troubleshooting Playground",
    what: "A sandbox for practicing failure scenarios — crash loops, resource limits, networking — to sharpen incident response.",
    tech: ["Kubernetes", "kubectl"],
    status: "In development",
  },
  {
    name: "CI/CD Visualiser",
    what: "A small tool for visualising pipeline stages and status, similar in spirit to the pipeline strip on this site.",
    tech: ["React", "TypeScript"],
    status: "In development",
  },
  {
    name: "Cloud Cost Optimisation Dashboard",
    what: "Tracks AWS spend by service and surfaces rightsizing opportunities, following the same approach used to cut cost by 25%.",
    tech: ["AWS Cost Explorer", "Python"],
    status: "In development",
  },
  {
    name: "DevOps Interview Practice App",
    what: "A self-quizzing tool covering AWS, Kubernetes, Terraform and CI/CD scenarios.",
    tech: ["React", "TypeScript"],
    status: "In development",
  },
];

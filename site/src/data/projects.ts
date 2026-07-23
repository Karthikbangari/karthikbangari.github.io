export type CaseStudy = {
  slug: string;
  index: string;
  theme: "blue" | "cream" | "split";
  title: string;
  tags: string[];
  problem: string[];
  architecture: string[];
  decisions: string[];
  controls: string[];
  impact: string[];
  incidentTimeline?: { time: string; event: string }[];
  evidence: string[];
  improveNext: string; // placeholder — needs Karthik's real reflection, not fabricated
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "gitops-delivery-platform",
    index: "01",
    theme: "blue",
    title: "From 3-hour deployments to releases in under 30 minutes.",
    tags: ["Amazon EKS", "Jenkins", "Docker", "Helm", "ArgoCD", "GitOps", "Snyk", "Prometheus", "Grafana"],
    problem: [
      "Slow, manual deployment process",
      "Inconsistent environment changes",
      "Difficult rollback process",
      "Security checks happened too late",
    ],
    architecture: [
      "GitHub",
      "Jenkins",
      "Tests + Snyk security checks",
      "Docker registry",
      "ArgoCD",
      "Amazon EKS",
      "Prometheus + Grafana",
    ],
    decisions: [
      "Jenkins pipeline automation",
      "Docker image creation",
      "Security-gated builds",
      "GitOps deployment with ArgoCD",
      "Helm-based Kubernetes releases",
      "Readiness and liveness checks",
      "Rollback through Git history",
    ],
    controls: [
      "Automated vulnerability scanning (Snyk, AWS Security Hub) gating every build before production release",
      "IAM least-privilege access enforced across all environments",
      "KMS encryption enforced across all environments",
      "Readiness/liveness probes before traffic is routed",
      "Git-history-based rollback instead of manual undo",
    ],
    impact: [
      "90% reduction in deployment time",
      "Multiple production releases per day",
      "More auditable deployments",
      "Lower rollback risk",
    ],
    evidence: [], // TODO(real-assets): architecture diagram, redacted Jenkinsfile, ArgoCD screenshot, manifest sample, repo/demo link
    improveNext: "",
  },
  {
    slug: "terraform-aws-platform",
    index: "02",
    theme: "cream",
    title: "Infrastructure without repetitive console work.",
    tags: ["Terraform", "AWS", "VPC", "EKS", "RDS", "S3", "IAM", "Secrets Manager"],
    problem: [
      "Manual VPC and server creation",
      "Different configurations between environments",
      "Slow infrastructure delivery",
      "Difficult disaster recovery",
    ],
    architecture: [
      "Route 53",
      "Load balancer",
      "Public / private subnets",
      "EKS or application layer",
      "RDS Multi-AZ",
    ],
    decisions: [
      "Reusable Terraform modules",
      "Remote state and locking",
      "Multi-environment structure",
      "VPC, EKS, RDS, S3 and IAM modules",
      "Secrets stored outside source control",
      "Pull-request-based infrastructure changes",
    ],
    controls: [
      "Secrets kept out of source control (Secrets Manager)",
      "Remote state + locking to prevent concurrent-apply drift",
      "Infrastructure changes reviewed via pull request before apply",
    ],
    impact: [
      "80% faster provisioning",
      "Repeatable infrastructure",
      "Reduced configuration drift",
      "Easier environment recreation",
    ],
    evidence: [], // TODO(real-assets): module repo link, plan/apply output sample, environment diagram
    improveNext: "",
  },
  {
    slug: "production-observability",
    index: "03",
    theme: "split",
    title: "Finding failures before users report them.",
    tags: ["Prometheus", "Grafana", "CloudWatch", "SNS", "ELK", "Runbooks", "SLI/SLO"],
    problem: [
      "Alerts without sufficient context",
      "Slow root-cause identification",
      "Logs, metrics and infrastructure data were separated",
    ],
    architecture: [
      "Application + infrastructure metrics",
      "Prometheus",
      "Grafana dashboards",
      "CloudWatch alarms",
      "Alert routing",
      "Runbooks",
    ],
    decisions: [
      "Prometheus metric collection",
      "Grafana operational dashboards",
      "CloudWatch alarms",
      "Application and infrastructure alerts",
      "Runbooks and incident documentation",
      "SLI/SLO-focused alert design",
    ],
    controls: [
      "Alerts scoped to SLIs/SLOs instead of raw thresholds",
      "CloudWatch alarms + SNS alerting for proactive incident response",
      "Runbooks and root-cause analysis documentation maintained after each event",
    ],
    impact: ["50% MTTR reduction", "Faster incident triage", "More proactive production support"],
    incidentTimeline: [
      { time: "12:01", event: "Alert triggered" },
      { time: "12:04", event: "Dashboard identified pod restarts" },
      { time: "12:08", event: "Logs showed database connection failure" },
      { time: "12:15", event: "Configuration corrected" },
      { time: "12:22", event: "Service fully restored" },
      { time: "12:30", event: "Root-cause documentation started" },
    ],
    evidence: [], // TODO(real-assets): dashboard screenshot, sample runbook, alert rule sample
    improveNext: "",
  },
];

export type Metric = {
  value: string;
  label: string;
  description: string;
};

export const metrics: Metric[] = [
  {
    value: "90%",
    label: "Faster deployments",
    description: "Reduced production deployment time from ~3 hours to under 30 minutes.",
  },
  {
    value: "99.5%",
    label: "Application uptime",
    description: "Improved from ~95% after migrating legacy applications to AWS.",
  },
  {
    value: "80%",
    label: "Faster provisioning",
    description: "Reusable Terraform modules replaced repeated console operations.",
  },
  {
    value: "50%",
    label: "Lower MTTR",
    description: "Faster incident response via Prometheus, Grafana, CloudWatch and runbooks.",
  },
  {
    value: "25%",
    label: "Lower AWS cost",
    description: "Rightsizing and purchasing-strategy optimisation.",
  },
  {
    value: "70%",
    label: "Less manual intervention",
    description: "Automation across production Kubernetes operations.",
  },
];

export const secondaryMetrics = [
  "8 legacy applications migrated",
  "30+ servers automated",
  "10+ microservices supported",
  "21+ file types supported by Git File Explainer",
];

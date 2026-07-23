export type Skill = { name: string; example: string };
export type SkillGroup = { group: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    group: "Build & Release",
    skills: [
      { name: "Jenkins", example: "Built the CI pipeline that cut deployment time by 90%." },
      { name: "GitHub Actions", example: "Lightweight automation for repo and release workflows." },
      { name: "GitLab CI/CD", example: "Pipeline automation as a Jenkins alternative where needed." },
      {
        name: "ArgoCD",
        example:
          "Used GitOps reconciliation to make Kubernetes deployments auditable and easier to roll back.",
      },
    ],
  },
  {
    group: "Infrastructure",
    skills: [
      { name: "AWS", example: "Migrated 8 legacy applications to AWS, lifting uptime to 99.5%." },
      {
        name: "Terraform",
        example: "Created reusable modules for VPC, EKS, RDS, S3 and IAM.",
      },
      { name: "CloudFormation", example: "Alternative IaC path for AWS-native stack definitions." },
      { name: "Ansible", example: "Automated configuration across 30+ servers." },
      { name: "Packer", example: "Baked consistent machine images ahead of provisioning." },
    ],
  },
  {
    group: "Containers",
    skills: [
      { name: "Docker", example: "Built the container images shipped through the GitOps pipeline." },
      { name: "Kubernetes", example: "Ran production workloads with readiness/liveness checks." },
      { name: "EKS", example: "Amazon EKS as the target runtime for GitOps deployments." },
      { name: "Helm", example: "Packaged Kubernetes releases deployed via ArgoCD." },
      { name: "HPA", example: "Autoscaled workloads to match production load." },
    ],
  },
  {
    group: "Security",
    skills: [
      { name: "Snyk", example: "Gated builds with security scanning before image creation." },
      { name: "Security Hub", example: "Centralised AWS security findings across accounts." },
      { name: "IAM", example: "Least-privilege access across environments and pipelines." },
      { name: "KMS", example: "Encryption for data at rest across AWS services." },
      { name: "Secrets Manager", example: "Kept secrets out of source control and Terraform state." },
    ],
  },
  {
    group: "Observability",
    skills: [
      {
        name: "Prometheus",
        example: "Collected application and cluster metrics used for dashboards and alerting.",
      },
      { name: "Grafana", example: "Built the operational dashboards backing incident response." },
      { name: "CloudWatch", example: "Infrastructure-level alarms alongside Prometheus/Grafana." },
      { name: "ELK", example: "Centralised logs for faster root-cause analysis." },
    ],
  },
  {
    group: "Automation",
    skills: [
      { name: "Python", example: "Scripting for pipeline glue and operational tooling." },
      { name: "Bash", example: "Automation scripts across CI and server configuration." },
      { name: "YAML", example: "Kubernetes manifests, Helm values and pipeline definitions." },
      { name: "JSON", example: "IAM policies, Terraform variables and API payloads." },
    ],
  },
];

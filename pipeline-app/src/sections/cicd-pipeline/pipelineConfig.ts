import type { PipelineStage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH. Both the 2D fallback and the (later) 3D scene render
// from this array. Numbers tagged `DEMO DATA` are illustrative — swap them for
// your real project metrics.
// ─────────────────────────────────────────────────────────────────────────────

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "source",
    title: "Source",
    tool: "GitHub",
    purpose:
      "A developer commit opens a pull request. Branch protection and review gate every change before it can reach the pipeline.",
    myResponsibility:
      "I own branch protection rules, required reviews, and the webhook that triggers CI on merge to the release branch.",
    commands: [
      "git checkout -b feature/cart-service",
      'git commit -m "feat: add idempotent checkout"',
      "git push origin feature/cart-service",
      "gh pr create --base main --fill",
    ],
    console: [
      "Enumerating objects: 27, done.",
      "To github.com:karthik/valley-shop.git",
      "   a1bff11..7c4e9d2  feature/cart-service -> feature/cart-service",
      "PR #142 opened · 1 reviewer required · branch protection: ON",
      "Webhook delivered to Jenkins (200 OK) — pipeline triggered.",
    ],
    metrics: {
      "PR reviews": "1 required", // DEMO DATA — replace with real project metrics
      "Protected branch": "main",
      "Trigger": "webhook",
    },
    failureBehaviour:
      "If checks or reviews are missing, merge is blocked — the pipeline never starts.",
    artifactAfter: "commit",
    durationMs: 2200,
  },
  {
    id: "ci-build",
    title: "CI Build",
    tool: "Jenkins",
    purpose:
      "Jenkins checks out the code, installs dependencies, compiles, and runs the unit-test suite across parallel build lanes.",
    myResponsibility:
      "I maintain the declarative Jenkinsfile, the agent pool, build caching, and the parallel test lanes.",
    commands: [
      "checkout scm",
      "npm ci",
      "npm run build",
      "npm test -- --coverage",
    ],
    console: [
      "[Pipeline] stage (Checkout) — workspace synced @ 7c4e9d2",
      "[Pipeline] stage (Install) — npm ci · 412 packages · cache HIT",
      "[Pipeline] stage (Compile) — build succeeded in 38s",
      "[Pipeline] parallel lanes: unit ✓  integration ✓  lint ✓",
      "Tests: 318 passed, 0 failed · coverage 87.4%",
      "Build #284 GREEN.",
    ],
    metrics: {
      "Tests": "318 passed", // DEMO DATA — replace with real project metrics
      "Coverage": "87.4%", // DEMO DATA — replace with real project metrics
      "Build time": "38s", // DEMO DATA — replace with real project metrics
    },
    failureBehaviour:
      "A failing unit test or compile error fails the build immediately and notifies the author — nothing downstream runs.",
    artifactAfter: "build artifact",
    failsOn: "build",
    durationMs: 3200,
  },
  {
    id: "quality-security",
    title: "Quality & Security",
    tool: "SonarQube · Snyk",
    purpose:
      "A SonarQube quality gate and Snyk scans (dependencies, SAST, container, IaC, secrets) gate the build for risk before packaging.",
    myResponsibility:
      "I define the quality gate thresholds, wire Snyk into the pipeline, and enforce fail-on-high for new vulnerabilities.",
    commands: [
      "sonar-scanner -Dsonar.qualitygate.wait=true",
      "snyk test --severity-threshold=high",
      "snyk code test",
      "snyk iac test ./infra",
    ],
    console: [
      "SonarQube quality gate: PASSED (0 new bugs, 0 new vulns)",
      "Snyk deps: 0 high / 2 medium (accepted policy)",
      "Snyk SAST: no high-severity findings",
      "Snyk IaC: 0 critical misconfigurations",
      "Secret scan: clean.",
    ],
    metrics: {
      "Quality gate": "passed",
      "High vulns": "0", // DEMO DATA — replace with real project metrics
      "Secrets": "clean",
    },
    failureBehaviour:
      "A failed quality gate or a new high-severity vulnerability blocks packaging until it is fixed or explicitly waived.",
    artifactAfter: "secured artifact",
    failsOn: "security",
    durationMs: 3000,
  },
  {
    id: "package-registry",
    title: "Package & Registry",
    tool: "Docker · Amazon ECR",
    purpose:
      "A multi-stage Docker build produces a small, reproducible image that is tagged, scanned, and pushed to Amazon ECR.",
    myResponsibility:
      "I own the multi-stage Dockerfile, image tagging strategy (git SHA + semver), and the ECR lifecycle/scan policy.",
    commands: [
      "docker build -t valley-shop:7c4e9d2 .",
      "docker tag valley-shop:7c4e9d2 $ECR/valley-shop:7c4e9d2",
      "aws ecr get-login-password | docker login --username AWS ...",
      "docker push $ECR/valley-shop:7c4e9d2",
    ],
    console: [
      "Step 1/2 build stage: deps + compile (cached layers)",
      "Step 2/2 runtime stage: distroless · final image 84MB",
      "Pushed tag 7c4e9d2 → ECR · digest sha256:9f3a…b21",
      "ECR scan-on-push: 0 critical / 0 high",
      "Image ready for deployment.",
    ],
    metrics: {
      "Image size": "84 MB", // DEMO DATA — replace with real project metrics
      "Digest": "sha256:9f3a…",
      "ECR scan": "0 critical",
    },
    failureBehaviour:
      "A build error or a critical image-scan finding stops the push — no unscanned image reaches the registry.",
    artifactAfter: "ECR image",
    durationMs: 3000,
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    tool: "Terraform",
    purpose:
      "Terraform validates and applies the infrastructure as code — VPC, subnets, IAM, ALB, the EKS cluster, and autoscaling.",
    myResponsibility:
      "I write and review the Terraform modules, manage remote state + locking, and read every plan before apply.",
    commands: [
      "terraform fmt -check && terraform validate",
      "terraform plan -out=tfplan",
      "terraform apply tfplan",
      "terraform output cluster_endpoint",
    ],
    console: [
      "Terraform validate: success",
      "Plan: 6 to add, 2 to change, 0 to destroy.",
      "module.network.aws_vpc.main: Creation complete",
      "module.eks.aws_eks_node_group.main: Creation complete",
      "Apply complete! Resources: 6 added, 2 changed, 0 destroyed.",
    ],
    metrics: {
      "Plan": "+6 ~2 -0", // DEMO DATA — replace with real project metrics
      "State": "locked (S3+DDB)",
      "Cluster": "eks-valley-prod",
    },
    failureBehaviour:
      "A validation error or a destructive plan is caught before apply; state locking prevents concurrent corruption.",
    artifactAfter: "ECR image",
    durationMs: 3200,
  },
  {
    id: "deploy-eks",
    title: "Deploy / EKS",
    tool: "AWS EKS · kubectl",
    purpose:
      "After approval, the new image rolls out on EKS. Pods flip from the old version to the new one, one at a time, with health gating.",
    myResponsibility:
      "I own the Kubernetes manifests/Helm chart, readiness & liveness probes, and the rollout/​rollback strategy.",
    commands: [
      "kubectl set image deploy/valley-shop app=$ECR/valley-shop:7c4e9d2",
      "kubectl rollout status deploy/valley-shop",
      "kubectl get pods -l app=valley-shop",
    ],
    console: [
      "deployment.apps/valley-shop image updated",
      "Waiting for rollout: 1 of 4 new pods ready…",
      "Waiting for rollout: 3 of 4 new pods ready…",
      "Replicas: 4 updated, 4 available, 0 unavailable",
      "rollout status: successfully rolled out.",
    ],
    metrics: {
      "Replicas": "4/4 ready", // DEMO DATA — replace with real project metrics
      "Strategy": "health-gated",
      "Unavailable": "0",
    },
    failureBehaviour:
      "If new pods fail their readiness probe, the rollout halts and an automatic rollback restores the previous healthy version.",
    artifactAfter: "k8s deployment",
    failsOn: "deploy",
    requiresApproval: true,
    durationMs: 3600,
  },
  {
    id: "release-strategy",
    title: "Release Strategy",
    tool: "Argo Rollouts",
    purpose:
      "The release is progressed using the chosen strategy — Rolling, Canary (10→25→50→100%), or Blue-Green — each gated by live health.",
    myResponsibility:
      "I configure the rollout strategy, the canary analysis steps, and the traffic-shift + automated rollback criteria.",
    commands: [
      "kubectl argo rollouts set image valley-shop app=…:7c4e9d2",
      "kubectl argo rollouts get rollout valley-shop --watch",
      "kubectl argo rollouts promote valley-shop",
    ],
    console: [
      "Strategy selected — progressing release…",
      "Canary 10% → analysis: error-rate 0.04% PASS",
      "Canary 25% → 50% → 100% promoted",
      "Stable ReplicaSet updated to 7c4e9d2.",
    ],
    metrics: {
      "Steps": "10/25/50/100", // DEMO DATA — replace with real project metrics
      "Analysis": "auto-gated",
      "Rollback": "automatic",
    },
    failureBehaviour:
      "If canary analysis breaches the error-rate or latency threshold, promotion stops and traffic returns to stable.",
    artifactAfter: "live service",
    durationMs: 3400,
  },
  {
    id: "observability",
    title: "Observability",
    tool: "Prometheus · Grafana · CloudWatch",
    purpose:
      "Prometheus + Grafana + CloudWatch confirm the release is healthy: golden signals, pod status, and alert routing are all live.",
    myResponsibility:
      "I build the dashboards, define SLO-based alerts, and wire alert routing so regressions page us before users notice.",
    commands: [
      "promtool check rules alerts.yml",
      "kubectl port-forward svc/grafana 3000",
      "aws cloudwatch get-metric-data --metric-name 5xx",
    ],
    console: [
      "Prometheus targets: 12/12 UP",
      "Grafana dashboard 'Valley Shop / Golden Signals' live",
      "Alertmanager routes: page→oncall, warn→slack",
      "All SLOs within budget — release healthy.",
    ],
    metrics: {
      "CPU": "42%", // DEMO DATA — replace with real project metrics
      "Error rate": "0.08%", // DEMO DATA — replace with real project metrics
      "P95 latency": "182ms", // DEMO DATA — replace with real project metrics
      "Availability": "99.99%", // DEMO DATA — replace with real project metrics
    },
    failureBehaviour:
      "An SLO breach fires an alert and (for a bad rollout) triggers the automated rollback path.",
    artifactAfter: "live service",
    durationMs: 2800,
  },
];

/** Recruiter-facing summary — what the pipeline demonstrates. */
export const PIPELINE_DEMONSTRATES: string[] = [
  "End-to-end CI/CD ownership from commit to production observability",
  "DevSecOps: quality gates and security scanning shifted left into the pipeline",
  "Infrastructure as Code with reviewed Terraform plans and locked state",
  "Kubernetes (EKS) rollouts with health gating and automated rollback",
  "Progressive delivery: Rolling, Canary, and Blue-Green strategies",
  "SLO-based observability with actionable alerting",
];

/** Outcome cards — explicitly labelled as portfolio demonstration metrics. */
export const PIPELINE_OUTCOMES: { label: string; value: string }[] = [
  { label: "Deploy time", value: "< 30 min" }, // DEMO DATA — replace with real project metrics
  { label: "MTTR reduced", value: "50%" }, // DEMO DATA — replace with real project metrics
  { label: "Cloud cost saved", value: "25%" }, // DEMO DATA — replace with real project metrics
  { label: "Availability", value: "99.99%" }, // DEMO DATA — replace with real project metrics
];

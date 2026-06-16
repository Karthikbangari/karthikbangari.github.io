(() => {
  const games = [
    {
      title: "Production Incident Simulator",
      scenario: "Production is down. Restore the cloud platform step by step.",
      proof: "Demonstrates Terraform, CI/CD, Kubernetes reliability, monitoring, security, and cost optimization.",
      visual: "incident",
      statuses: [
        ["Deployment Time", "3 hours", "Under 30 min"],
        ["Manual Operations", "High", "Reduced 70%"],
        ["Monitoring", "Weak", "Online"],
        ["Security Gate", "Missing", "Passed"],
        ["Cloud Cost", "Over Budget", "Reduced 25%"],
        ["System Health", "Critical", "Stable"],
      ],
      actions: [
        ["Provision Infrastructure", "Terraform applied successfully - VPC, IAM, EKS, and RDS provisioned."],
        ["Run CI/CD Pipeline", "Jenkins pipeline completed - Docker image built, scanned, and released."],
        ["Deploy Kubernetes Workloads", "EKS workloads balanced across nodes with healthy rollout status."],
        ["Enable Monitoring", "Prometheus alerts resolved - MTTR reduced by 50%."],
        ["Apply Security Scan", "Security Hub and image scan passed - risky paths blocked."],
        ["Optimize Cloud Cost", "Rightsizing complete - waste removed and spend reduced by 25%."],
      ],
      result: "Production Stable",
      metrics: [["Uptime", "99.5%"], ["Deploy Time", "< 30 min"], ["Hire Signal", "Strong"]],
    },
    {
      title: "CI/CD Pipeline Builder",
      scenario: "Build the correct delivery path from commit to monitored production.",
      proof: "Shows full delivery flow from code commit to production observability.",
      visual: "pipeline",
      statuses: [["Commit", "Waiting", "Done"], ["Tests", "Pending", "Passed"], ["Image", "Not built", "Built"], ["Security", "Pending", "Passed"], ["Registry", "Empty", "Pushed"], ["ArgoCD", "Idle", "Synced"]],
      actions: [
        ["Git Commit", "Source change detected - pipeline trigger created."],
        ["Unit Test", "Unit test stage passed with clean build signal."],
        ["Build Docker Image", "Docker image built and versioned with immutable tag."],
        ["Security Scan", "Container scan completed - vulnerabilities cleared."],
        ["Push to Registry", "Image pushed to registry and ready for deployment."],
        ["Deploy with ArgoCD", "ArgoCD synced desired state into Kubernetes."],
        ["Monitor with Prometheus", "Prometheus dashboard online - production watched."],
      ],
      result: "Pipeline Ready",
      metrics: [["Flow", "Commit -> Prod"], ["Quality", "Gated"], ["Proof", "CI/CD"]],
    },
    {
      title: "Kubernetes Cluster Balancer",
      scenario: "Pods are overloaded and unevenly distributed across nodes.",
      proof: "Shows EKS, HPA, pod operations, node balancing, and reliability thinking.",
      visual: "cluster",
      statuses: [["Node A", "Overloaded", "Balanced"], ["Node B", "Idle", "Balanced"], ["Node C", "CrashLoop", "Healthy"], ["HPA", "Off", "Enabled"]],
      actions: [
        ["Scale Replicas", "Replicas scaled to absorb traffic safely."],
        ["Move Pods", "Pods redistributed across three nodes."],
        ["Enable HPA", "Horizontal Pod Autoscaler enabled for CPU pressure."],
        ["Restart Unhealthy Pod", "CrashLoop pod restarted and readiness probe passed."],
      ],
      result: "Cluster Stable",
      metrics: [["EKS", "Stable"], ["HPA", "Enabled"], ["Pods", "Green"]],
    },
    {
      title: "Terraform Infrastructure Builder",
      scenario: "Provision reusable AWS infrastructure in the correct order.",
      proof: "Shows infrastructure as code, AWS resource ordering, and module thinking.",
      visual: "blocks",
      statuses: [["State", "Empty", "Managed"], ["Plan", "Not ready", "8 to add"], ["Apply", "Waiting", "Complete"], ["Modules", "Missing", "Reusable"]],
      actions: [
        ["VPC", "terraform init completed - backend and providers ready."],
        ["Subnets", "terraform plan: public and private subnet layout prepared."],
        ["IAM Role", "Least-privilege IAM role attached for platform services."],
        ["Security Group", "Security groups restricted to required traffic."],
        ["EKS", "EKS cluster module applied successfully."],
        ["RDS", "RDS provisioned inside private network."],
        ["S3", "S3 bucket created with lifecycle policy."],
        ["CloudWatch", "CloudWatch logging and metrics enabled."],
      ],
      result: "Infrastructure Provisioned",
      metrics: [["Terraform", "Apply OK"], ["AWS", "8 resources"], ["Modules", "Reusable"]],
    },
    {
      title: "Monitoring Alert Rescue",
      scenario: "Grafana dashboard has red alerts. Reduce MTTR fast.",
      proof: "Shows alert triage, rollback, scaling, and observability habits.",
      visual: "alerts",
      statuses: [["High CPU", "Red", "Green"], ["Crash Loop", "Red", "Green"], ["API Latency", "Red", "Green"], ["Failed Deploy", "Red", "Green"]],
      actions: [
        ["Open Dashboard", "Grafana dashboard opened - noisy alerts grouped by service."],
        ["Inspect Alert", "Root cause found from logs, metrics, and recent deploy event."],
        ["Restart Pod", "Unhealthy pod restarted and readiness restored."],
        ["Scale Service", "Service scaled to handle traffic spike."],
        ["Rollback Deployment", "Bad deployment rolled back to stable version."],
        ["Clear Alert", "Alerts moved from red to green - incident closed."],
      ],
      result: "Monitoring Restored",
      metrics: [["MTTR", "-50%"], ["Alerts", "Green"], ["SLO", "Healthy"]],
    },
    {
      title: "Cloud Cost Optimization",
      scenario: "AWS bill is too high. Find and remove waste.",
      proof: "Shows practical cleanup, right-sizing, lifecycle policies, and cost awareness.",
      visual: "blocks",
      statuses: [["EC2", "Unused", "Removed"], ["EBS", "Unattached", "Deleted"], ["RDS", "Oversized", "Rightsized"], ["S3", "Old logs", "Lifecycle"]],
      actions: [
        ["Remove Unused EC2", "Stopped unused EC2 instance and removed idle spend."],
        ["Delete Unattached EBS", "Detached volume cleaned up after snapshot validation."],
        ["Remove Old Load Balancer", "Old load balancer removed from monthly bill."],
        ["Rightsize RDS", "RDS instance rightsized for real workload pattern."],
        ["Archive Old Logs", "Log retention tuned and archive policy applied."],
        ["Clean Unused S3", "Unused S3 storage transitioned with lifecycle rules."],
      ],
      result: "Cloud Spend Reduced",
      metrics: [["Savings", "25%"], ["Waste", "Removed"], ["FinOps", "Ready"]],
    },
    {
      title: "Security Gate Challenge",
      scenario: "Pipeline has security risks. Protect the release path.",
      proof: "Shows DevSecOps, secret hygiene, image scanning, IAM, and network hardening.",
      visual: "security",
      statuses: [["Secret", "Exposed", "Rotated"], ["Image", "Vulnerable", "Scanned"], ["Security Group", "Open", "Restricted"], ["IAM", "Broad", "Least Privilege"]],
      actions: [
        ["Rotate Secret", "Exposed secret rotated and old credential revoked."],
        ["Scan Image", "Docker image scanned and vulnerable base layer replaced."],
        ["Patch Dependency", "Dependency vulnerability patched and lockfile updated."],
        ["Restrict Security Group", "Open ingress removed from security group."],
        ["Apply IAM Least Privilege", "IAM permissions reduced to required actions only."],
      ],
      result: "Security Scan Passed",
      metrics: [["Risk", "Blocked"], ["IAM", "Least Privilege"], ["Pipeline", "Protected"]],
    },
    {
      title: "Final Hiring System Check",
      scenario: "Run the final recruiter checklist before launch.",
      proof: "Connects resume, skills, projects, GitHub, and DevOps readiness into one hiring signal.",
      visual: "final",
      statuses: [["Resume", "Waiting", "Loaded"], ["Skills", "Waiting", "Verified"], ["Projects", "Waiting", "Validated"], ["GitHub", "Waiting", "Connected"], ["Experience", "Waiting", "Confirmed"], ["Cloud Readiness", "Waiting", "Passed"]],
      actions: [
        ["Resume Loaded", "Resume loaded and ready for recruiter review."],
        ["Skills Verified", "Cloud, Kubernetes, CI/CD, monitoring, and security skills verified."],
        ["Projects Validated", "Project proof validated with real GitHub work."],
        ["GitHub Connected", "GitHub profile connected for technical review."],
        ["DevOps Experience Confirmed", "Experience confirmed across cloud operations and delivery."],
        ["Cloud Readiness Passed", "Reliable infrastructure launch signal is green."],
        ["Hire Signal Strong", "Karthik Bangari is ready to launch reliable infrastructure."],
      ],
      result: "Ready to Launch Reliable Infrastructure",
      metrics: [["Resume", "Ready"], ["Projects", "Verified"], ["Hire", "Strong"]],
    },
  ];

  let activeGame = 0;
  let progress = games.map(() => 0);
  let logs = games.map((game) => [`Scenario loaded - ${game.scenario}`]);

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);

  const renderVisual = (game, done) => {
    if (game.visual === "cluster") {
      return `<div class="game-node-row">${[0, 1, 2].map((node) => `<div class="game-node"><strong>Node ${String.fromCharCode(65 + node)}</strong><div>${[0, 1, 2].map((pod) => `<span class="game-pod ${done > pod + node ? "is-fixed" : ""}">pod</span>`).join("")}</div></div>`).join("")}</div>`;
    }
    if (game.visual === "alerts") {
      return `<div class="game-alert-row">${["CPU", "Crash", "Latency", "Deploy"].map((item, index) => `<div class="game-alert ${done > index ? "is-fixed" : ""}">${item}</div>`).join("")}</div>`;
    }
    if (game.visual === "pipeline") {
      return `<div class="game-block-row">${game.actions.slice(0, 7).map((item, index) => `<div class="game-block" style="--lift:${index % 2 ? "-8px" : "6px"}">${done > index ? "OK " : ""}${escapeHtml(item[0].split(" ")[0])}</div>`).join("")}</div>`;
    }
    if (game.visual === "security") {
      return `<div class="game-alert-row">${["Secret", "Image", "SG", "IAM", "Deps"].map((item, index) => `<div class="game-alert ${done > index ? "is-fixed" : ""}">${item}</div>`).join("")}</div>`;
    }
    return `<div class="game-block-row">${game.actions.slice(0, 8).map((item, index) => `<div class="game-block" style="--lift:${index % 3 ? "-6px" : "8px"}">${done > index ? "OK " : ""}${escapeHtml(item[0].split(" ")[0])}</div>`).join("")}</div>`;
  };

  const render = (container) => {
    const game = games[activeGame];
    const done = progress[activeGame];
    const pct = Math.round((done / game.actions.length) * 100);
    container.innerHTML = `
      <div class="devops-game-lab">
        <div class="game-lab-shell">
          <div class="game-lab-head">
            <div>
              <div class="game-lab-kicker">Premium DevOps Simulation Lab</div>
              <h2 class="game-lab-title">Mini Cloud Games</h2>
              <p class="game-lab-copy">Hands-on simulations that show real DevOps thinking: production rescue, pipelines, Kubernetes, Terraform, monitoring, cost, security, and hiring readiness.</p>
            </div>
            <div class="game-lab-score"><small>Overall progress</small><strong>${Math.round(progress.reduce((a, b, i) => a + b / games[i].actions.length, 0) / games.length * 100)}%</strong></div>
          </div>
          <div class="game-tab-row">
            ${games.map((item, index) => `<button class="game-tab ${index === activeGame ? "is-active" : ""}" data-game-tab="${index}">${index + 1}. ${escapeHtml(item.title)}</button>`).join("")}
          </div>
          <div class="game-workspace">
            <div class="game-panel">
              <h3>${escapeHtml(game.title)}</h3>
              <p class="game-proof">${escapeHtml(game.proof)}</p>
              <div class="game-progress" style="--progress:${pct}%"><span></span></div>
              <div class="game-status-grid">
                ${game.statuses.map((status, index) => `<div class="game-status-card ${done > index || done === game.actions.length ? "is-fixed" : ""}"><small>${escapeHtml(status[0])}</small><strong>${escapeHtml(done > index || done === game.actions.length ? status[2] : status[1])}</strong></div>`).join("")}
              </div>
              <div class="game-visual">${renderVisual(game, done)}</div>
              ${done === game.actions.length ? `<div class="game-result"><h4>${escapeHtml(game.result)}</h4><p>This simulation demonstrates recruiter-ready DevOps execution with clean automation, reliability, security, observability, and measurable impact.</p><div class="game-metric-grid">${game.metrics.map((metric) => `<div class="game-metric-card"><small>${escapeHtml(metric[0])}</small><strong>${escapeHtml(metric[1])}</strong></div>`).join("")}</div></div>` : ""}
            </div>
            <div class="game-panel">
              <div class="game-terminal">
                <div class="game-terminal-label">DevOps terminal output</div>
                ${logs[activeGame].slice(-8).map((log) => `<div class="game-log">$ ${escapeHtml(log)}</div>`).join("")}
              </div>
              <div class="game-action-grid">
                ${game.actions.map((action, index) => `<button class="game-action ${done > index ? "is-done" : ""}" ${index > done ? "disabled" : ""} data-game-action="${index}"><span>${escapeHtml(action[0])}</span><small>${done > index ? "DONE" : index === done ? "RUN" : "LOCKED"}</small></button>`).join("")}
                <button class="game-action" data-game-reset><span>Reset this simulation</span><small>RESET</small></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const attach = (container) => {
    container.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-game-tab]");
      if (tab) {
        activeGame = Number(tab.dataset.gameTab);
        render(container);
        return;
      }
      const reset = event.target.closest("[data-game-reset]");
      if (reset) {
        progress[activeGame] = 0;
        logs[activeGame] = [`Scenario loaded - ${games[activeGame].scenario}`];
        render(container);
        return;
      }
      const action = event.target.closest("[data-game-action]");
      if (!action) return;
      const index = Number(action.dataset.gameAction);
      if (index !== progress[activeGame]) return;
      logs[activeGame].push(games[activeGame].actions[index][1]);
      progress[activeGame] = Math.min(progress[activeGame] + 1, games[activeGame].actions.length);
      if (progress[activeGame] === games[activeGame].actions.length) {
        logs[activeGame].push(`SUCCESS - ${games[activeGame].result}. Hire signal strong.`);
      }
      render(container);
    });
  };

  const waitForApp = (attempts = 0) => {
    const root = document.getElementById("root");
    const target = document.getElementById("rescue") || document.getElementById("fix-cloud") || [...document.querySelectorAll("main > section")].slice(1).find((section) => /fix cloud|cloud farm|production incident|run ci\/cd/i.test(section.textContent || ""));
    if (root?.children.length && target) {
      target.innerHTML = "";
      target.className = "relative overflow-hidden";
      render(target);
      attach(target);
      return;
    }
    if (attempts < 100) window.setTimeout(() => waitForApp(attempts + 1), 100);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => waitForApp(), { once: true });
  } else {
    waitForApp();
  }
})();

(() => {
  const categories = [
    {
      id: "cloud",
      label: "Cloud",
      blurb: "AWS-first cloud platform engineering across compute, networking, and managed data.",
      skills: [
        ["AWS (EC2, VPC, IAM, S3, RDS)", 92],
        ["EKS / Managed Kubernetes", 90],
        ["Networking & Load Balancing", 86],
        ["Cost Optimization & Rightsizing", 88],
      ],
    },
    {
      id: "iac",
      label: "Infrastructure as Code",
      blurb: "Repeatable, version-controlled infrastructure with clean modules and drift control.",
      skills: [
        ["Terraform", 92],
        ["CloudFormation", 80],
        ["Helm Charts", 85],
        ["Ansible", 75],
      ],
    },
    {
      id: "cicd",
      label: "CI / CD & GitOps",
      blurb: "Commit-to-production delivery with gated, automated, observable pipelines.",
      skills: [
        ["Jenkins", 88],
        ["GitHub Actions", 87],
        ["ArgoCD / GitOps", 86],
        ["Docker & Registries", 90],
      ],
    },
    {
      id: "observability",
      label: "Observability",
      blurb: "Metrics, dashboards, and alerting that cut MTTR and keep systems healthy.",
      skills: [
        ["Prometheus", 88],
        ["Grafana", 86],
        ["CloudWatch", 85],
        ["Alerting & SLOs", 82],
      ],
    },
    {
      id: "security",
      label: "DevSecOps",
      blurb: "Security shifted left into the pipeline — scanned images and gated risky paths.",
      skills: [
        ["Image & Dependency Scanning", 84],
        ["AWS Security Hub", 82],
        ["IAM Least Privilege", 86],
        ["Secrets Management", 83],
      ],
    },
  ];

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));

  let activeCategory = 0;
  let revealed = false;

  const level = (value) =>
    value >= 88 ? "Expert" : value >= 80 ? "Advanced" : "Proficient";

  const render = (container) => {
    const category = categories[activeCategory];
    container.innerHTML = `
      <div class="skill-lab-wrap">
        <div class="skill-lab-head">
          <div>
            <div class="skill-lab-kicker">Premium DevOps Capability Matrix</div>
            <h2 class="skill-lab-title">Cloud Toolchain Mastery</h2>
            <p class="skill-lab-copy">A recruiter-ready map of the tools behind the missions above — cloud, infrastructure as code, delivery, observability, and security, with honest proficiency levels.</p>
          </div>
          <div class="skill-lab-badge"><small>4 yrs · AWS DevOps</small><strong>Production Proven</strong></div>
        </div>
        <div class="skill-tab-row">
          ${categories
            .map(
              (item, index) =>
                `<button class="skill-tab ${index === activeCategory ? "is-active" : ""}" data-skill-tab="${index}">${escapeHtml(item.label)}</button>`
            )
            .join("")}
        </div>
        <div class="skill-panel">
          <p class="skill-panel-blurb">${escapeHtml(category.blurb)}</p>
          <div class="skill-bar-grid">
            ${category.skills
              .map(
                ([name, value]) => `
              <div class="skill-bar-card">
                <div class="skill-bar-top">
                  <strong>${escapeHtml(name)}</strong>
                  <span>${escapeHtml(level(value))}</span>
                </div>
                <div class="skill-bar-track">
                  <i class="skill-bar-fill ${revealed ? "is-filled" : ""}" style="--target:${value}%"></i>
                </div>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  };

  const attach = (container) => {
    container.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-skill-tab]");
      if (!tab) return;
      activeCategory = Number(tab.dataset.skillTab);
      render(container);
    });
  };

  const observeReveal = (container) => {
    if (!("IntersectionObserver" in window)) {
      revealed = true;
      render(container);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !revealed) {
            revealed = true;
            render(container);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(container);
  };

  const mount = (anchor) => {
    if (document.getElementById("premium-skills-section")) return;
    const section = document.createElement("section");
    section.id = "premium-skills-section";
    section.className = "relative overflow-hidden skill-lab-section";
    anchor.parentElement.insertBefore(section, anchor);
    render(section);
    attach(section);
    observeReveal(section);
  };

  const findAnchor = () =>
    document.getElementById("contact") ||
    [...document.querySelectorAll("main > section")].at(-1);

  const waitForApp = (attempts = 0) => {
    const root = document.getElementById("root");
    const anchor = findAnchor();
    if (root?.children.length && anchor) {
      mount(anchor);
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

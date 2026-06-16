(() => {
  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  };

  const waitForApp = (callback, attempts = 0) => {
    const root = document.getElementById("root");
    if (root && root.children.length) {
      callback();
      return;
    }
    if (attempts < 80) {
      window.setTimeout(() => waitForApp(callback, attempts + 1), 100);
    }
  };

  const addParticles = () => {
    if (document.querySelector(".luxury-particles")) return;
    const layer = document.createElement("div");
    layer.className = "luxury-particles";
    const total = window.matchMedia("(max-width: 720px)").matches ? 12 : 28;
    for (let i = 0; i < total; i += 1) {
      const dot = document.createElement("span");
      dot.className = "luxury-particle";
      dot.style.left = `${(i * 37) % 100}%`;
      dot.style.top = `${12 + ((i * 19) % 76)}%`;
      dot.style.setProperty("--duration", `${12 + (i % 9)}s`);
      dot.style.setProperty("--x", `${i % 2 ? 28 : -22}px`);
      dot.style.animationDelay = `${-i * 0.7}s`;
      layer.appendChild(dot);
    }
    document.body.appendChild(layer);
  };

  const addCloudBot = () => {
    if (document.querySelector(".luxury-cloud-bot")) return;
    const bot = document.createElement("div");
    bot.className = "luxury-cloud-bot";
    bot.setAttribute("aria-hidden", "true");
    bot.innerHTML = "<i></i>";
    document.body.appendChild(bot);
  };

  const enhanceGlass = () => {
    const cards = document.querySelectorAll(".glass, .glass-sky, .glass-gold, .glass-grass, .glass-lav");
    cards.forEach((card) => {
      if (card.classList.contains("luxury-tilt")) return;
      card.classList.add("luxury-tilt");
      card.addEventListener("pointermove", (event) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  };

  const addProofMetrics = () => {
    const home = document.getElementById("home") || document.querySelector("main > section");
    if (!home || home.querySelector(".luxury-proof-bar")) return;
    const target = home.querySelector("h1, h2")?.parentElement || home.querySelector(".max-w-7xl, .max-w-6xl, .max-w-4xl") || home;
    const bar = document.createElement("div");
    bar.className = "luxury-proof-bar";
    [
      ["4 Years", "Experience"],
      ["AWS", "Kubernetes Terraform"],
      ["CI/CD", "Automation"],
      ["99.5%", "Uptime"],
      ["25%", "Cloud Cost Saved"],
      ["50%", "MTTR Reduced"],
    ].forEach(([value, label]) => {
      const chip = document.createElement("div");
      chip.className = "luxury-proof-chip";
      chip.innerHTML = `<span>${value}</span> ${label}`;
      bar.appendChild(chip);
    });
    target.appendChild(bar);
  };

  const addFinalSystemCheck = () => {
    const contact = document.getElementById("contact") || [...document.querySelectorAll("main > section")].at(-1);
    if (!contact || contact.querySelector(".luxury-system-panel")) return;
    const holder = contact.querySelector(".max-w-3xl, .max-w-4xl, .max-w-6xl") || contact;
    const panel = document.createElement("div");
    panel.className = "luxury-system-panel";
    panel.innerHTML = `
      <div class="luxury-system-title">
        <strong>Final System Check</strong>
        <small>ALL GREEN</small>
      </div>
      <div class="luxury-system-grid">
        <div class="luxury-system-item"><strong>Cloud status</strong><span>Healthy</span></div>
        <div class="luxury-system-item"><strong>CI/CD</strong><span>Ready</span></div>
        <div class="luxury-system-item"><strong>Kubernetes</strong><span>Stable</span></div>
        <div class="luxury-system-item"><strong>Monitoring</strong><span>Online</span></div>
        <div class="luxury-system-item"><strong>Security</strong><span>Passed</span></div>
        <div class="luxury-system-item"><strong>Hire Signal</strong><span>Strong</span></div>
      </div>
    `;
    holder.appendChild(panel);
  };

  const activateNav = () => {
    const links = [...document.querySelectorAll('a[href^="#"]')];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    if (!links.length || !sections.length) return;

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const section = document.querySelector(link.getAttribute("href"));
        if (!section) return;
        event.preventDefault();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    const update = () => {
      const midpoint = window.innerHeight * 0.35;
      let current = sections[0]?.id;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= midpoint && rect.bottom >= midpoint) current = section.id;
      });
      links.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${current}`;
        link.classList.toggle("luxury-active-nav", isActive);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  };

  onReady(() => {
    document.body.classList.add("luxury-valley-ready");
    waitForApp(() => {
      addParticles();
      addCloudBot();
      addProofMetrics();
      addFinalSystemCheck();
      activateNav();
      enhanceGlass();
      window.setTimeout(enhanceGlass, 1200);
    });
  });
})();

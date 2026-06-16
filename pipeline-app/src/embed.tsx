// PRODUCTION entry. Self-mounting embed script loaded by the live index.html.
// Waits for the host site, injects an isolated container, and renders the
// section into its own React root. Never touches the host's #root.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ensureContainer, waitForHost } from "./mount";
import { CICDPipelineSection } from "./sections/cicd-pipeline/CICDPipelineSection";

const boot = () => {
  const container = ensureContainer();
  // Guard against double-injection if the script is evaluated twice.
  if (container.dataset.mounted === "true") return;
  container.dataset.mounted = "true";

  createRoot(container).render(
    <StrictMode>
      <CICDPipelineSection />
    </StrictMode>,
  );
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => waitForHost(boot), {
    once: true,
  });
} else {
  waitForHost(boot);
}

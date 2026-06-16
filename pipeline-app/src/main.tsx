// DEV entry. Mounts the section into the dev host page (index.html) with HMR.
// Mirrors the production embed flow so dev and prod behave identically.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ensureContainer, waitForHost } from "./mount";
import { CICDPipelineSection } from "./sections/cicd-pipeline/CICDPipelineSection";

waitForHost(() => {
  const container = ensureContainer();
  createRoot(container).render(
    <StrictMode>
      <CICDPipelineSection />
    </StrictMode>,
  );
});

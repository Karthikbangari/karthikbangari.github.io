// Shared mount helper used by both the dev entry (main.tsx) and the production
// embed entry (embed.tsx). It locates/creates an ISOLATED container for the
// section and never touches the host site's #root (owned by the original
// minified bundle).

const SECTION_ID = "cicd-pipeline-root";

/**
 * Find the host site's contact section to anchor before, or fall back to the
 * last <main> section, or finally <body>.
 */
const findAnchor = (): Element | null =>
  document.getElementById("contact") ??
  [...document.querySelectorAll("main > section")].at(-1) ??
  document.body;

/**
 * Create (once) and return the dedicated section element the React tree mounts
 * into. Inserted immediately BEFORE the anchor so it lands right above contact.
 */
export const ensureContainer = (): HTMLElement => {
  const existing = document.getElementById(SECTION_ID);
  if (existing) return existing as HTMLElement;

  const section = document.createElement("section");
  section.id = SECTION_ID;
  section.setAttribute("aria-label", "Inside My CI/CD Pipeline");

  const anchor = findAnchor();
  if (anchor && anchor !== document.body && anchor.parentElement) {
    anchor.parentElement.insertBefore(section, anchor);
  } else {
    document.body.appendChild(section);
  }
  return section;
};

/**
 * Wait for the host React app to finish first render before injecting, so the
 * section lands in a stable DOM. Resolves immediately on the dev host page.
 */
export const waitForHost = (onReady: () => void, attempts = 0): void => {
  const root = document.getElementById("root");
  const hostReady = !root || root.children.length > 0; // dev host has no #root
  if (hostReady && findAnchor()) {
    onReady();
    return;
  }
  if (attempts < 100) {
    window.setTimeout(() => waitForHost(onReady, attempts + 1), 100);
  }
};

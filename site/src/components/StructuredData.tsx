import { profile } from "../data/profile";
import { links } from "../data/links";

export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: "https://karthikbangari.github.io/",
    image: `https://karthikbangari.github.io${profile.photo}`,
    // Only the confirmed GitHub URL goes into structured data — LinkedIn is
    // still an unverified guess (see data/links.ts) and shouldn't be
    // published as a machine-readable identity claim until confirmed.
    sameAs: [links.github],
  };

  return (
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  );
}

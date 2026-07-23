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
    sameAs: [links.github, links.linkedin],
  };

  return (
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  );
}

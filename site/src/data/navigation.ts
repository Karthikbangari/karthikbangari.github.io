export type NavItem = {
  index: string;
  label: string;
  description: string;
  href: string;
};

export const navItems: NavItem[] = [
  {
    index: "01",
    label: "About",
    description: "How I moved from infrastructure operations to production platform ownership.",
    href: "#about",
  },
  {
    index: "02",
    label: "Best Work",
    description: "The cloud systems and automation projects I am most proud of.",
    href: "#work",
  },
  {
    index: "03",
    label: "Experience",
    description: "Four years of infrastructure, delivery, security and reliability engineering.",
    href: "#experience",
  },
  {
    index: "04",
    label: "Build Lab",
    description: "Open-source tools and technical experiments.",
    href: "#lab",
  },
  {
    index: "05",
    label: "Contact",
    description: "Let's build reliable systems together.",
    href: "#contact",
  },
];

export const headerNavItems = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Lab", href: "#lab" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

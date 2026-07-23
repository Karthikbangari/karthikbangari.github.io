import { profile } from "../data/profile";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="aspect-square w-40 overflow-hidden rounded-2xl border border-white/10 lg:w-full">
            <img
              src={profile.photo}
              alt="Karthik Bangari"
              className="h-full w-full object-cover"
              loading="lazy"
              width={280}
              height={280}
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">01 — About</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            How I learned to make production less stressful.
          </h2>

          <div className="mt-6 max-w-2xl space-y-4 text-base text-muted">
            <p>
              I'm a DevOps Engineer with 4 years of experience, based in Bratislava and available
              for European opportunities. I started as a Junior DevOps Engineer keeping release
              pipelines and AWS infrastructure running, migrating 8 legacy applications and
              automating 30+ servers along the way.
            </p>
            <p>
              That work turned into ownership: building GitOps delivery with Jenkins and ArgoCD,
              writing reusable Terraform modules, wiring in DevSecOps controls, and putting
              Prometheus and Grafana in front of production so incidents get caught before users
              notice them.
            </p>
            <p>
              My focus now is the same instinct applied further upstream — Platform Engineering
              and SRE: secure self-service infrastructure, better developer experience, and cloud
              platforms that stay boring under load.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

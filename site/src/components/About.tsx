import { profile } from "../data/profile";
import StickyNote from "./StickyNote";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-cream px-6 py-24 text-navy">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
            01 — The beginning
          </p>

          <h2 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            I started <span className="font-hand text-blue">automating</span> small
            infrastructure tasks.
            <br />
            Then it became a way of thinking.
            <br />
            <span className="font-hand text-blue">Reliability</span> came next.
          </h2>

          <div className="mt-8 max-w-xl space-y-4 text-base text-muted-ink">
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
              My focus now is the same instinct applied further upstream —{" "}
              <span className="font-hand text-blue text-lg">platform</span> engineering and SRE:
              secure self-service infrastructure, better developer experience, and cloud platforms
              that stay boring under load.
            </p>
          </div>

          <div className="mt-8 inline-block rounded-md bg-navy px-5 py-4 font-mono text-xs text-signal">
            <p>$ whoami</p>
            <p className="text-paper">karthik-bangari</p>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-6 lg:items-end">
          <div className="rotate-2 bg-paper p-3 shadow-[0_12px_30px_rgba(12,12,12,0.2)]">
            <div className="h-56 w-56 overflow-hidden">
              <img
                src={profile.photo}
                alt="Karthik Bangari"
                className="h-full w-full object-cover"
                loading="lazy"
                width={224}
                height={224}
              />
            </div>
            <p className="mt-2 text-center font-note text-lg text-navy">Karthik, Bratislava</p>
          </div>

          <StickyNote rotate="-2deg" className="w-64 text-sm">
            I kept improving systems because I liked seeing repetitive work disappear.
          </StickyNote>
        </div>
      </div>
    </section>
  );
}

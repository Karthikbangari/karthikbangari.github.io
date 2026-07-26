import { profile } from "../../data/profile";
import { metrics } from "../../data/metrics";
import { experienceStages } from "../../data/experience";
import StickyNote from "../../components/StickyNote";

export function OriginBioScene() {
  return (
    <div className="flex h-full w-full items-center overflow-hidden bg-cream py-16 text-navy">
      <div className="mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-10 px-10 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">01 — Origin</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            I started <span className="font-hand text-blue">automating</span> small infrastructure
            tasks. Then it became a way of thinking.
          </h2>

          <div className="mt-6 max-w-2xl space-y-3 text-sm text-muted-ink sm:text-base">
            <p>
              I'm a DevOps Engineer with 4 years of experience, based in Bratislava. Started as a
              Junior DevOps Engineer keeping release pipelines and AWS infrastructure running,
              migrating 8 legacy applications and automating 30+ servers.
            </p>
            <p>
              That turned into ownership: GitOps delivery, Terraform modules, DevSecOps controls,
              and observability so incidents get caught before users notice.
            </p>
            <p>
              My focus now is the same instinct applied further upstream — platform engineering
              and SRE: secure self-service infrastructure, better developer experience, and cloud
              platforms that stay boring under load.
            </p>
          </div>

          <div className="mt-6 inline-block rounded-md bg-navy px-5 py-3 font-mono text-xs text-signal">
            <p>$ whoami</p>
            <p className="text-paper">karthik-bangari</p>
          </div>

          <p className="mt-6 font-note text-lg text-blue">— {profile.name}</p>
        </div>

        <div className="hidden flex-col items-center gap-5 lg:flex">
          <div className="rotate-2 bg-paper p-3 shadow-[0_12px_30px_rgba(12,12,12,0.2)]">
            <div className="h-44 w-44 overflow-hidden">
              <img src={profile.photo} alt="Karthik Bangari" className="h-full w-full object-cover" />
            </div>
            <p className="mt-2 text-center font-note text-base text-navy">Karthik, Bratislava</p>
          </div>
          <StickyNote rotate="-2deg" className="w-56 text-xs">
            I kept improving systems because I liked seeing repetitive work disappear.
          </StickyNote>
        </div>
      </div>
    </div>
  );
}

export function OriginImpactScene() {
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-cream px-10 py-16 text-navy">
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">02 — Impact</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          The numbers behind the systems.
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-sm bg-paper p-5 shadow-[0_10px_24px_rgba(12,12,12,0.12)]">
              <div className="font-display text-3xl font-bold text-blue">{m.value}</div>
              <div className="mt-1 text-sm font-semibold text-navy">{m.label}</div>
              <p className="mt-2 text-xs text-muted-ink">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OriginTimelineScene() {
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-cream px-10 py-16 text-navy">
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">03 — Path</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          From junior engineer to platform direction.
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {experienceStages.map((stage) => (
            <div key={stage.year} className="border-l-2 border-blue/30 pl-4">
              <p className="font-mono text-xs text-blue">{stage.year}</p>
              <p className="font-display text-lg font-semibold text-navy">{stage.title}</p>
              {stage.promotion && (
                <span className="mt-1 inline-block -rotate-2 rounded-sm bg-signal px-2 py-0.5 font-note text-sm text-navy">
                  Promoted ↑
                </span>
              )}
              <ul className="mt-3 space-y-1 text-xs text-muted-ink">
                {stage.highlights.slice(0, 4).map((h) => (
                  <li key={h}>— {h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

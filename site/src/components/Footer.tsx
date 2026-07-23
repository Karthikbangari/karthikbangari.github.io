import { useEffect, useRef } from "react";
import { profile } from "../data/profile";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "../lib/motion";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const signatureRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(footerRef.current, { autoAlpha: 0, y: 24 });
      gsap.set(signatureRef.current, { autoAlpha: 0, scale: 0.85 });

      gsap
        .timeline({ scrollTrigger: { trigger: footerRef.current, start: "top 95%", once: true } })
        .to(footerRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)
        .to(signatureRef.current, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }, 0.2);
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-cream px-6 py-10 text-navy">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-ink">
            Bye, have a great day at your job.
            <br />
            Hoping you get fewer boring portfolios to review.
          </p>
        </div>
        <div className="text-right">
          <p ref={signatureRef} className="font-hand text-3xl text-blue">
            {profile.name}
          </p>
          <p className="font-mono text-xs text-muted-ink">{profile.role}</p>
        </div>
      </div>
    </footer>
  );
}

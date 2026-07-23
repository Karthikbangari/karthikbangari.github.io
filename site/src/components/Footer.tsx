import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="bg-cream px-6 py-10 text-navy">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-ink">
            Bye, have a great day at your job.
            <br />
            Hoping you get fewer boring portfolios to review.
          </p>
        </div>
        <div className="text-right">
          <p className="font-hand text-3xl text-blue">{profile.name}</p>
          <p className="font-mono text-xs text-muted-ink">{profile.role}</p>
        </div>
      </div>
    </footer>
  );
}

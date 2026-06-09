import { profile } from '../data/portfolio.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)]">
      <div className="container-wide flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-tertiary">
          © {year} <span className="text-accent">{profile.name}</span>
        </p>
        <div className="flex items-center gap-6">
          <a href={profile.github} target="_blank" rel="noreferrer"
             className="text-xs text-tertiary hover:text-accent transition-colors duration-300">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"
             className="text-xs text-tertiary hover:text-accent transition-colors duration-300">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}
             className="text-xs text-tertiary hover:text-accent transition-colors duration-300">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

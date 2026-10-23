import { Badge } from "./Badge.jsx";

export function EmptyState({ eyebrow, title, body }) {
  return (
    <section className="max-w-2xl rounded-surface border border-line bg-white p-8 shadow-card">
      <Badge>{eyebrow}</Badge>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-base leading-6 text-muted">{body}</p>
    </section>
  );
}

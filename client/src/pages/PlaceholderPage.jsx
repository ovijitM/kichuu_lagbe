import { EmptyState } from "../components/EmptyState.jsx";

export function PlaceholderPage({ eyebrow, title, body }) {
  return <EmptyState eyebrow={eyebrow} title={title} body={body} />;
}

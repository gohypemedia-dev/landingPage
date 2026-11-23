// Shown while an admin page loads its (deliberately uncached) data. The layout's
// <Suspense> only covers full page loads; client navigations between admin pages
// re-render below the layout, so each page needs this boundary of its own.
export default function AdminLoading() {
  return <div className="adm-loading">Loading…</div>;
}

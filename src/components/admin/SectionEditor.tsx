"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { resetSectionAction, saveSectionAction } from "@/app/admin/actions";
import { SchemaForm } from "@/components/admin/SchemaForm";
import { siteContentSchemas, type SiteContent, type SiteContentKey } from "@/lib/site-content/schema";
import type { SectionStatus } from "@/lib/server/site-content";

export function SectionEditor<K extends SiteContentKey>({
  sectionKey,
  title,
  description,
  initial,
  status,
  siteWide = false,
  back,
}: {
  /** The list this section is managed from (none for a section with its own menu item). */
  back?: { href: string; label: string } | null;
  /** Shown on every page and reached from its own menu item, not the homepage list. */
  siteWide?: boolean;
  sectionKey: K;
  title: string;
  description: string;
  initial: SiteContent[K];
  status: SectionStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<unknown>(initial);
  const [saved, setSaved] = useState<unknown>(initial);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  const save = () =>
    startTransition(async () => {
      const result = await saveSectionAction(sectionKey, value);
      if (result.ok) {
        setSaved(value);
        setMessage({ kind: "ok", text: `Published. The ${siteWide ? "website" : "homepage"} now shows this version.` });
        router.refresh();
      } else {
        setMessage({ kind: "error", text: result.message });
      }
    });

  const reset = () => {
    if (!confirm(`Reset “${title}” to the original website design? Your edits to this section will be removed.`)) return;
    startTransition(async () => {
      const result = await resetSectionAction(sectionKey);
      if (result.ok) {
        // Reload so the form shows the original values the server now returns.
        window.location.reload();
      } else {
        setMessage({ kind: "error", text: result.message });
      }
    });
  };

  return (
    <div className="adm-editor">
      <header className="adm-page-head adm-sticky">
        <div>
          {back && (
            <Link href={back.href} className="adm-back">
              ← {back.label}
            </Link>
          )}
          <h1>{title}</h1>
          <p className="adm-muted">
            {description}
            {" · "}
            {status
              ? `Edited ${new Date(status.updatedAt).toLocaleString("en-IN")}${status.updatedBy ? ` by ${status.updatedBy}` : ""}`
              : "Showing the original design"}
          </p>
        </div>
        <span className="adm-row">
          <a href="/" target="_blank" rel="noreferrer" className="adm-btn adm-btn--ghost">
            View site ↗
          </a>
          {status && (
            <button type="button" className="adm-btn adm-btn--ghost" disabled={pending} onClick={reset}>
              Reset to original
            </button>
          )}
          <button type="button" className="adm-btn adm-btn--ghost" disabled={!dirty || pending} onClick={() => setValue(saved)}>
            Discard
          </button>
          <button type="button" className="adm-btn adm-btn--primary" disabled={!dirty || pending} onClick={save}>
            {pending ? "Saving…" : "Save & publish"}
          </button>
        </span>
      </header>

      {message && (
        <p className={`adm-alert adm-alert--${message.kind === "ok" ? "ok" : "error"}`} role="status">
          {message.text}
        </p>
      )}

      <div className="adm-card">
        <SchemaForm schema={siteContentSchemas[sectionKey]} value={value} onChange={setValue} />
      </div>
    </div>
  );
}

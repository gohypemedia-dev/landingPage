"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { setSectionEnabledAction } from "@/app/admin/actions";

/** Shows or hides a section on the website right away, without opening its editor. */
export function SectionSwitch({ sectionKey, enabled, title }: { sectionKey: string; enabled: boolean; title: string }) {
  const router = useRouter();
  const [on, setOn] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = (next: boolean) => {
    setOn(next);
    setError(null);
    startTransition(async () => {
      const result = await setSectionEnabledAction(sectionKey, next);
      if (result.ok) router.refresh();
      else {
        setOn(!next);
        setError(result.message);
      }
    });
  };

  return (
    <span className="adm-switch-wrap">
      <label className="adm-switch">
        <input
          type="checkbox"
          checked={on}
          disabled={pending}
          aria-label={`Show ${title} on the website`}
          onChange={(e) => toggle(e.target.checked)}
        />
        <span className="adm-switch-track" aria-hidden="true" />
        <span>{pending ? "Saving…" : on ? "Showing on website" : "Hidden"}</span>
      </label>
      {error && <small className="adm-error-text">{error}</small>}
    </span>
  );
}

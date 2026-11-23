"use client";

/* eslint-disable @next/next/no-img-element -- previews of uploaded media */

import { useRef, useState } from "react";

import { deleteMediaAction, updateMediaAltAction } from "@/app/admin/actions";
import { formatBytes, uploadMedia } from "@/components/admin/upload";
import type { MediaItem } from "@/lib/media";

export function MediaLibrary({ initial, storageNote }: { initial: MediaItem[]; storageNote: string | null }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL");
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadAll = async (files: File[]) => {
    setError(null);
    const failures: string[] = [];
    for (const [i, file] of files.entries()) {
      setProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
      try {
        const item = await uploadMedia(file);
        setItems((prev) => [item, ...prev]);
      } catch (e) {
        failures.push(e instanceof Error ? e.message : `${file.name} failed`);
      }
    }
    setProgress(null);
    if (failures.length) setError(failures.join(" "));
  };

  const remove = async (item: MediaItem) => {
    if (!confirm(`Delete ${item.fileName}? This cannot be undone.`)) return;
    let result = await deleteMediaAction(item.id);
    if (result.ok && result.data?.usedIn?.length) {
      const sections = result.data.usedIn.join(", ");
      if (!confirm(`${item.fileName} is used on the homepage in: ${sections}. Delete it anyway? Those spots will show a broken image.`)) return;
      result = await deleteMediaAction(item.id, true);
    }
    if (result.ok) setItems((prev) => prev.filter((m) => m.id !== item.id));
    else setError(result.message);
  };

  const saveAlt = async (item: MediaItem, alt: string) => {
    if (alt === item.alt) return;
    const result = await updateMediaAltAction(item.id, alt);
    if (result.ok) setItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, alt } : m)));
    else setError(result.message);
  };

  const visible = filter === "ALL" ? items : items.filter((m) => m.kind === filter);

  return (
    <>
      {storageNote && <p className="adm-alert adm-alert--info">{storageNote}</p>}

      <div
        className={`adm-dropzone${dragging ? " is-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          uploadAll(Array.from(e.dataTransfer.files));
        }}
      >
        <p>
          <strong>Drop images or videos here</strong> or{" "}
          <button type="button" className="adm-link" onClick={() => fileRef.current?.click()}>
            browse
          </button>
        </p>
        <small>JPG, PNG, WebP, AVIF up to 10 MB · MP4, WebM up to 100 MB</small>
        {progress && <p className="adm-muted">{progress}</p>}
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) uploadAll(files);
          }}
        />
      </div>

      {error && <p className="adm-alert adm-alert--error">{error}</p>}

      <div className="adm-tabs" role="tablist">
        {(["ALL", "IMAGE", "VIDEO"] as const).map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? "is-active" : ""} onClick={() => setFilter(f)}>
            {f === "ALL" ? "All" : f === "IMAGE" ? "Images" : "Videos"} ({f === "ALL" ? items.length : items.filter((m) => m.kind === f).length})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="adm-muted">No files yet.</p>
      ) : (
        <div className="adm-media-grid adm-media-grid--large">
          {visible.map((m) => (
            <figure key={m.id} className="adm-media-card">
              <a href={m.url} target="_blank" rel="noreferrer" className="adm-media-card-preview">
                {m.kind === "IMAGE" ? <img src={m.url} alt={m.alt} loading="lazy" /> : <video src={m.url} muted playsInline preload="metadata" controls />}
              </a>
              <figcaption>
                <strong title={m.fileName}>{m.fileName}</strong>
                <small>
                  {formatBytes(m.size)} · {new Date(m.createdAt).toLocaleDateString("en-IN")}
                </small>
                {m.kind === "IMAGE" && (
                  <input
                    type="text"
                    defaultValue={m.alt}
                    placeholder="Describe the photo"
                    aria-label={`Description of ${m.fileName}`}
                    onBlur={(e) => saveAlt(m, e.target.value.trim())}
                  />
                )}
                <span className="adm-row">
                  <button type="button" className="adm-btn adm-btn--small adm-btn--ghost" onClick={() => navigator.clipboard.writeText(m.url)}>
                    Copy URL
                  </button>
                  <button type="button" className="adm-btn adm-btn--small adm-btn--danger" onClick={() => remove(m)}>
                    Delete
                  </button>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}

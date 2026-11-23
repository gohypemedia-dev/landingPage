"use client";

/* eslint-disable @next/next/no-img-element -- previews of uploaded media */

import { useEffect, useRef, useState } from "react";

import { listMediaAction } from "@/app/admin/actions";
import { uploadMedia } from "@/components/admin/upload";
import type { MediaItem, MediaKind } from "@/lib/media";

/** Modal for picking an uploaded file (or uploading a new one) for an image/video field. */
export function MediaPicker({
  kind,
  onSelect,
  onClose,
}: {
  kind: MediaKind;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listMediaAction(kind).then((r) => (r.ok ? setItems(r.data ?? []) : setError(r.message)));
  }, [kind]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const item = await uploadMedia(file);
      onSelect(item.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="adm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal" role="dialog" aria-modal="true" aria-label={`Choose ${kind === "IMAGE" ? "an image" : "a video"}`}>
        <div className="adm-modal-head">
          <h2>{kind === "IMAGE" ? "Choose an image" : "Choose a video"}</h2>
          <span className="adm-row">
            <button type="button" className="adm-btn adm-btn--primary" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={onClose}>
              Close
            </button>
          </span>
          <input
            ref={fileRef}
            type="file"
            hidden
            accept={kind === "IMAGE" ? "image/jpeg,image/png,image/webp,image/avif" : "video/mp4,video/webm"}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) upload(file);
            }}
          />
        </div>

        {error && <p className="adm-alert adm-alert--error">{error}</p>}

        {items === null ? (
          <p className="adm-muted">Loading…</p>
        ) : items.length === 0 ? (
          <p className="adm-muted">Nothing uploaded yet. Use “Upload new”, or paste a path such as /images/hero.jpg into the field.</p>
        ) : (
          <div className="adm-media-grid">
            {items.map((m) => (
              <button key={m.id} type="button" className="adm-media-tile" onClick={() => onSelect(m.url)} title={m.fileName}>
                {m.kind === "IMAGE" ? (
                  <img src={m.url} alt={m.alt} loading="lazy" />
                ) : (
                  <video src={m.url} muted playsInline preload="metadata" />
                )}
                <span>{m.fileName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

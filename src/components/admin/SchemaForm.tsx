"use client";

/* eslint-disable @next/next/no-img-element -- previews of arbitrary URLs */

import { useState } from "react";
import type { z } from "zod";

import type { FieldMeta } from "@/lib/site-content/schema";
import { MediaPicker } from "@/components/admin/MediaPicker";

/**
 * Renders an editing form for any section schema in
 * src/lib/site-content/schema.ts by walking the Zod schema. Labels and input
 * types come from each field's `.meta()`.
 */

type AnySchema = z.ZodType;
type Path = (string | number)[];

const typeOf = (s: AnySchema) => (s as unknown as { def: { type: string } }).def.type;
const metaOf = (s: AnySchema): FieldMeta => ((s as unknown as { meta: () => FieldMeta | undefined }).meta() ?? {});

/**
 * Keeps the typed text separately from the stored number, so the box can be
 * empty while editing (an empty box still saves as 0) instead of snapping
 * back to "0" and leaving the next keystrokes after it.
 */
function NumberInput({
  value,
  onChange,
  ...props
}: { id: string; min?: number; max?: number; value: number; onChange: (n: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  // Follow outside changes (e.g. Discard) without fighting what the user is typing.
  const draftNumber = draft.trim() === "" ? 0 : Number(draft);
  if (draftNumber !== value) setDraft(String(value));

  return (
    <input
      {...props}
      type="number"
      inputMode="numeric"
      value={draft}
      onChange={(e) => {
        const text = e.target.value;
        const n = text.trim() === "" ? 0 : Number(text);
        if (!Number.isFinite(n)) return;
        setDraft(text);
        onChange(n);
      }}
      onBlur={() => draft.trim() !== "" && setDraft(String(value))}
    />
  );
}

function unwrap(s: AnySchema): AnySchema {
  let cur = s;
  while (["optional", "default", "nullable"].includes(typeOf(cur))) {
    cur = (cur as unknown as { unwrap: () => AnySchema }).unwrap();
  }
  return cur;
}

const shapeOf = (s: AnySchema) => (s as unknown as { shape: Record<string, AnySchema> }).shape;
const elementOf = (s: AnySchema) => (s as unknown as { element: AnySchema }).element;
type Check = { _zod: { def: { check: string; maximum?: number } } };
const maxItemsOf = (s: AnySchema) => {
  const checks = (s as unknown as { def: { checks?: Check[] } }).def.checks ?? [];
  const max = checks.find((c) => c._zod.def.check === "max_length")?._zod.def.maximum;
  return max ?? Infinity;
};

const humanize = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

/** A blank value matching the schema, used when adding a list item. */
export function emptyValue(schema: AnySchema): unknown {
  const s = unwrap(schema);
  switch (typeOf(s)) {
    case "string":
      return "";
    case "number":
      return (s as unknown as { minValue: number | null }).minValue ?? 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return Object.fromEntries(Object.entries(shapeOf(s)).map(([k, v]) => [k, emptyValue(v)]));
    default:
      return null;
  }
}

function setIn(root: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy;
  }
  const obj = (root ?? {}) as Record<string, unknown>;
  return { ...obj, [head]: setIn(obj[head as string], rest, value) };
}

type FieldProps = {
  schema: AnySchema;
  value: unknown;
  path: Path;
  label: string;
  onChange: (path: Path, value: unknown) => void;
};

function Field({ schema, value, path, label, onChange }: FieldProps) {
  const s = unwrap(schema);
  const meta = { ...metaOf(s), ...metaOf(schema) };
  const title = meta.label ?? label;
  const id = `f-${path.join("-")}`;
  const type = typeOf(s);

  if (type === "object") {
    return (
      <fieldset className="adm-group">
        {path.length > 0 && <legend>{title}</legend>}
        {Object.entries(shapeOf(s)).map(([key, child]) => (
          <Field
            key={key}
            schema={child}
            value={(value as Record<string, unknown> | undefined)?.[key]}
            path={[...path, key]}
            label={humanize(key)}
            onChange={onChange}
          />
        ))}
      </fieldset>
    );
  }

  if (type === "array" && meta.widget === "checklist") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    const options = meta.options ?? [];
    // Keep any value without an option (e.g. a deleted category) visible so it can be unticked.
    const all = [...options, ...selected.filter((v) => !options.some((o) => o.value === v)).map((v) => ({ value: v, label: v }))];
    return (
      <fieldset className="adm-field adm-checklist">
        <legend className="adm-label">{title}</legend>
        <div className="adm-checklist-items">
          {all.map((o) => (
            <label key={o.value}>
              <input
                type="checkbox"
                checked={selected.includes(o.value)}
                onChange={(e) =>
                  onChange(path, e.target.checked ? [...selected, o.value] : selected.filter((v) => v !== o.value))
                }
              />
              {o.label}
            </label>
          ))}
        </div>
        {meta.help && <small>{meta.help}</small>}
      </fieldset>
    );
  }

  if (type === "array") return <ListField schema={s} meta={meta} value={value} path={path} label={title} onChange={onChange} />;

  if (type === "enum") {
    const values = (s as unknown as { options: string[] }).options;
    const labelFor = (v: string) => meta.options?.find((o) => o.value === v)?.label ?? humanize(v);
    return (
      <div className="adm-field">
        <label htmlFor={id}>{title}</label>
        <select id={id} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(path, e.target.value)}>
          {values.map((v) => (
            <option key={v} value={v}>
              {labelFor(v)}
            </option>
          ))}
        </select>
        {meta.help && <small>{meta.help}</small>}
      </div>
    );
  }

  if (type === "boolean") {
    return (
      <label className="adm-switch" htmlFor={id}>
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(path, e.target.checked)} />
        <span className="adm-switch-track" aria-hidden="true" />
        <span>{title}</span>
      </label>
    );
  }

  if (type === "number") {
    const { minValue, maxValue } = s as unknown as { minValue: number | null; maxValue: number | null };
    return (
      <div className="adm-field">
        <label htmlFor={id}>{title}</label>
        <NumberInput
          id={id}
          min={minValue ?? undefined}
          max={maxValue ?? undefined}
          value={typeof value === "number" ? value : 0}
          onChange={(n) => onChange(path, n)}
        />
        {meta.help && <small>{meta.help}</small>}
      </div>
    );
  }

  const str = typeof value === "string" ? value : "";

  if (meta.widget === "image" || meta.widget === "video") {
    return <MediaField id={id} kind={meta.widget} title={title} help={meta.help} value={str} onChange={(v) => onChange(path, v)} />;
  }

  return (
    <div className="adm-field">
      <label htmlFor={id}>{title}</label>
      {meta.widget === "textarea" ? (
        <textarea id={id} rows={4} value={str} onChange={(e) => onChange(path, e.target.value)} />
      ) : meta.widget === "datetime" ? (
        <input id={id} type="datetime-local" value={str} onChange={(e) => onChange(path, e.target.value)} />
      ) : meta.widget === "color" ? (
        <span className="adm-color">
          <input type="color" aria-label={`${title} picker`} value={/^#[0-9a-f]{6}$/i.test(str) ? str : "#000000"} onChange={(e) => onChange(path, e.target.value)} />
          <input id={id} type="text" value={str} onChange={(e) => onChange(path, e.target.value)} />
        </span>
      ) : (
        <input id={id} type="text" value={str} onChange={(e) => onChange(path, e.target.value)} />
      )}
      {meta.help && <small>{meta.help}</small>}
    </div>
  );
}

function MediaField({
  id,
  kind,
  title,
  help,
  value,
  onChange,
}: {
  id: string;
  kind: "image" | "video";
  title: string;
  help?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [picking, setPicking] = useState(false);
  return (
    <div className="adm-field">
      <label htmlFor={id}>{title}</label>
      <div className="adm-media-field">
        <div className="adm-media-thumb">
          {!value ? (
            <span>None</span>
          ) : kind === "image" ? (
            <img src={value} alt="" />
          ) : (
            <video src={value} muted playsInline preload="metadata" />
          )}
        </div>
        <div className="adm-media-controls">
          <input id={id} type="text" value={value} placeholder="/images/… or https://…" onChange={(e) => onChange(e.target.value)} />
          <span className="adm-row">
            <button type="button" className="adm-btn adm-btn--small" onClick={() => setPicking(true)}>
              {kind === "image" ? "Choose image" : "Choose video"}
            </button>
            {value && (
              <button type="button" className="adm-btn adm-btn--small adm-btn--ghost" onClick={() => onChange("")}>
                Clear
              </button>
            )}
          </span>
        </div>
      </div>
      {help && <small>{help}</small>}
      {picking && (
        <MediaPicker
          kind={kind === "image" ? "IMAGE" : "VIDEO"}
          onClose={() => setPicking(false)}
          onSelect={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

function ListField({
  schema,
  meta,
  value,
  path,
  label,
  onChange,
}: {
  schema: AnySchema;
  meta: FieldMeta;
  value: unknown;
  path: Path;
  label: string;
  onChange: (path: Path, value: unknown) => void;
}) {
  const items = Array.isArray(value) ? value : [];
  const element = elementOf(schema);
  const isObjects = typeOf(unwrap(element)) === "object";
  const max = maxItemsOf(schema);
  const [open, setOpen] = useState<number | null>(null);

  const update = (next: unknown[]) => onChange(path, next);
  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
    if (open === i) setOpen(j);
  };

  const itemTitle = (item: unknown, i: number) => {
    const v = meta.itemLabel ? (item as Record<string, unknown>)?.[meta.itemLabel] : undefined;
    return typeof v === "string" && v.trim() ? v : `Item ${i + 1}`;
  };

  // Lists of photos: one picker per photo.
  const elementMeta = metaOf(unwrap(element));
  if (elementMeta.widget === "image" || elementMeta.widget === "video") {
    const kind = elementMeta.widget;
    return (
      <div className="adm-field">
        <span className="adm-label">
          {label} <em>({items.length})</em>
        </span>
        {items.map((item, i) => (
          <div key={i} className="adm-media-row">
            <MediaField
              id={`f-${[...path, i].join("-")}`}
              kind={kind}
              title={`${elementMeta.label ?? "Item"} ${i + 1}`}
              value={typeof item === "string" ? item : ""}
              onChange={(v) => update(items.map((x, k) => (k === i ? v : x)))}
            />
            <span className="adm-item-actions">
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                ↓
              </button>
              <button type="button" aria-label="Remove" className="is-danger" onClick={() => update(items.filter((_, k) => k !== i))}>
                ×
              </button>
            </span>
          </div>
        ))}
        {items.length < max && (
          <span>
            <button type="button" className="adm-btn adm-btn--small" onClick={() => update([...items, ""])}>
              + Add {kind === "image" ? "photo" : "video"}
            </button>
          </span>
        )}
        {meta.help && <small>{meta.help}</small>}
      </div>
    );
  }

  // Simple lists of strings (perks, banks, tags) edit inline.
  if (!isObjects) {
    return (
      <div className="adm-field">
        <span className="adm-label">{label}</span>
        <div className="adm-chips">
          {items.map((item, i) => (
            <span key={i} className="adm-chip">
              <input
                type="text"
                aria-label={`${label} ${i + 1}`}
                value={typeof item === "string" ? item : ""}
                onChange={(e) => update(items.map((x, k) => (k === i ? e.target.value : x)))}
              />
              <button type="button" aria-label="Remove" onClick={() => update(items.filter((_, k) => k !== i))}>
                ×
              </button>
            </span>
          ))}
          {items.length < max && (
            <button type="button" className="adm-btn adm-btn--small adm-btn--ghost" onClick={() => update([...items, emptyValue(element)])}>
              + Add
            </button>
          )}
        </div>
        {meta.help && <small>{meta.help}</small>}
      </div>
    );
  }

  return (
    <div className="adm-list">
      <div className="adm-list-head">
        <span className="adm-label">
          {label} <em>({items.length})</em>
        </span>
        {items.length < max && (
          <button
            type="button"
            className="adm-btn adm-btn--small"
            onClick={() => {
              update([...items, emptyValue(element)]);
              setOpen(items.length);
            }}
          >
            + Add
          </button>
        )}
      </div>
      {items.map((item, i) => (
        <div key={i} className={`adm-item${open === i ? " is-open" : ""}`}>
          <div className="adm-item-head">
            <button type="button" className="adm-item-toggle" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              <span className="adm-item-index">{i + 1}</span>
              {itemTitle(item, i)}
            </button>
            <span className="adm-item-actions">
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                ↓
              </button>
              <button
                type="button"
                aria-label="Remove"
                className="is-danger"
                onClick={() => {
                  if (confirm(`Remove “${itemTitle(item, i)}”?`)) {
                    update(items.filter((_, k) => k !== i));
                    setOpen(null);
                  }
                }}
              >
                ×
              </button>
            </span>
          </div>
          {open === i && (
            <div className="adm-item-body">
              <Field schema={element} value={item} path={[...path, i]} label="" onChange={onChange} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function SchemaForm({
  schema,
  value,
  onChange,
}: {
  schema: AnySchema;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  return <Field schema={schema} value={value} path={[]} label="" onChange={(path, v) => onChange(setIn(value, path, v))} />;
}

"use client";

import { useState, useTransition } from "react";

import { deleteEnquiryAction, updateEnquiryStatusAction } from "@/app/admin/actions";

export type EnquiryRow = {
  id: string;
  name: string;
  phone: string;
  category: string | null;
  requirement: string | null;
  pagePath: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
};

const STATUS_LABEL = { NEW: "New", CONTACTED: "Contacted", CLOSED: "Closed" } as const;

export function EnquiriesTable({ initial }: { initial: EnquiryRow[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<"ALL" | EnquiryRow["status"]>("ALL");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const setStatus = (row: EnquiryRow, status: EnquiryRow["status"]) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
    startTransition(async () => {
      const result = await updateEnquiryStatusAction(row.id, status);
      if (!result.ok) {
        setError(result.message);
        setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));
      }
    });
  };

  const remove = (row: EnquiryRow) => {
    if (!confirm(`Delete the enquiry from ${row.name}?`)) return;
    startTransition(async () => {
      const result = await deleteEnquiryAction(row.id);
      if (result.ok) setRows((prev) => prev.filter((r) => r.id !== row.id));
      else setError(result.message);
    });
  };

  const visible = filter === "ALL" ? rows : rows.filter((r) => r.status === filter);
  const whatsapp = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
  };

  return (
    <>
      {error && <p className="adm-alert adm-alert--error">{error}</p>}
      <div className="adm-tabs" role="tablist">
        {(["ALL", "NEW", "CONTACTED", "CLOSED"] as const).map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? "is-active" : ""} onClick={() => setFilter(f)}>
            {f === "ALL" ? "All" : STATUS_LABEL[f]} ({f === "ALL" ? rows.length : rows.filter((r) => r.status === f).length})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="adm-muted">No enquiries here yet. They appear when visitors submit the inquiry form on the website.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Customer</th>
                <th>Looking for</th>
                <th>Requirement</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className={r.status === "NEW" ? "is-new" : ""}>
                  <td>{new Date(r.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td>
                    <strong>{r.name}</strong>
                    <br />
                    <a href={whatsapp(r.phone)} target="_blank" rel="noreferrer">
                      {r.phone}
                    </a>
                  </td>
                  <td>{r.category ?? "—"}</td>
                  <td className="adm-wrap">{r.requirement || "—"}</td>
                  <td>
                    <select
                      aria-label={`Status of ${r.name}'s enquiry`}
                      value={r.status}
                      onChange={(e) => setStatus(r, e.target.value as EnquiryRow["status"])}
                    >
                      {Object.entries(STATUS_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button type="button" className="adm-btn adm-btn--small adm-btn--danger" onClick={() => remove(r)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

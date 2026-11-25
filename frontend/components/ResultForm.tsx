"use client";
import { useState } from "react";
import { PassportData } from "@/types/passport";

const FIELDS: { key: keyof PassportData; label: string; type?: string }[] = [
  { key: "surname", label: "Surname" },
  { key: "givenNames", label: "Given names" },
  { key: "passportNumber", label: "Passport number" },
  { key: "documentType", label: "Document type" },
  { key: "issuingCountry", label: "Issuing country" },
  { key: "nationality", label: "Nationality" },
  { key: "dateOfBirth", label: "Date of birth", type: "date" },
  { key: "sex", label: "Sex" },
  { key: "expirationDate", label: "Expiry date", type: "date" },
  { key: "personalNumber", label: "Personal number" },
];

export default function ResultForm({ initial, onReset }: { initial: PassportData; onReset: () => void }) {
  const [data, setData] = useState(initial); // editable local copy
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Extracted details</h2>
        {data.mrzValid ? (
          <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">Checksums valid</span>
        ) : (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">Needs review</span>
        )}
      </div>

      {!data.mrzValid && (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          A check digit failed, so some characters may be misread. Compare each field with the passport and correct it.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, type }) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium text-ink/70">{label}</span>
            <input
              type={type || "text"}
              value={(data[key] as string) ?? ""}
              onChange={(e) => setData({ ...data, [key]: e.target.value })}
              className="w-full rounded-lg border border-ink/20 px-3 py-2 focus:border-stamp focus:outline-none focus:ring-1 focus:ring-stamp"
            />
          </label>
        ))}
      </div>

      <div className="mt-5">
        <span className="mb-1 block text-sm font-medium text-ink/70">Raw MRZ</span>
        <pre className="overflow-x-auto rounded-lg bg-ink p-3 font-mono text-xs leading-5 text-white">{data.rawMrz.join("\n")}</pre>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={copy} className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90">
          {copied ? "Copied" : "Copy JSON"}
        </button>
        <button onClick={onReset} className="rounded-lg border border-ink/20 px-4 py-2 text-sm font-medium hover:bg-paper">
          Scan another
        </button>
        <button disabled title="Available in Phase 2" className="cursor-not-allowed rounded-lg bg-ink/10 px-4 py-2 text-sm font-medium text-ink/40">
          Save to database (coming soon)
        </button>
      </div>
    </section>
  );
}

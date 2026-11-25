"use client";
import { useRef, useState } from "react";

const OK = ["image/jpeg", "image/png", "image/webp"];

export default function UploadZone({ onFile }: { onFile: (f: File) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const pick = (f?: File) => f && OK.includes(f.type) && onFile(f);

  return (
    <div
      role="button" tabIndex={0} aria-label="Upload passport photo"
      onClick={() => input.current?.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]); }}
      className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-stamp
        ${over ? "border-stamp bg-teal-50" : "border-ink/30 bg-white hover:border-stamp"}`}
    >
      <p className="text-lg font-semibold">Drop a passport photo here</p>
      <p className="mt-1 text-sm text-ink/60">or click to browse. JPG, PNG or WEBP, up to 10 MB.</p>
      <p className="mt-4 max-w-xs text-xs text-ink/60">Include the whole data page, with the two lines of &lt; characters at the bottom.</p>
      <input ref={input} type="file" accept={OK.join(",")} hidden onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}

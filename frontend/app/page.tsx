"use client";
import { useEffect, useState } from "react";
import UploadZone from "@/components/UploadZone";
import ResultForm from "@/components/ResultForm";
import { scanPassport } from "@/lib/api";
import { PassportData } from "@/types/passport";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<PassportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Free the object URL when the preview changes or the page unmounts
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setResult(null); setError(null); setScanning(true);
    try { setResult(await scanPassport(file)); }
    catch (e) { setError(e instanceof Error ? e.message : "Scan failed."); }
    finally { setScanning(false); }
  };

  const reset = () => { setPreview(null); setResult(null); setError(null); };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Passport scanner</h1>
      <p className="mt-2 max-w-prose text-ink/70">
        Upload a photo of the passport data page. The two machine-readable lines at the bottom are read on the server and checked against their check digits.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          {!preview ? (
            <UploadZone onFile={handleFile} />
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Passport preview" className="max-h-96 w-full object-contain" />
              {scanning && (
                <>
                  <div className="absolute inset-0 bg-ink/20" />
                  <div className="animate-sweep absolute left-0 right-0 h-[3px] bg-stamp shadow-[0_0_14px_3px_rgba(15,118,110,.7)]" />
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-sm text-white">
                    Reading the MRZ. This can take 5–15 seconds.
                  </p>
                </>
              )}
            </div>
          )}
          {preview && !scanning && !result && (
            <button onClick={reset} className="mt-3 text-sm font-medium text-stamp underline">Choose a different photo</button>
          )}
          {error && <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        </div>

        <div>{result && <ResultForm key={result.rawMrz.join()} initial={result} onReset={reset} />}</div>
      </div>
    </main>
  );
}

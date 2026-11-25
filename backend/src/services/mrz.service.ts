import { parse } from "mrz";
import { PassportData } from "../types/passport";

/** Normalise one OCR line to MRZ characters only. */
const cleanLine = (raw: string) => raw.toUpperCase().replace(/[«‹]/g, "<").replace(/[^A-Z0-9<]/g, "");

/** Find the two TD3 (passport) lines in noisy OCR output. */
export function extractMrzLines(text: string): [string, string] | null {
  const lines = text.split(/\r?\n/).map(cleanLine).filter((l) => l.length >= 30);
  for (let i = 0; i < lines.length - 1; i++) {
    let l1 = lines[i];
    let l2 = lines[i + 1];
    // Line 1 starts with the document code "P" and holds many "<" fillers
    if (!/^P[A-Z<]/.test(l1) || (l1.match(/</g) || []).length < 5) continue;
    // Tesseract often reads trailing "<<<<" as "KKKK"/"CCCC" – repair that
    l1 = l1.replace(/[KCLES<]{3,}$/, (m) => "<".repeat(m.length));
    return [l1.padEnd(44, "<").slice(0, 44), l2.padEnd(44, "<").slice(0, 44)];
  }
  return null;
}

/** YYMMDD -> YYYY-MM-DD. Birth dates lie in the past, expiry dates are 20xx. */
function toIso(yymmdd: string | null | undefined, kind: "birth" | "expiry"): string | null {
  if (!yymmdd || !/^\d{6}$/.test(yymmdd)) return null;
  const yy = +yymmdd.slice(0, 2);
  const nowYY = new Date().getFullYear() % 100;
  const year = kind === "birth" ? (yy > nowYY ? 1900 + yy : 2000 + yy) : 2000 + yy;
  return `${year}-${yymmdd.slice(2, 4)}-${yymmdd.slice(4, 6)}`;
}

const strip = (s?: string | null) => (s ?? "").replace(/</g, " ").trim();

/** Parse with the `mrz` library; fall back to fixed-position slicing if it throws. */
export function parseMrz(lines: [string, string]): PassportData {
  try {
    const r = parse(lines, { autocorrect: true }); // fixes O/0, I/1 etc. in numeric fields
    const f = r.fields;
    const sex = String(f.sex ?? "");
    return {
      documentType: (f.documentCode ?? "P").replace(/</g, ""),
      issuingCountry: f.issuingState ?? "",
      surname: strip(f.lastName),
      givenNames: strip(f.firstName),
      passportNumber: (f.documentNumber ?? "").replace(/</g, ""),
      nationality: f.nationality ?? "",
      dateOfBirth: toIso(f.birthDate, "birth"),
      sex: sex === "male" ? "M" : sex === "female" ? "F" : "X",
      expirationDate: toIso(f.expirationDate, "expiry"),
      personalNumber: (f.personalNumber ?? "").replace(/</g, ""),
      mrzValid: r.valid,
      rawMrz: lines,
    };
  } catch {
    return regexFallback(lines);
  }
}

/** ICAO 9303 TD3 fixed positions – used only if `mrz` cannot parse. mrzValid is always false here. */
function regexFallback([l1, l2]: [string, string]): PassportData {
  const [surname, given = ""] = l1.slice(5).split("<<");
  return {
    documentType: l1[0],
    issuingCountry: l1.slice(2, 5).replace(/</g, ""),
    surname: strip(surname),
    givenNames: strip(given),
    passportNumber: l2.slice(0, 9).replace(/</g, ""),
    nationality: l2.slice(10, 13).replace(/</g, ""),
    dateOfBirth: toIso(l2.slice(13, 19), "birth"),
    sex: "MF".includes(l2[20]) ? l2[20] : "X",
    expirationDate: toIso(l2.slice(21, 27), "expiry"),
    personalNumber: l2.slice(28, 42).replace(/</g, ""),
    mrzValid: false,
    rawMrz: [l1, l2],
  };
}

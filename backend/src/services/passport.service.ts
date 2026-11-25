import { preprocess } from "./imagePreprocess.service";
import { recognize } from "./ocr.service";
import { extractMrzLines, parseMrz } from "./mrz.service";
import { PassportData } from "../types/passport";
import { AppError } from "../utils/AppError";

/** Core use-case: image buffer -> structured passport data. No HTTP or DB knowledge here. */
export async function scanPassport(buffer: Buffer): Promise<PassportData> {
  const { mrzStrip, full } = await preprocess(buffer);

  let best: PassportData | null = null;
  // Pass 1: cropped MRZ strip (fast, accurate). Pass 2: whole page.
  for (const img of [mrzStrip, full]) {
    const lines = extractMrzLines(await recognize(img));
    if (!lines) continue;
    const parsed = parseMrz(lines);
    if (parsed.mrzValid) return parsed; // checksums pass – stop early
    best ??= parsed;                    // otherwise keep it for manual review
  }
  if (best) return best;
  throw new AppError(
    422, "MRZ_NOT_FOUND",
    "Could not detect the MRZ (the two lines of < characters at the bottom). Use a sharp, well-lit, flat photo of the data page."
  );
}

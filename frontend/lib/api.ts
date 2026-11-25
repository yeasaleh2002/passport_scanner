import { PassportData } from "@/types/passport";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** Uploads the image and returns parsed passport data, or throws an Error with a readable message. */
export async function scanPassport(file: File): Promise<PassportData> {
  const body = new FormData();
  body.append("image", file);
  let res: Response;
  try {
    res = await fetch(`${API}/api/passport/scan`, { method: "POST", body });
  } catch {
    throw new Error(`Cannot reach the server. Is the backend running on ${API}?`);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) throw new Error(json?.error?.message || "Scan failed.");
  return json.data;
}

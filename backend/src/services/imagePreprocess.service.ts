import sharp from "sharp";
import { AppError } from "../utils/AppError";

/**
 * Produces two grayscale, contrast-boosted, sharpened PNG buffers:
 *  - mrzStrip: bottom 35% of the page (where the MRZ lives), upscaled
 *  - full:     the whole page (fallback if the photo is framed oddly)
 */
export async function preprocess(input: Buffer): Promise<{ mrzStrip: Buffer; full: Buffer }> {
  try {
    const oriented = await sharp(input).rotate().toBuffer(); // honour EXIF orientation
    const { width = 0, height = 0 } = await sharp(oriented).metadata();
    if (width < 400 || height < 300)
      throw new AppError(422, "IMAGE_TOO_SMALL", "Image resolution is too low. Use a sharper, larger photo.");

    const enhance = (s: sharp.Sharp) =>
      s.grayscale().normalise().median(1).sharpen({ sigma: 1.2 }).linear(1.2, -15).png();

    const top = Math.floor(height * 0.65);
    const mrzStrip = await enhance(
      sharp(oriented).extract({ left: 0, top, width, height: height - top }).resize({ width: 2400 })
    ).toBuffer();
    const full = await enhance(sharp(oriented).resize({ width: 2400 })).toBuffer();
    return { mrzStrip, full };
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(422, "UNREADABLE_IMAGE", "The image could not be read. Try another file.");
  }
}

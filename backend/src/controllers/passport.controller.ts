import { RequestHandler } from "express";
import { scanPassport } from "../services/passport.service";
import { AppError } from "../utils/AppError";

export const scan: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError(400, "NO_FILE", 'Attach an image in the "image" form field.');
    const data = await scanPassport(req.file.buffer);
    // Phase 2: expose a separate "save" endpoint that calls passportRepository.save()
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

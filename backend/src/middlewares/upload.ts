import multer from "multer";
import { AppError } from "../utils/AppError";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

/** Keeps the upload in RAM (req.file.buffer) – nothing is written to disk. */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }, // 10 MB
  fileFilter: (_req, file, cb) =>
    ALLOWED.includes(file.mimetype)
      ? cb(null, true)
      : cb(new AppError(415, "INVALID_FILE_TYPE", "Only JPG, PNG or WEBP images are allowed.")),
}).single("image"); // form-data field name: "image"

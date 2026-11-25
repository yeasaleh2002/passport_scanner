import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { AppError } from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError)
    return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message } });
  if (err instanceof MulterError)
    return res.status(400).json({
      success: false,
      error: { code: err.code, message: err.code === "LIMIT_FILE_SIZE" ? "Image is larger than 10 MB." : err.message },
    });
  console.error(err);
  res.status(500).json({ success: false, error: { code: "INTERNAL", message: "Something went wrong on the server." } });
};

import express from "express";
import cors from "cors";
import passportRoutes from "./routes/passport.routes";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/passport", passportRoutes);
app.use(errorHandler); // must be last

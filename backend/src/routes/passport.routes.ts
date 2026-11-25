import { Router } from "express";
import { upload } from "../middlewares/upload";
import { scan } from "../controllers/passport.controller";

const router = Router();
router.post("/scan", upload, scan);
export default router;

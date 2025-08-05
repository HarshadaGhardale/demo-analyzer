import express from "express";
import multer from "multer";
import { analyzeResume } from "../controller/resumeController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze-resume", upload.single("resume"), analyzeResume);

export default router;
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeResume } from "../controller/resumeController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/analyze-resume", upload.single("resume"), analyzeResume);

// Separate download route
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../downloads", req.params.filename);
  res.download(filePath, req.params.filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).send("File not found");
    }
  });
});

export default router;
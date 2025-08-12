import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Load env first
console.log("Groq key from env:", process.env.GROQ_API_KEY);

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import resumeRoutes from "./routes/resumeRoutes.js";
import contactRoutes from "./routes/contactRouter.js"; 
import userRoutes from "./routes/userRoutes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Ensure folders exist
const uploadsDir = path.resolve(__dirname, "uploads");
const downloadsDir = path.resolve(__dirname, "downloads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

// Routes
app.use("/", resumeRoutes);
app.use("/api/contact", contactRoutes); 
app.use("/api/user",userRoutes);

// Serve downloads statically
app.use("/download", express.static(downloadsDir));

app.get("/", (req, res) => {
  res.send("Resume Analyzer Backend Running!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
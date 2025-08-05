import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { Document, Packer, Paragraph, TextRun } from "docx";

// ====== Path setup for ES modules ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Load environment variables ======
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("Groq key from env:", process.env.GROQ_API_KEY);

// ====== Express app setup ======
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ====== Ensure uploads & downloads folder exist ======
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("downloads")) fs.mkdirSync("downloads");

// ====== Multer setup (for file uploads) ======
const upload = multer({ dest: "uploads/" });

// ====== Groq client ======
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ====== Helper to convert markdown to docx ======
function convertMarkdownToDocx(text) {
  const lines = text.split("\n");
  const children = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Bold headings (**Heading**)
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed.replace(/\*\*/g, ""), bold: true, size: 28 })],
          spacing: { after: 200 },
        })
      );
    }
    // Bullet points (* or +)
    else if (trimmed.startsWith("* ") || trimmed.startsWith("+ ")) {
      children.push(
        new Paragraph({
          text: trimmed.replace(/^[*+]\s*/, ""),
          bullet: { level: 0 },
        })
      );
    }
    // Normal text
    else if (trimmed) {
      children.push(new Paragraph(trimmed));
    } else {
      children.push(new Paragraph(""));
    }
  });

  return children;
}

// ====== Route to analyze resume ======
app.post("/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // ====== Get suggestions from Groq LLM ======
    const suggestionsResponse = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are a resume analyzer. Provide suggestions to improve resumes and create an improved version of it. Return response in two parts: **Suggestions:** and **Improved Version:**",
        },
        {
          role: "user",
          content: `Analyze this resume:\n${resumeText}`,
        },
      ],
    });

    const resultText =
      suggestionsResponse.choices[0]?.message?.content || "No response from AI.";

    // Separate suggestions and improved version
    const [suggestions, improvedVersion] = resultText.split("**Improved Version:**");

    // ====== Create Word document of improved version ======
    const improvedText = improvedVersion?.trim() || "No improved version.";
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: "Improved Resume", heading: "Heading1" }),
            ...convertMarkdownToDocx(improvedText),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // generate unique filename
    const fileName = `improved_resume_${Date.now()}.docx`;
    const outputPath = path.join(__dirname, "downloads", fileName);
    fs.writeFileSync(outputPath, buffer);

    res.json({
      suggestions: suggestions?.trim() || "No suggestions available.",
      downloadLink: `/downloads/${fileName}`,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Error analyzing resume." });
  }
});

// ====== Serve Word files from downloads folder ======
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

// ====== Start server ======
app.listen(port, () => console.log(`Server running on port ${port}`));
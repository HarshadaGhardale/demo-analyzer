import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { Document, Packer, Paragraph } from "docx";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";
import { convertMarkdownToDocx } from "../utils/docGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeResume = async (req, res) => {
  try {
    // Initialize Groq client inside function
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is missing in .env" });
    }
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // ===== Call Groq API =====
    const suggestionsResponse = await client.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are a resume analyzer. Provide suggestions to improve resumes and create an improved version of it. Return response in two parts: **Suggestions:** and **Improved Version:**",
        },
        { role: "user", content: `Analyze this resume:\n${resumeText}` },
      ],
    });

    const resultText =
      suggestionsResponse.choices[0]?.message?.content || "No response from AI.";
    const [suggestions, improvedVersion] = resultText.split("**Improved Version:**");

    // ===== Generate Word document =====
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Improved Resume", heading: "Heading1" }),
            ...convertMarkdownToDocx(improvedVersion?.trim() || "No improved version."),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // ===== Ensure downloads directory =====
    const downloadsPath = path.resolve(__dirname, "../downloads");
    if (!fs.existsSync(downloadsPath)) fs.mkdirSync(downloadsPath);

    // ===== Save file =====
    const fileName = `improved_resume_${Date.now()}.docx`;
    const outputPath = path.join(downloadsPath, fileName);
    fs.writeFileSync(outputPath, buffer);

    // ===== Send JSON (Frontend will download using /download/:filename) =====
    res.json({
      suggestions: suggestions?.trim() || "No suggestions available.",
      fileName: fileName
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Error analyzing resume." });
  }
};
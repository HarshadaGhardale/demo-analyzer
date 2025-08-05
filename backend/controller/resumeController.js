import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { Document, Packer, Paragraph } from "docx";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";
import { convertMarkdownToDocx } from "../utils/docGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

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

    // Generate Word document
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
    const fileName = `improved_resume_${Date.now()}.docx`;
    const outputPath = path.join(__dirname, "../downloads", fileName);
    fs.writeFileSync(outputPath, buffer);

    res.json({
      suggestions: suggestions?.trim() || "No suggestions available.",
      downloadLink: `/download/${fileName}`,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Error analyzing resume." });
  }
};
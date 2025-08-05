import { Paragraph, TextRun } from "docx";

export const convertMarkdownToDocx = (text) => {
  const lines = text.split("\n");
  const children = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed.replace(/\*\*/g, ""), bold: true, size: 28 })],
          spacing: { after: 200 },
        })
      );
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("+ ")) {
      children.push(
        new Paragraph({
          text: trimmed.replace(/^[*+]\s*/, ""),
          bullet: { level: 0 },
        })
      );
    } else if (trimmed) {
      children.push(new Paragraph(trimmed));
    } else {
      children.push(new Paragraph(""));
    }
  });

  return children;
};
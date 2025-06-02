import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function Home() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");

  // Your existing function to call the API should be here
  async function handleRewrite() {
    if (!input || !tone) return;
    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, tone }),
    });
    const data = await res.json();
    setOutput(data.output || "No response from AI.");
  }

  function generatePDF() {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.text("AI Text Rewriter Output", pageWidth / 2, 40, { align: "center" });

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Tone: ${tone}`, 40, 60);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 75);

    // Main Text
    doc.setFontSize(12);
    doc.setTextColor(0);
    const textLines = doc.splitTextToSize(output, pageWidth - 80);
    doc.text(textLines, 40, 110);

    // Save PDF
    doc.save("rewritten-output.pdf");
  }

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>AI Text Rewriter</h1>

      <textarea
        rows={5}
        style={{ width: "100%", padding: 10 }}
        placeholder="Enter text to rewrite"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ marginTop: 10 }}>
        <option>Professional</option>
        <option>Casual</option>
        <option>Humorous</option>
      </select>

      <br />
      <button onClick={handleRewrite} style={{ marginTop: 10 }}>
        Rewrite
      </button>

      {output && (
        <>
          <h2>Rewritten Output</h2>
          <div
            style={{
              whiteSpace: "pre-wrap",
              border: "1px solid #ccc",
              padding: 10,
              minHeight: 100,
              marginBottom: 10,
              backgroundColor: "#f9f9f9",
            }}
          >
            {output}
          </div>
          <button onClick={generatePDF}>Download PDF</button>
        </>
      )}
    </main>
  );
}


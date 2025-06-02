import { useState } from "react";
import { downloadPDF } from "../utils/pdfGenerator";

export default function Home() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRewrite() {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, tone }),
      });

      const data = await res.json();

      if (res.ok) {
        setOutput(data.output);
      } else {
        setOutput("Error: " + (data.error || "Unknown error"));
      }
    } catch {
      setOutput("Network error");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">AI Text Rewriter</h1>

      <textarea
        rows={6}
        className="w-full max-w-2xl p-3 border rounded mb-4"
        placeholder="Paste your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="Professional">Professional</option>
        <option value="Casual">Casual</option>
        <option value="SEO-Friendly">SEO-Friendly</option>
      </select>

      <button
        onClick={handleRewrite}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Rewriting..." : "Rewrite"}
      </button>

      {output && (
        <section className="mt-6 w-full max-w-2xl bg-white p-4 border rounded shadow">
          <h2 className="font-bold mb-2">Rewritten Output</h2>
          <p className="whitespace-pre-wrap">{output}</p>
          <button
            onClick={() => downloadPDF(output)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download as PDF
          </button>
        </section>
      )}
    </main>
  );
}

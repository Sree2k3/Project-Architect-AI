"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/plan?idea=${input}`);
      const data = await response.json();
      setResult(data.roadmap);
    } catch (error) {
      setResult("Error connecting to the AI Brain. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
        <span className="text-xl font-bold text-blue-600">Project-Architect AI</span>
      </nav>

      <main className="flex flex-1 flex-col gap-8 p-8 md:flex-row">
        {/* Input Section */}
        <section className="flex flex-1 flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Project Generator</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-lg border p-4 text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your ML idea..."
          />
          <button
            onClick={generatePlan}
            disabled={loading}
            className="rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "AI is thinking..." : "Generate Roadmap"}
          </button>
        </section>

        {/* Output Section */}
        <section className="flex-[1.5] flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Architect Roadmap</h2>
          <div className="flex-1 overflow-auto rounded-lg border bg-zinc-50 p-4">
            <pre className="whitespace-pre-wrap text-sm text-zinc-700">
              {result || "Your roadmap will appear here..."}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
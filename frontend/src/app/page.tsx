"use client";

import { useState } from 'react';
import RoadmapDisplay from '../components/RoadmapDisplay';

export default function Home() {
  const [idea, setIdea] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!idea) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/plan?idea=${encodeURIComponent(idea)}`);
      const data = await response.json();
      setRoadmap(data.roadmap);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 'flex-col-reverse' flips the order: Bottom element in code appears on Top
    <main className="flex flex-col-reverse p-8 max-w-4xl mx-auto min-h-screen">

      {/* 1. INPUT SECTION (Appears at the Bottom) */}
      <div className="flex gap-4 mt-8 sticky bottom-8 bg-black p-4 border-t border-gray-800">
        <input
          type="text"
          className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded text-white"
          placeholder="Enter your project idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <button
          onClick={generatePlan}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-bold"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Generate"}
        </button>
      </div>

      {/* 2. RESULT SECTION (Appears at the Top) */}
      <div className="flex-1 overflow-y-auto mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">AI Project Architect</h1>
        {roadmap ? (
          <RoadmapDisplay roadmapText={roadmap} />
        ) : (
          <p className="text-gray-500 text-center mt-20">
            Your roadmap will appear here once generated.
          </p>
        )}
      </div>

    </main>
  );
}
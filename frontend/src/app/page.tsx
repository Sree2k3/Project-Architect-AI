"use client";

import { useState, useEffect } from 'react'; // Added useEffect
import RoadmapDisplay from '../components/RoadmapDisplay';
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. LOAD saved roadmap on startup
  useEffect(() => {
    const savedRoadmap = localStorage.getItem("architect_last_plan");
    const savedIdea = localStorage.getItem("architect_last_idea");
    if (savedRoadmap) setRoadmap(savedRoadmap);
    if (savedIdea) setIdea(savedIdea);
  }, []);

  // 2. SAVE roadmap whenever it changes
  useEffect(() => {
    if (roadmap) {
      localStorage.setItem("architect_last_plan", roadmap);
      localStorage.setItem("architect_last_idea", idea);
    }
  }, [roadmap, idea]);

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

  // 3. NEW FEATURE: Reset Function
  const startNewProject = () => {
    if (confirm("Clear current architecture and start fresh?")) {
      setRoadmap("");
      setIdea("");
      localStorage.removeItem("architect_last_plan");
      localStorage.removeItem("architect_last_idea");
    }
  };

  return (
    <main className="flex flex-col-reverse min-h-screen p-8 max-w-5xl mx-auto">

      {/* 1. INPUT AREA */}
      <div className="sticky bottom-8 z-50 mt-10">
        <div className="flex gap-4 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 p-2"
            placeholder="Architect a new vision..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          {/* RESET BUTTON (Only shows if roadmap exists) */}
          {roadmap && (
            <button
              onClick={startNewProject}
              className="text-gray-400 hover:text-red-400 px-2 transition-colors"
              title="Reset Project"
            >
              ✕
            </button>
          )}

          <button
            onClick={generatePlan}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
            disabled={loading}
          >
            {loading ? "Designing..." : "Architect"}
          </button>
        </div>
      </div>

      {/* 2. RESULTS AREA */}
      <div className="flex-1 flex flex-col justify-end pb-20">
        <AnimatePresence mode="wait">
          {roadmap ? (
            <RoadmapDisplay key="results" roadmapText={roadmap} />
          ) : (
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-40">
              <h1 className="text-7xl font-extrabold text-white mb-6 tracking-tighter">
                AI Project <span className="text-blue-500">Architect</span>
              </h1>
              <p className="text-gray-400 text-xl">Your vision is now persistent. Refresh and see.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
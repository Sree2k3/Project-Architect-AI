"use client";

import { useState, useEffect } from 'react';
import RoadmapDisplay from '../components/RoadmapDisplay';
import Sidebar from '../components/Sidebar'; // We will create this component next
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // State for the sidebar list

  // 1. LOAD: Load history and the last active project on startup
  useEffect(() => {
    const savedHistory = localStorage.getItem("architect_history");
    const lastRoadmap = localStorage.getItem("architect_last_roadmap");
    const lastIdea = localStorage.getItem("architect_last_idea");

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (lastRoadmap) setRoadmap(lastRoadmap);
    if (lastIdea) setIdea(lastIdea);
  }, []);

  // 2. SAVE: Persist the active project so it survives refresh
  useEffect(() => {
    if (roadmap) {
      localStorage.setItem("architect_last_roadmap", roadmap);
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

      // ADD TO HISTORY: Create a new history entry
      const newEntry = { idea, roadmap: data.roadmap, timestamp: Date.now() };
      const updatedHistory = [newEntry, ...history.filter(item => item.idea !== idea)];

      setHistory(updatedHistory);
      localStorage.setItem("architect_history", JSON.stringify(updatedHistory));

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoadmap("");
    setIdea("");
    localStorage.removeItem("architect_last_roadmap");
    localStorage.removeItem("architect_last_idea");
  };

  const selectFromHistory = (item) => {
    setIdea(item.idea);
    setRoadmap(item.roadmap);
  };

  const deleteHistoryItem = (timestamp) => {
    const updated = history.filter(item => item.timestamp !== timestamp);
    setHistory(updated);
    localStorage.setItem("architect_history", JSON.stringify(updated));
  };

  return (
    // Add this inside your Home component return:
    <div className="flex h-screen w-full overflow-hidden bg-[#030712]">
      <Sidebar
        history={history}
        onSelect={selectFromHistory}
        onNew={handleReset}
        onDelete={deleteHistoryItem}
        activeIdea={idea}
      />

      <main className="flex-1 relative flex flex-col-reverse overflow-y-auto overflow-x-hidden">
        {/* 1. INPUT AREA */}
        <div className="sticky bottom-0 z-50 pb-8 pt-4 bg-transparent">
          <div className="max-w-4xl mx-auto flex gap-4 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 p-2"
              placeholder="Start a new architecture..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generatePlan()}
            />

            {roadmap && (
              <button onClick={handleReset} className="text-gray-500 hover:text-red-400 px-2 transition-colors">
                ✕
              </button>
            )}

            <button
              onClick={generatePlan}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Architecting..." : "Architect"}
            </button>
          </div>
        </div>

        {/* 2. RESULTS AREA */}
        <div className="flex-1 flex flex-col justify-end max-w-5xl mx-auto w-full pb-20">
          <AnimatePresence mode="wait">
            {roadmap ? (
              <RoadmapDisplay key={idea} roadmapText={roadmap} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-40"
              >
                <h1 className="text-7xl font-extrabold text-white mb-4 tracking-tighter">
                  AI Project <span className="text-blue-500">Architect</span>
                </h1>
                <p className="text-gray-400 text-xl font-light italic">Select a project or start a new vision.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
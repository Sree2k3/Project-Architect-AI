"use client";

import { useState, useEffect } from 'react';
import RoadmapDisplay from '../components/RoadmapDisplay';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("architect_history");
    const lastRoadmap = localStorage.getItem("architect_last_roadmap");
    const lastIdea = localStorage.getItem("architect_last_idea");

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (lastRoadmap) setRoadmap(lastRoadmap);
    if (lastIdea) setIdea(lastIdea);
  }, []);

  useEffect(() => {
    if (roadmap) {
      localStorage.setItem("architect_last_roadmap", roadmap);
      localStorage.setItem("architect_last_idea", idea);
    }
  }, [roadmap, idea]);

  const generatePlan = async () => {
    if (!idea || loading) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/plan?idea=${encodeURIComponent(idea)}`);
      const data = await response.json();

      setRoadmap(data.roadmap);

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
    localStorage.setItem("architect_last_roadmap", item.roadmap);
    localStorage.setItem("architect_last_idea", item.idea);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHistoryItem = (timestamp) => {
    const updated = history.filter(item => item.timestamp !== timestamp);
    setHistory(updated);
    localStorage.setItem("architect_history", JSON.stringify(updated));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#030712] selection:bg-blue-500/30">
      <Sidebar
        history={history}
        onSelect={selectFromHistory}
        onNew={handleReset}
        onDelete={deleteHistoryItem}
        activeIdea={idea}
      />

      <main className="flex-1 relative flex flex-col-reverse overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* 1. INPUT AREA */}
        <div className="sticky bottom-0 z-50 pb-10 pt-6 px-4 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-transparent">
          <div className="max-w-4xl mx-auto flex gap-4 p-2 pl-6 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all focus-within:border-blue-500/50 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-3 text-lg"
              placeholder="Deploy a new vision..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generatePlan()}
              disabled={loading}
            />

            {roadmap && !loading && (
              <button onClick={handleReset} className="text-gray-500 hover:text-red-400 px-2 transition-colors">
                ✕
              </button>
            )}

            <button
              onClick={generatePlan}
              className={`min-w-[140px] flex items-center justify-center rounded-2xl font-bold transition-all ${loading
                  ? "bg-transparent cursor-default"
                  : "bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] text-white px-8 py-3"
                }`}
              disabled={idea === "" || loading}
            >
              {loading ? (
                <div className="flex items-center gap-4 px-4 text-left">
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-black animate-pulse">
                      Analyzing
                    </span>
                    <span className="text-[8px] text-gray-500 font-mono">Neural Engine Active</span>
                  </div>
                </div>
              ) : (
                "Architect"
              )}
            </button>
          </div>
        </div>

        {/* 2. RESULTS AREA */}
        <div className="flex-1 flex flex-col justify-end max-w-5xl mx-auto w-full pb-24 px-6">
          <AnimatePresence mode="wait">
            {roadmap ? (
              <RoadmapDisplay key={idea} roadmapText={roadmap} />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-center mb-60"
              >
                <div className="inline-block px-3 py-1 mb-6 rounded-full border border-blue-500/20 bg-blue-500/5 text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold">
                  System v2.6.0 Stable
                </div>
                <h1 className="text-8xl font-extrabold text-white mb-6 tracking-tighter leading-none">
                  AI Project <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-700">Architect</span>
                </h1>
                <p className="text-gray-500 text-xl font-light max-w-lg mx-auto leading-relaxed">
                  Design engineering roadmaps with <span className="text-gray-300">Neural Precision.</span> Select a project to begin.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
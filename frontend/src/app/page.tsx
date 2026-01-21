"use client";

import { useState } from 'react';
import RoadmapDisplay from '../components/RoadmapDisplay';
import { motion, AnimatePresence } from "framer-motion";

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
    <main className="flex flex-col-reverse min-h-screen p-8 max-w-5xl mx-auto font-sans">

      {/* 1. INPUT AREA (Fixed at bottom) */}
      <div className="sticky bottom-8 z-50 mt-10">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="flex gap-4 p-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 p-2 text-lg"
            placeholder="What project are we architecting today?"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generatePlan()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePlan}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Architecting...
              </span>
            ) : "Architect"}
          </motion.button>
        </motion.div>
      </div>

      {/* 2. RESULTS AREA (Scrollable at top) */}
      <div className="flex-1 flex flex-col justify-end pb-20">
        <AnimatePresence mode="wait">
          {roadmap ? (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RoadmapDisplay roadmapText={roadmap} />
            </motion.div>
          ) : (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-40"
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl font-extrabold text-white mb-6 tracking-tighter"
              >
                AI Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-sm">Architect</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-xl font-light"
              >
                Turn your vision into a production-ready engineering roadmap.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
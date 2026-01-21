"use client";
import { motion } from "framer-motion";

export default function GlassCard({ children, className }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`
        relative overflow-hidden
        backdrop-blur-xl bg-white/5 
        border border-white/10 
        rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]
        hover:border-blue-500/30 transition-all duration-500
        ${className}
      `}
        >
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10 p-6">
                {children}
            </div>
        </motion.div>
    );
}
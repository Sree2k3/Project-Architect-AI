"use client";
import { Plus, MessageSquare, Trash2, Settings, Menu, SquarePen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ history, onSelect, onNew, onDelete, activeIdea }) {
    return (
        <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="w-16 hover:w-64 group h-full backdrop-blur-3xl bg-black/60 border-r border-white/5 flex flex-col items-center py-6 transition-all duration-300 ease-in-out z-[100] overflow-hidden"
        >
            {/* 1. TOP SECTION: Menu & New Chat */}
            <div className="flex flex-col items-center w-full px-3 gap-6">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Menu size={24} />
                </button>

                <button
                    onClick={onNew}
                    className="flex items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all w-full group-hover:justify-start group-hover:gap-3"
                >
                    <SquarePen size={20} className="shrink-0" />
                    <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap overflow-hidden">
                        New Project
                    </span>
                </button>
            </div>

            {/* 2. MIDDLE SECTION: History List */}
            <div className="flex-1 w-full mt-10 overflow-y-auto px-3 space-y-2 no-scrollbar">
                <div className="hidden group-hover:block mb-4 px-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">History</span>
                </div>

                {history.map((item) => (
                    <div key={item.timestamp} className="relative group/item">
                        <button
                            onClick={() => onSelect(item)}
                            className={`flex items-center w-full p-3 rounded-lg transition-all text-sm text-left truncate group-hover:justify-start ${activeIdea === item.idea
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <MessageSquare size={18} className="shrink-0" />
                            <span className="hidden group-hover:block ml-3 truncate pr-4">
                                {item.idea}
                            </span>
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item.timestamp); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-400 transition-all hidden group-hover:block"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* 3. BOTTOM SECTION: Settings */}
            <div className="w-full px-3 pt-6 border-t border-white/5">
                <button className="flex items-center justify-center w-full p-3 text-gray-400 hover:text-white transition-all group-hover:justify-start group-hover:gap-3">
                    <Settings size={20} className="shrink-0" />
                    <span className="hidden group-hover:block text-sm font-medium">Settings</span>
                </button>
            </div>
        </motion.div>
    );
}
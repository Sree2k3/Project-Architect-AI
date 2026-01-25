"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check, Terminal, Cpu, Layout, Workflow, Box, Layers } from 'lucide-react'; // Added Layers
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const sectionIcons = [<Cpu size={28} />, <Workflow size={28} />, <Box size={28} />, <Terminal size={28} />];

const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white flex items-center gap-2 text-xs font-mono uppercase">
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
        </button>
    );
};

export default function RoadmapDisplay({ roadmapText }) {
    if (!roadmapText) return null;

    const rawSections = roadmapText
        .split(/(?=### Step|Step \d:)/g)
        .map(s => s.trim())
        .filter(s => s.length > 20);

    return (
        <div className="flex flex-col gap-24 pb-40 max-w-5xl mx-auto w-full">

            {/* HYPERREALISTIC TECH STACK SUMMARY (Bento Grid) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            >
                {[
                    { label: "Architecture", value: "Microservices", icon: <Layers size={16} /> },
                    { label: "Intelligence", value: "Generative AI", icon: <Cpu size={16} /> },
                    { label: "Deployment", value: "Edge Optimized", icon: <Terminal size={16} /> }
                ].map((stat, i) => (
                    <GlassCard key={i} className="!p-4 border-white/5 bg-white/[0.02] flex items-center gap-4 hover:bg-white/[0.05] transition-colors">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</p>
                            <p className="text-sm text-white font-medium">{stat.value}</p>
                        </div>
                    </GlassCard>
                ))}
            </motion.div>

            {/* ROADMAP PHASES */}
            {rawSections.map((section, index) => {
                const titleLine = section.split('\n')[0];
                const sectionTitle = titleLine.replace(/### Step \d+:?|Step \d+:?/i, "").trim() || `Phase 0${index + 1}`;

                const cleanBody = section
                    .replace(titleLine, "")
                    .replace(/Technical Explanation:?\n?/i, "")
                    .replace(/Title:.*\n?/i, "")
                    .trim();

                return (
                    <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="flex items-end gap-6 mb-8 px-2">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                                {sectionIcons[index % sectionIcons.length]}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] uppercase tracking-[0.4em] text-blue-500 font-black mb-1">
                                    Technical Phase 0{index + 1}
                                </span>
                                <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
                                    {sectionTitle}
                                </h2>
                            </div>
                        </div>

                        <GlassCard className="!p-0 border-white/5 shadow-2xl overflow-hidden">
                            <div className="p-10 prose prose-invert max-w-none prose-p:text-gray-300 prose-p:text-lg">
                                <ReactMarkdown
                                    children={cleanBody}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const codeString = String(children).replace(/\n$/, '');

                                            if (inline) return <code className="bg-white/10 px-2 py-1 rounded text-blue-300 font-mono text-sm">{children}</code>;

                                            return (
                                                <div className="my-10 rounded-2xl border border-white/10 bg-black/60 overflow-hidden shadow-2xl backdrop-blur-md relative">
                                                    <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex gap-1.5">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                                                            </div>
                                                            <span className="ml-4 text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                                                                {match ? match[1] : 'terminal'}
                                                            </span>
                                                        </div>
                                                        <CopyButton code={codeString} />
                                                    </div>
                                                    <SyntaxHighlighter
                                                        children={codeString}
                                                        style={vscDarkPlus}
                                                        language={match ? match[1] : 'text'}
                                                        PreTag="div"
                                                        customStyle={{ margin: 0, padding: '2rem', background: 'transparent', fontSize: '14px', lineHeight: '1.8' }}
                                                        {...props}
                                                    />
                                                </div>
                                            );
                                        },
                                    }}
                                />
                            </div>
                        </GlassCard>
                    </motion.div>
                );
            })}
        </div>
    );
}
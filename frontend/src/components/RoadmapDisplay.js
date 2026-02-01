"use client";
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Download, Copy, Check, Terminal, Cpu, Box, Layers, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GlassCard from './GlassCard';

const sectionIcons = [<Cpu size={28} />, <Workflow size={28} />, <Box size={28} />, <Terminal size={28} />];

const scanTechStack = (text) => {
    const techMap = {
        architecture: ["Microservices", "Monolith", "Serverless", "Event-Driven", "REST API", "Full-Stack"],
        intelligence: ["TensorFlow", "PyTorch", "OpenCV", "Mediapipe", "LLM", "CNN", "Generative AI"],
        deployment: ["Docker", "Kubernetes", "AWS", "Vercel", "Flask", "FastAPI", "Netlify"]
    };
    const findMatch = (category) =>
        techMap[category].find(tech => text.toLowerCase().includes(tech.toLowerCase())) || techMap[category][0];
    return { arch: findMatch("architecture"), intel: findMatch("intelligence"), deploy: findMatch("deployment") };
};

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
    const roadmapRef = useRef(null);
    const [exporting, setExporting] = useState(false);

    if (!roadmapText) return null;

    const techStack = scanTechStack(roadmapText);

    const sections = roadmapText
        .split(/(?=### Step|Step \d+:?|### \d+\.)/g)
        .map(s => s.trim())
        .filter(s => s.length > 50 && !s.toLowerCase().includes("engineering roadmap"));

    const exportToPDF = async () => {
        setExporting(true);
        const element = roadmapRef.current;
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#030712",
                logging: false,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Architect_Blueprint_${Date.now()}.pdf`);
        } catch (error) {
            console.error("PDF Export failed:", error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="relative">
            {/* 1. EXPORT ACTION BAR */}
            <div className="flex justify-end mb-8 sticky top-0 z-40 py-4">
                <button
                    onClick={exportToPDF}
                    disabled={exporting}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 rounded-xl text-sm font-bold text-gray-300 hover:text-blue-400 transition-all shadow-xl backdrop-blur-md group"
                >
                    {exporting ? (
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                    )}
                    {exporting ? "Generating..." : "Export Blueprint"}
                </button>
            </div>

            {/* 2. WRAPPER FOR CAPTURE (roadmapRef) */}
            <div ref={roadmapRef} className="flex flex-col gap-20 max-w-5xl mx-auto w-full p-4 md:p-10 rounded-3xl">

                {/* DYNAMIC BENTO SUMMARY */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {[
                        { label: "Architecture", value: techStack.arch, icon: <Layers size={16} /> },
                        { label: "Intelligence", value: techStack.intel, icon: <Cpu size={16} /> },
                        { label: "Deployment", value: techStack.deploy, icon: <Terminal size={16} /> }
                    ].map((stat, i) => (
                        <GlassCard key={i} className="!p-4 border-white/5 bg-white/[0.02] flex items-center gap-4 group transition-all">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black">{stat.label}</p>
                                <p className="text-sm text-white font-bold">{stat.value}</p>
                            </div>
                        </GlassCard>
                    ))}
                </motion.div>

                {/* ROADMAP PHASES */}
                {sections.map((section, index) => {
                    const lines = section.split('\n');
                    const firstLine = lines[0];
                    const sectionTitle = firstLine.replace(/[#*]/g, "").replace(/(Step \d+:?|\d+\.)/i, "").trim() || `Phase 0${index + 1}`;
                    const cleanBody = section
                        .replace(firstLine, "")
                        .replace(/Technical Explanation:?\n?/i, "")
                        .replace(/Title:.*\n?/i, "")
                        .replace(/[*]{2,}/g, "")
                        .replace(/[=]{3,}/g, "")
                        .replace(/[-]{3,}/g, "")
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
                                                                <span className="ml-4 text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">{match ? match[1] : 'terminal'}</span>
                                                            </div>
                                                            <CopyButton code={codeString} />
                                                        </div>
                                                        <SyntaxHighlighter children={codeString} style={vscDarkPlus} language={match ? match[1] : 'text'} PreTag="div" customStyle={{ margin: 0, padding: '2rem', background: 'transparent', fontSize: '14px', lineHeight: '1.8' }} {...props} />
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

                {/* 3. FOOTER FOR PDF (Appears at bottom of document) */}
                <div className="mt-20 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-gray-600 font-bold">
                        Generated by AI Project Architect • {new Date().getFullYear()} Engineering Blueprint
                    </p>
                </div>
            </div>
        </div>
    );
}
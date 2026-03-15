import React, { useState, useMemo, useEffect } from 'react';
import { Shield, Search, Terminal, Lock, Globe, Cpu, ChevronRight, AlertTriangle, CheckCircle2, Info, MessageSquare, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { PROJECTS } from './constants';
import { Project } from './types';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

function PhishingDetectorDemo() {
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    riskLevel: 'Low' | 'Medium' | 'High';
    score: number;
    redFlags: string[];
    analysis: string;
  } | null>(null);

  const analyzeMessage = async () => {
    if (!message.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const model = "gemini-3-flash-preview";
      const response = await genAI.models.generateContent({
        model,
        contents: `Analyze the following message for phishing indicators. 
        Provide a JSON response with:
        - riskLevel: "Low", "Medium", or "High"
        - score: 0-100 (100 being most dangerous)
        - redFlags: array of strings identifying specific suspicious elements
        - analysis: a brief explanation of why it is or isn't phishing.

        Message: "${message}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING },
              score: { type: Type.NUMBER },
              redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              analysis: { type: Type.STRING }
            },
            required: ["riskLevel", "score", "redFlags", "analysis"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Paste Message to Analyze</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g., Dear customer, your account has been suspended. Click here to verify your identity immediately..."
          className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
        />
        <button
          onClick={analyzeMessage}
          disabled={isAnalyzing || !message.trim()}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              Scan for Phishing
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${
              result.riskLevel === 'High' ? 'bg-red-500/5 border-red-500/20' :
              result.riskLevel === 'Medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
              'bg-emerald-500/5 border-emerald-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {result.riskLevel === 'High' ? <ShieldAlert className="w-6 h-6 text-red-500" /> :
                 result.riskLevel === 'Medium' ? <AlertTriangle className="w-6 h-6 text-yellow-500" /> :
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />}
                <div>
                  <h4 className="text-lg font-bold text-white">{result.riskLevel} Risk Detected</h4>
                  <p className="text-xs text-zinc-500 font-mono">Threat Score: {result.score}/100</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-6 leading-relaxed italic">
              "{result.analysis}"
            </p>

            {result.redFlags.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Red Flags Identified</h5>
                <div className="flex flex-wrap gap-2">
                  {result.redFlags.map((flag, i) => (
                    <span key={i} className="text-[10px] bg-black/40 border border-white/5 text-zinc-300 px-2 py-1 rounded">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const categories = Array.from(new Set(PROJECTS.map(p => p.category)));

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.concepts.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (!selectedProject) setIsDemoMode(false);
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">CyberGuard</h1>
              <p className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-mono">Security Lab v1.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search projects, tools, concepts..."
                className="bg-zinc-900/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors">
              CONTRIBUTE
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar / Filters */}
          <aside className="lg:col-span-3 space-y-8">
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Categories</h2>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-white/5 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                >
                  All Projects
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-white/5 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            <section className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
              <Info className="w-5 h-5 text-emerald-500 mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">Learning Path</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Start with <span className="text-emerald-400">Beginner</span> projects to build a foundation in security logic before moving to network-level tools.
              </p>
            </section>
          </aside>

          {/* Project Grid */}
          <div className="lg:col-span-9">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Mini Project List</h2>
              <span className="text-xs font-mono text-zinc-500">{filteredProjects.length} Modules Found</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  layoutId={project.id}
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group relative bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-emerald-500" />
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5">
                      {project.category === 'Cryptography' && <Lock className="w-6 h-6 text-purple-400" />}
                      {project.category === 'Network Security' && <Globe className="w-6 h-6 text-blue-400" />}
                      {project.category === 'Web Security' && <Terminal className="w-6 h-6 text-emerald-400" />}
                      {project.category === 'System Security' && <Cpu className="w-6 h-6 text-orange-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          project.difficulty === 'Beginner' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                          project.difficulty === 'Intermediate' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                          'border-red-500/20 text-red-500 bg-red-500/5'
                        }`}>
                          {project.difficulty}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">{project.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 line-clamp-2 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.concepts.slice(0, 2).map(concept => (
                      <span key={concept} className="text-[10px] font-mono bg-white/5 text-zinc-400 px-2 py-1 rounded">
                        {concept}
                      </span>
                    ))}
                    {project.concepts.length > 2 && (
                      <span className="text-[10px] font-mono text-zinc-600 px-2 py-1">+{project.concepts.length - 2} more</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              layoutId={selectedProject.id}
              className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[700px] bg-[#121214] border border-white/10 rounded-3xl z-[70] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 overflow-y-auto flex-1">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">{selectedProject.category}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-xs text-zinc-500">{selectedProject.difficulty} Level</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedProject.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <Search className="w-6 h-6 text-zinc-500 rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="md:col-span-2 space-y-8">
                    {isDemoMode && selectedProject.id === 'phishing-detector' ? (
                      <section>
                        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-500" />
                          Live Phishing Analysis Demo
                        </h3>
                        <PhishingDetectorDemo />
                      </section>
                    ) : (
                      <>
                        <section>
                          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4 text-emerald-500" />
                            Overview
                          </h3>
                          <p className="text-zinc-400 leading-relaxed">
                            {selectedProject.description}
                          </p>
                        </section>

                        <section>
                          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-emerald-500" />
                            Implementation Steps
                          </h3>
                          <div className="space-y-4">
                            {selectedProject.steps.map((step, idx) => (
                              <div key={idx} className="flex gap-4">
                                <span className="text-emerald-500 font-mono text-sm font-bold">0{idx + 1}</span>
                                <p className="text-sm text-zinc-400">{step}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      </>
                    )}
                  </div>

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Core Concepts</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.concepts.map(c => (
                          <span key={c} className="text-xs bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2 py-1 rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Tools & Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tools.map(t => (
                          <span key={t} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </section>

                    <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] font-bold text-yellow-500 uppercase">Ethical Warning</span>
                      </div>
                      <p className="text-[10px] text-yellow-500/70 leading-relaxed">
                        Always perform security testing in controlled environments. Never target systems without explicit permission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-black/40 border-t border-white/5 flex justify-end gap-4">
                <button
                  onClick={() => {
                    if (isDemoMode) setIsDemoMode(false);
                    else setSelectedProject(null);
                  }}
                  className="px-6 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  {isDemoMode ? 'Back to Guide' : 'Close'}
                </button>
                {!isDemoMode && (
                  <button 
                    onClick={() => setIsDemoMode(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold px-8 py-2 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Start Module
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

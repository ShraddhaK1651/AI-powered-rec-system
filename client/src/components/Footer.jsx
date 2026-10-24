import React from 'react';
import { GraduationCap, ShieldAlert } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">EduPath AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              AI-Powered Personalized Academic and Career Guidance System. Designed for VII-Semester Computer Science & Engineering Major Project evaluation.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">React 19</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">FastAPI</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">ChromaDB</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Gemini RAG</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/recommendations" className="hover:text-white transition-colors">Course Recommendations</a></li>
              <li><a href="/skill-gap" className="hover:text-white transition-colors">Skill-Gap Analysis</a></li>
              <li><a href="/chat" className="hover:text-white transition-colors">RAG Academic Assistant</a></li>
              <li><a href="/recommendations" className="hover:text-white transition-colors">Capstone Projects</a></li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Institutional Grounding</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-slate-400">Strict Source Attribution</span></li>
              <li><span className="text-slate-400">Deterministic Scoring</span></li>
              <li><span className="text-slate-400">Multi-Factor Cosine Match</span></li>
              <li><a href="/admin-login" className="text-brand-400 hover:text-brand-300 transition-colors">Administrator Access</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © 2026 EduPath AI. Computer Science and Engineering Major Project. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-800/60 px-3 py-1.5 rounded-md border border-slate-700/50">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Advisory recommendations do not guarantee academic admission or corporate employment.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

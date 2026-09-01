"use client";

import { Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

export default function AdminAIPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
        <Sparkles className="w-6 h-6 text-purple-700" />
        <h1 className="text-2xl font-bold text-slate-900">Internal AI Service Pipeline Configuration</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900">
          <strong>AI Models & Service Status:</strong>
          <ul className="mt-2 space-y-1">
            <li>✓ Text Classification & Keyword Extraction Pipeline: Active</li>
            <li>✓ WebM Speech-to-Text Transcribe Pipeline: Active</li>
            <li>✓ Spatial & Semantic Duplicate Check (pgvector cosine similarity): Active</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

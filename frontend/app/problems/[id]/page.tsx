"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Building2, 
  GraduationCap, 
  Factory, 
  ChevronRight, 
  Star,
  Layers,
  ArrowLeft,
  FileCheck
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

const STATUS_PIPELINE = [
  "REPORTED",
  "ROUTING_RECOMMENDED",
  "ASSIGNED",
  "ACCEPTED",
  "RESEARCH",
  "FEASIBILITY",
  "SOLUTION_PROPOSED",
  "PILOT",
  "IMPLEMENTATION",
  "VERIFICATION",
  "RESOLVED"
];

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [isSatisfied, setIsSatisfied] = useState(true);
  const [requestReopen, setRequestReopen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    loadDetail();
  }, [problemId]);

  const loadDetail = async () => {
    try {
      const data = await fetchApi(`/problems/${problemId}`);
      setProblem(data);

      const sim = await fetchApi(`/problems/${problemId}/similar`);
      setSimilar(sim);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`/feedback/problems/${problemId}`, {
        method: 'POST',
        body: JSON.stringify({
          rating,
          comments: feedbackComments,
          is_satisfied: isSatisfied,
          requested_reopen: requestReopen
        })
      });
      setFeedbackSubmitted(true);
      loadDetail();
    } catch (e: any) {
      alert(e.message || 'Feedback submission failed');
    }
  };

  if (loading) return <div className="text-center py-24 text-slate-500 font-medium">Loading problem detail & AI analysis...</div>;
  if (!problem) return <div className="text-center py-24 text-slate-500">Problem not found.</div>;

  const currentStatusIdx = STATUS_PIPELINE.indexOf(problem.status);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link href="/problems" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Feed
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-md border border-emerald-200">
                {problem.category}
              </span>
              {problem.subcategory && (
                <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
                  {problem.subcategory}
                </span>
              )}
            </div>

            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-white">
              Status: {problem.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{problem.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 border-y border-slate-100 py-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <strong>Location:</strong> {problem.address || problem.district} ({problem.district} District)
            </span>
            <span>
              <strong>Reported On:</strong> {new Date(problem.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{problem.description}</p>

          {/* Problem Images */}
          {problem.images && problem.images.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold uppercase text-slate-500 block mb-2">Submitted Photos</span>
              <div className="flex flex-wrap gap-4">
                {problem.images.map((img: any, i: number) => (
                  <img 
                    key={i} 
                    src={img.image_url} 
                    alt="Problem attachment" 
                    className="w-36 h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* METRICS & AI ANALYSIS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Severity Scores */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Impact Metrics</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Severity Score</span>
                <span className="text-rose-600">{problem.severity}/10</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${problem.severity * 10}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Urgency Score</span>
                <span className="text-amber-600">{problem.urgency}/10</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${problem.urgency * 10}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Public Impact Score</span>
                <span className="text-emerald-600">{problem.public_impact}/10</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${problem.public_impact * 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Processing Summary */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI Intelligence Pipeline Analysis
            </span>
            <span className="text-xs text-slate-400">Confidence: {((problem.confidence_score || 0.92) * 100).toFixed(0)}%</span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            "{problem.ai_summary || "Automated NLP analysis completed."}"
          </p>

          <div className="pt-2 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Required Expertise Domains:</span>
              <div className="flex flex-wrap gap-1.5">
                {(problem.required_expertise || ["Water Engineering", "Public Health"]).map((exp: string, i: number) => (
                  <span key={i} className="bg-slate-700 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-400 block mb-0.5">Recommended Destination:</span>
              <span className="text-amber-300 font-bold uppercase text-xs tracking-wide">
                {problem.recommended_route || "COLLABORATION"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR PROBLEMS & DUPLICATE WARNING */}
      {similar.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>AI Vector Similarity Search — {similar.length} Similar Nearby Problem(s) Detected</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {similar.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{s.title}</div>
                  <div className="text-[11px] text-slate-500">{s.district} • {s.category}</div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${s.is_possible_duplicate ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                    {s.similarity_score}% Similar
                  </span>
                  {s.is_possible_duplicate && <span className="block text-[10px] text-rose-600 font-bold">Possible Duplicate</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATUS PROGRESS TIMELINE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-700" />
          Problem Status Progress Lifecycle
        </h3>

        <div className="overflow-x-auto pb-4">
          <div className="flex items-center min-w-[700px]">
            {STATUS_PIPELINE.map((st, idx) => {
              const isPast = idx <= currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;

              return (
                <div key={st} className="flex-1 flex flex-col items-center relative group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 z-10 ${
                    isCurrent ? 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-100' :
                    isPast ? 'bg-emerald-100 text-emerald-800 border-emerald-500' :
                    'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </div>

                  <span className={`text-[10px] font-semibold mt-2 text-center uppercase tracking-tighter ${
                    isCurrent ? 'text-emerald-700 font-bold' : isPast ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {st.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MILESTONES & PROPOSED SOLUTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Implementation Milestones */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            Implementation Milestones
          </h3>

          {problem.milestones && problem.milestones.length > 0 ? (
            <div className="space-y-3">
              {problem.milestones.map((m: any) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{m.title}</div>
                    <div className="text-[11px] text-slate-500">{m.description || 'Target date: ' + m.target_date}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    m.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    m.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic py-4">No milestones logged yet.</div>
          )}
        </div>

        {/* R&D Solutions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-600" />
            Proposed R&D Solutions & Prototypes
          </h3>

          {problem.solutions && problem.solutions.length > 0 ? (
            <div className="space-y-3">
              {problem.solutions.map((sol: any) => (
                <div key={sol.id} className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-900">{sol.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sol.description}</p>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 font-medium">
                    <span>Cost Est: {sol.cost_estimate || 'N/A'}</span>
                    <span>Timeline: {sol.implementation_time || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic py-4">No solution proposals recorded yet.</div>
          )}
        </div>
      </div>

      {/* CITIZEN FEEDBACK SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          Citizen Feedback & Resolution Review
        </h3>

        {feedbackSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Thank you! Your feedback has been recorded.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Rating (1 to 5 Stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm border transition ${
                      rating >= num ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    ★ {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Comments / Satisfaction Details</label>
              <textarea
                rows={3}
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                placeholder="Are you satisfied with the quality of ground implementation?"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestReopen}
                  onChange={(e) => setRequestReopen(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span className="text-rose-700 font-semibold">Issue not fixed properly? Request Reopening</span>
              </label>
            </div>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
            >
              Submit Citizen Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
export async function generateStaticParams() {
  return [];
}
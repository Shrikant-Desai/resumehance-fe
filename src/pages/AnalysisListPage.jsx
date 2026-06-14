import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalyses } from "../api/analysis";
import {
  BarChart3,
  TrendingUp,
  ChevronRight,
  Plus,
  Clock,
  Search,
} from "lucide-react";
import { useState } from "react";

const AnalysisListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ["analyses"],
    queryFn: fetchAnalyses,
  });

  const getScore = (run) => {
    const s = run.readiness_score;
    return typeof s === "object" && s !== null ? (s.score ?? 0) : (s ?? 0);
  };

  const filtered = analyses.filter((run) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (run.job_title || "").toLowerCase().includes(q) ||
      String(run.resume_id).includes(q) ||
      String(run.jd_id).includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left select-none">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
            Analysis History
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {analyses.length > 0
              ? `${analyses.length} analysis run${analyses.length !== 1 ? "s" : ""} • Click any to view full report`
              : "No analyses yet. Run your first match below."}
          </p>
        </div>

        <button
          onClick={() => navigate("/analysis/new")}
          className="bg-primary-gradient text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-transform flex items-center gap-2 cursor-pointer text-sm shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          New Analysis
        </button>
      </section>

      {/* Search bar — only shown when there are results */}
      {analyses.length > 0 && (
        <div className="relative">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title, resume ID or JD ID…"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition"
          />
        </div>
      )}

      {/* Empty State */}
      {analyses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 gap-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/30 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
            <TrendingUp size={28} className="text-primary" />
          </div>
          <div>
            <h4 className="font-headline text-lg font-bold">No analyses yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              Upload a resume, add a job description, then hit "New Analysis" to
              calculate your readiness score.
            </p>
          </div>
          <button
            onClick={() => navigate("/analysis/new")}
            className="bg-primary-gradient text-white py-2.5 px-6 rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            Run Your First Analysis
          </button>
        </div>
      ) : filtered.length === 0 ? (
        /* No search results */
        <div className="flex flex-col items-center justify-center text-center py-16 gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/30 dark:border-slate-800">
          <Search size={32} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No results match &ldquo;{search}&rdquo;
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-primary text-xs font-bold hover:underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        /* Analysis List */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/30 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table header — desktop */}
          <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-10 text-center">#</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Job / Resume</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Date</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right pr-2">Score</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((run, index) => {
              const runId = run.analysis_id || run.id;
              const rsScore = Math.round(getScore(run));
              const scoreColor =
                rsScore >= 75
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                  : rsScore >= 55
                  ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                  : rsScore > 0
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";

              return (
                <div
                  key={runId}
                  onClick={() => navigate(`/analysis/${runId}`)}
                  className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
                >
                  {/* Index badge — desktop only */}
                  <div className="hidden sm:flex w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 items-center justify-center shrink-0 text-xs font-bold">
                    {index + 1}
                  </div>

                  {/* Icon — mobile */}
                  <div className="sm:hidden w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                    <BarChart3 size={16} />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <h6 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors">
                      {run.job_title || `Job #${run.jd_id}`}
                    </h6>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>Resume #{run.resume_id}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span>JD #{run.jd_id}</span>
                      {run.created_at && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(run.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Score badge */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span
                      className={`text-sm font-extrabold px-3 py-1 rounded-full ${scoreColor}`}
                    >
                      {rsScore > 0 ? `${rsScore}%` : "—"}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-slate-300 dark:text-slate-600 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary footer when list is filtered */}
      {search.trim() && filtered.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Showing {filtered.length} of {analyses.length} results
        </p>
      )}
    </div>
  );
};

export default AnalysisListPage;

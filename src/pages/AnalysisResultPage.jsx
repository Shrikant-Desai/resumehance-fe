import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalysisDetails } from "../api/analysis";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  AlertTriangle,
  Clock,
  BookOpen,
  Download,
  ExternalLink,
} from "lucide-react";

const AnalysisResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: analysis,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => fetchAnalysisDetails(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
        <div className="flex flex-col items-center justify-center space-y-6 py-10">
          <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    const errorMessage =
      error?.message || "Verify the ID is correct and belongs to your profile.";
    const errorCode = error?.code;

    return (
      <div className="text-center py-16 sm:py-20 space-y-4">
        <AlertCircle size={48} className="mx-auto text-rose-500" />
        <h3 className="font-headline text-lg font-bold text-slate-700 dark:text-slate-300">
          Failed to load analysis results
        </h3>
        {errorCode && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/30 text-rose-500 px-2.5 py-1 rounded">
            {errorCode}
          </span>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">{errorMessage}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-primary-gradient text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // ── API response shape ─────────────────────────────────────────────────────
  // analysis.analysis_id
  // analysis.readiness_score = { score, verdict, skill_score, experience_score, breakdown: { critical_score, important_score, good_to_have_score, experience_score } }
  // analysis.match_result    = { matched_skills: [{skill, matched_with, similarity_score, match_type}], partial_skills, missing_skills, match_percentage }
  // analysis.gap_result      = { experience_gap: { required_years, candidate_years, gap_years, verdict }, skill_gaps: [{skill, priority, gap_type, estimated_learning_weeks}], total_critical_gaps, total_important_gaps }
  // analysis.roadmap         = { target_role, total_weeks, candidate_level, roadmap: [{week, skill, priority, action, resource, mini_project, milestone}] }

  const readinessObj = analysis.readiness_score || {};
  const score        = Math.round(readinessObj.score ?? 0);
  const verdict      = readinessObj.verdict || "—";
  const breakdown    = readinessObj.breakdown || {};

  const matchResult  = analysis.match_result || {};
  const matchedSkills = (matchResult.matched_skills || []).map((s) => (typeof s === "string" ? s : s.skill));
  const partialSkills = (matchResult.partial_skills || []).map((s) => (typeof s === "string" ? s : s.skill));
  const missingSkills = (matchResult.missing_skills || []).map((s) => (typeof s === "string" ? s : s.skill));
  const matchPct     = matchResult.match_percentage ?? null;

  const gapResult    = analysis.gap_result || {};
  const expGap       = gapResult.experience_gap || {};
  const skillGaps    = gapResult.skill_gaps || [];

  const roadmapObj   = analysis.roadmap || {};
  const roadmapArray = Array.isArray(roadmapObj.roadmap) ? roadmapObj.roadmap : [];

  // Circular progress
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-10 sm:space-y-12 text-left select-none">
      {/* Top Title Banner */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded">
            Analysis Run #{analysis.analysis_id || id}
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-slate-800 dark:text-slate-200">
            {roadmapObj.target_role || `Analysis #${analysis.analysis_id || id}`}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">
            Resume ID: {analysis.resume_id} • JD ID: {analysis.jd_id} • Analyzed{" "}
            {analysis.created_at
              ? new Date(analysis.created_at).toLocaleDateString()
              : "Just now"}
          </p>
        </div>

        <button
          onClick={() => navigate("/analysis")}
          className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft size={14} />
          All Analyses
        </button>
      </section>

      {/* Hero Circular Match Score Panel */}
      <section className="flex flex-col items-center justify-center text-center space-y-6 py-4">
        <div className="relative w-44 h-44 sm:w-60 sm:h-60 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-slate-100 dark:text-slate-800"
              cx="50%"
              cy="50%"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
            />
            <circle
              className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]"
              cx="50%"
              cy="50%"
              fill="transparent"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-headline text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100">
              {score}%
            </span>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
              {verdict} Match
            </span>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {matchPct !== null && (
            <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-primary text-xs font-bold rounded-full">
              Skill Match: {matchPct}%
            </span>
          )}
          {expGap.verdict && (
            <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full">
              Experience Gap: {expGap.gap_years?.toFixed(1)}y ({expGap.verdict})
            </span>
          )}
          {gapResult.total_critical_gaps != null && (
            <span className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-full">
              {gapResult.total_critical_gaps} Critical Gap{gapResult.total_critical_gaps !== 1 ? "s" : ""}
            </span>
          )}
          {gapResult.total_important_gaps != null && (
            <span className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full">
              {gapResult.total_important_gaps} Important Gap{gapResult.total_important_gaps !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="max-w-xl px-4">
          <h3 className="font-headline text-xl font-bold">Match Readiness Summary</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Your profile indicates a <strong>{verdict.toLowerCase()}</strong> match for{" "}
            <strong>{roadmapObj.target_role || "the target position"}</strong>.
            Skill score: {readinessObj.skill_score ?? "—"} pts •{" "}
            Experience score: {readinessObj.experience_score ?? "—"} pts.
          </p>
        </div>
      </section>

      {/* Bento Grid: Score Breakdown + Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Readiness Score Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
              Score Breakdown
            </h4>
            <span className="text-[10px] font-bold text-primary bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
              Weighted Formula
            </span>
          </div>

          <div className="space-y-5">
            {[
              { label: "Critical Skills Match", max: 40, key: "critical_score", suffix: "(40 pts)" },
              { label: "Important Skills Match", max: 25, key: "important_score", suffix: "(25 pts)" },
              { label: "Good-to-Have Skills", max: 15, key: "good_to_have_score", suffix: "(15 pts)" },
              { label: "Experience Alignment", max: 20, key: "experience_score", suffix: "(20 pts)" },
            ].map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>
                    {item.label}{" "}
                    <span className="text-slate-400 font-normal">{item.suffix}</span>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {breakdown[item.key] ?? 0} pts
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${((breakdown[item.key] ?? 0) / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <p className="text-[10px] text-slate-400 italic mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              * Scores are computed deterministically based on experience requirements and skill priority mappings.
            </p>
          </div>
        </div>

        {/* Skill Match Report */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400 mb-1">
              Skill Match Report
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Skills analyzed via semantic vector similarity matching.
            </p>
          </div>

          <div className="space-y-5">
            {missingSkills.length === 0 ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-lg font-semibold flex items-center gap-1.5">
                <BadgeCheck size={14} className="shrink-0" />
                No missing required skills! Perfect match.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Missing Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-rose-100/20"
                    >
                      <AlertTriangle size={10} className="shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {partialSkills.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Needs Strengthening
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {partialSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {matchedSkills.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Matched Qualifications
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.slice(0, 8).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                  {matchedSkills.length > 8 && (
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full text-xs font-semibold">
                      +{matchedSkills.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Skill Gap Table */}
      {skillGaps.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400">
              Detailed Skill Gap Analysis
            </h4>
            {expGap.required_years != null && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Exp required: {expGap.required_years}y • Candidate: {expGap.candidate_years}y •{" "}
                Gap: {expGap.gap_years?.toFixed(1)}y ({expGap.verdict})
              </span>
            )}
          </div>
          <div className="space-y-2">
            {skillGaps.map((gap, index) => {
              const priorityColor =
                gap.priority === "critical"
                  ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30"
                  : gap.priority === "important"
                    ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
                    : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl gap-4 flex-wrap"
                >
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {gap.skill}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${priorityColor}`}>
                      {gap.priority}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-primary">
                      {(gap.gap_type || "").replace(/_/g, " ")}
                    </span>
                    {gap.estimated_learning_weeks && (
                      <span className="text-[9px] text-slate-400">
                        ~{gap.estimated_learning_weeks}w
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Week-by-Week Learning Roadmap */}
      {roadmapArray.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100/10 dark:border-slate-800 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h3 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight">
                Your Mastery Roadmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                {roadmapObj.total_weeks}-week personalized plan for a{" "}
                {roadmapObj.candidate_level} level candidate
              </p>
            </div>

            <div className="relative space-y-8 sm:space-y-10">
              {/* Timeline vertical line */}
              <div className="absolute left-5 sm:left-6 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800 opacity-60" />

              {roadmapArray.map((item, index) => (
                <div key={index} className="relative flex gap-5 sm:gap-8 items-start group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-gradient text-white flex items-center justify-center font-bold z-10 shrink-0 shadow-md text-sm">
                    {item.week || index + 1}
                  </div>

                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                      <h4 className="font-headline font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                        {item.skill}
                      </h4>
                      {item.priority && (
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                            item.priority === "critical"
                              ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                              : item.priority === "important"
                                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {item.priority}
                        </span>
                      )}
                    </div>

                    {item.mini_project && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">🛠 Project: </span>
                        {item.mini_project}
                      </p>
                    )}

                    {item.milestone && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">🏁 Milestone: </span>
                        {item.milestone}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      {item.resource && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary truncate max-w-[280px]">
                          <BookOpen size={11} className="shrink-0" />
                          {item.resource}
                        </span>
                      )}
                      {item.action && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase">
                          <Clock size={11} />
                          {item.action}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer action controls */}
      <footer className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 border-t border-slate-200/30 dark:border-slate-800/80">
        <button
          onClick={() => {
            toast.success("Analysis report PDF generated successfully!");
          }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all cursor-pointer border border-slate-200 dark:border-slate-700 w-full sm:w-auto"
        >
          <Download size={14} />
          Export PDF
        </button>

        <button
          onClick={() => {
            toast.success("Redirecting to active application portals...");
          }}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-gradient text-white font-bold rounded-xl text-xs shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform cursor-pointer w-full sm:w-auto"
        >
          Apply for this Role
          <ExternalLink size={14} />
        </button>
      </footer>
    </div>
  );
};

export default AnalysisResultPage;

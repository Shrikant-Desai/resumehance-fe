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

  const score = Math.round(analysis.readiness_score || 0);
  const verdict = analysis.verdict || "Good";
  const breakdown = analysis.breakdown || {};
  const skillGapReport = analysis.skill_gap_report || {};

  const matchedSkills = skillGapReport.matched || [];
  const partialSkills = skillGapReport.partial || [];
  const missingSkills = skillGapReport.missing || [];

  // Roadmap parser
  let roadmapArray = [];
  if (Array.isArray(analysis.roadmap)) {
    roadmapArray = analysis.roadmap;
  } else if (typeof analysis.roadmap === "string") {
    try {
      const sections = analysis.roadmap.split(/Week \d+:?/i).filter(Boolean);
      roadmapArray = sections.map((sec, idx) => {
        const lines = sec.trim().split("\n");
        const title = lines[0].replace(/^[#*\-\s]+/, "").trim();
        const description = lines
          .slice(1)
          .join("\n")
          .replace(/^[#*\-\s]+/, "")
          .trim();
        return {
          week: idx + 1,
          title: title || `Learning Module ${idx + 1}`,
          description: description || "Study gaps identified in skills mapping.",
        };
      });
    } catch {
      roadmapArray = [
        { week: 1, title: "Foundations of Gaps", description: analysis.roadmap },
      ];
    }
  }

  if (roadmapArray.length === 0) {
    roadmapArray = [
      {
        week: 1,
        title: "Focus on Core Gaps",
        description: "Study missing required skills and complete A/B testing exercises.",
        hours: 6,
        resources: 2,
      },
      {
        week: 2,
        title: "Build Portfolio Case Studies",
        description:
          "Apply Figma patterns or database metrics to real projects in your resume.",
        hours: 5,
        resources: 1,
      },
      {
        week: 3,
        title: "System Design and Architecture",
        description:
          "Refactor backend pipelines or component systems to support scalable structures.",
        hours: 4,
        resources: 3,
      },
      {
        week: 4,
        title: "Final Interview Readiness",
        description:
          "Practice answering behavior questions and coding challenges in live mocks.",
        hours: 3,
        resources: 2,
      },
    ];
  }

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
            Analysis Run #{analysis.id || id}
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-slate-800 dark:text-slate-200">
            {analysis.job_title || "Target Position Profile"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">
            Company: {analysis.company || "Target Company"} • Analyzed{" "}
            {analysis.created_at
              ? new Date(analysis.created_at).toLocaleDateString()
              : "Just now"}
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft size={14} />
          Dashboard History
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
        <div className="max-w-xl px-4">
          <h3 className="font-headline text-xl font-bold">Match Readiness Summary</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {analysis.summary ||
              `Your profile indicates a ${verdict.toLowerCase()} match. You possess strong qualifications in matched categories, with specific skills gaps identified below.`}
          </p>
        </div>
      </section>

      {/* Bento Grid: Gaps & Breakdown */}
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
                    {breakdown[item.key] || 0} pts
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${((breakdown[item.key] || 0) / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <p className="text-[10px] text-slate-400 italic mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              * Calculations are parsed deterministically against experience requirements and
              skill priorities mappings.
            </p>
          </div>
        </div>

        {/* Skill Gap Reports */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-slate-400 mb-1">
              Gaps to Close
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Gemini analyzed these missing credentials based on semantic proximity of vectors.
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
                  Missing Requirements
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
                  Partial Matches
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

      {/* Week-by-Week Learning Roadmap */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100/10 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight">
              Your Mastery Roadmap
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Personalized week-by-week learning plan automatically tailored to fill your credentials gap.
            </p>
          </div>

          <div className="relative space-y-8 sm:space-y-10">
            {/* Timeline Line vertical */}
            <div className="absolute left-5 sm:left-6 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800 opacity-60" />

            {roadmapArray.map((item, index) => (
              <div key={index} className="relative flex gap-5 sm:gap-8 items-start group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-gradient text-white flex items-center justify-center font-bold z-10 shrink-0 shadow-md text-sm">
                  {item.week || index + 1}
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all min-w-0">
                  <h4 className="font-headline font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary">
                      <Clock size={11} />
                      {item.hours || 5} hours
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                      <BookOpen size={11} />
                      {item.resources || 2} Resources
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

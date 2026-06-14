import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchResumes } from "../api/resume";
import { fetchJobDescriptions } from "../api/job";
import { fetchAnalyses } from "../api/analysis";
import { useSelector } from "react-redux";
import {
  FileText,
  Briefcase,
  BarChart3,
  TrendingUp,
  Upload,
  ClipboardList,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Queries
  const { data: resumes = [], isLoading: loadingResumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
  });

  const { data: jobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobDescriptions,
  });

  const { data: analyses = [], isLoading: loadingAnalyses } = useQuery({
    queryKey: ["analyses"],
    queryFn: fetchAnalyses,
  });

  const isLoading = loadingResumes || loadingJobs || loadingAnalyses;

  // Derive metrics
  const resumeCount = resumes.length;
  const jobCount = jobs.length;
  const analysisCount = analyses.length;

  // readiness_score may be a nested object { score } or a plain number depending on the list endpoint
  const getScore = (run) => {
    const s = run.readiness_score;
    return typeof s === "object" && s !== null ? (s.score ?? 0) : (s ?? 0);
  };

  const averageScore =
    analysisCount > 0
      ? Math.round(analyses.reduce((acc, curr) => acc + getScore(curr), 0) / analysisCount)
      : 0;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="lg:col-span-4 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Resumes Uploaded",
      value: resumeCount,
      icon: FileText,
      iconBg: "bg-indigo-50 dark:bg-slate-800",
      iconColor: "text-primary",
    },
    {
      label: "Job Descriptions",
      value: jobCount,
      icon: Briefcase,
      iconBg: "bg-indigo-50 dark:bg-slate-800",
      iconColor: "text-primary",
    },
    {
      label: "Analyses Performed",
      value: analysisCount,
      icon: BarChart3,
      iconBg: "bg-indigo-50 dark:bg-slate-800",
      iconColor: "text-primary",
    },
    {
      label: "Average Match",
      value: `${averageScore}%`,
      icon: TrendingUp,
      iconBg: "bg-emerald-50 dark:bg-slate-800",
      iconColor: "text-secondary",
      valueColor: "text-secondary",
    },
  ];

  return (
    <div className="space-y-8 lg:space-y-10 text-left select-none">
      {/* Welcome Section */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.email?.split("@")[0] || "User"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Analyze, compare, and optimize your qualifications against any job description.
          </p>
        </div>

        <button
          onClick={() => navigate("/analysis/new")}
          className="bg-primary-gradient text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-transform flex items-center gap-2 cursor-pointer text-sm shrink-0 self-start sm:self-auto"
        >
          <BarChart3 size={16} />
          Run Analysis
        </button>
      </section>

      {/* Quick Statistics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/30 dark:border-slate-800 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <h3 className={`text-3xl font-headline font-extrabold mt-2 ${card.valueColor || ""}`}>
                  {card.value}
                </h3>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} ${card.iconColor} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Asymmetric Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Side: Recent Analyses */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/30 dark:border-slate-800 min-h-[300px] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline text-lg font-bold">Recent Analyses</h4>
              <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                History
              </span>
            </div>

            {analysisCount === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <TrendingUp size={24} className="text-slate-400" />
                </div>
                <div>
                  <h5 className="font-bold text-sm">No analysis matching yet</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    Start by uploading a resume and submitting a job description to calculate your readiness.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/analysis/new")}
                  className="text-primary text-xs font-bold hover:underline cursor-pointer"
                >
                  Start your first analysis →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {analyses?.slice(0, 5)?.map((run) => {
                  const runId = run.analysis_id || run.id;
                  const rsScore = Math.round(getScore(run));
                  return (
                    <div
                      key={runId}
                      onClick={() => navigate(`/analysis/${runId}`)}
                      className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-all border border-slate-100/10"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                          <BarChart3 size={16} />
                        </div>
                        <div className="min-w-0">
                          <h6 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
                            {run.job_title || `JD #${run.jd_id} / Resume #${run.resume_id}`}
                          </h6>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Resume #{run.resume_id} • JD #{run.jd_id} •{" "}
                            {run.created_at
                              ? new Date(run.created_at).toLocaleDateString()
                              : "Just now"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
                        {rsScore > 0 && (
                          <span
                            className={`text-sm font-extrabold px-2.5 sm:px-3 py-1 rounded-full ${
                              rsScore >= 75
                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                                : rsScore >= 55
                                  ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                                  : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {rsScore}%
                          </span>
                        )}
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {analysisCount > 5 && (
            <button
              onClick={() => navigate("/analysis")}
              className="mt-6 text-primary text-xs font-bold hover:underline self-start cursor-pointer"
            >
              View all analyses →
            </button>
          )}
        </div>

        {/* Right Side: Quick Action Tiles */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100/30 dark:border-slate-800 rounded-2xl p-5 sm:p-6 text-left shadow-sm">
            <h4 className="font-headline text-sm font-bold mb-4">Quick Operations</h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/resumes")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-indigo-400 rounded-xl transition-all text-left border border-slate-100/10 cursor-pointer group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Upload size={16} />
                </div>
                <div className="min-w-0">
                  <h6 className="font-bold text-sm">Upload Resume</h6>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Configure parsed AI fields</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/jobs")}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-indigo-400 rounded-xl transition-all text-left border border-slate-100/10 cursor-pointer group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <ClipboardList size={16} />
                </div>
                <div className="min-w-0">
                  <h6 className="font-bold text-sm">Add Job Details</h6>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Paste roles and priorities</p>
                </div>
              </button>
            </div>
          </div>

          {/* Support Banner */}
          <div className="bg-primary text-white rounded-2xl p-5 sm:p-6 text-left relative overflow-hidden shadow-lg shadow-indigo-600/10">
            <h4 className="font-headline text-sm font-bold mb-2">Curator AI Coach</h4>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Get detailed learning roadmaps to close your technical gaps and ready your applications.
            </p>
            <button
              onClick={() => navigate("/analysis/new")}
              className="bg-white text-primary text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm hover:scale-95 transition-transform cursor-pointer"
            >
              Analyze Now
            </button>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
              <Sparkles size={96} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

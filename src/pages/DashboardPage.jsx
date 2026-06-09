import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchResumes } from "../api/resume";
import { fetchJobDescriptions } from "../api/job";
import { fetchAnalyses } from "../api/analysis";
import { useSelector } from "react-redux";

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

  const averageScore =
    analysisCount > 0
      ? Math.round(
          analyses.reduce((acc, curr) => acc + (curr.readiness_score || 0), 0) /
            analysisCount,
        )
      : 0;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        {/* Welcome Section skeleton */}
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
        {/* Stats Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"
            ></div>
          ))}
        </div>
        {/* Content Section skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="lg:col-span-4 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-left select-none">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.email?.split("@")[0] || "User"}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Analyze, compare, and optimize your qualifications against any job
            description.
          </p>
        </div>

        <button
          onClick={() => navigate("/analysis")}
          className="bg-primary-gradient text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] active:scale-95 transition-transform flex items-center gap-2 cursor-pointer text-sm"
        >
          <span className="material-symbols-outlined text-sm">analytics</span>
          Run Analysis
        </button>
      </section>

      {/* Quick Statistics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Resumes Uploaded
            </p>
            <h3 className="text-3xl font-headline font-extrabold mt-2">
              {resumeCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 text-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">
              description
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Job Descriptions
            </p>
            <h3 className="text-3xl font-headline font-extrabold mt-2">
              {jobCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 text-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">work</span>
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Analyses Performed
            </p>
            <h3 className="text-3xl font-headline font-extrabold mt-2">
              {analysisCount}
            </h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 text-primary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">
              analytics
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Average Match
            </p>
            <h3 className="text-3xl font-headline font-extrabold mt-2 text-secondary">
              {averageScore}%
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-800 text-secondary rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">
              analytics
            </span>
          </div>
        </div>
      </section>

      {/* Asymmetric Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Recent Analyses */}
        <div className="lg:col-span-8 bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800 min-h-[350px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline text-lg font-bold">
                Recent Analyses
              </h4>
              <span className="bg-surface-container-highest dark:bg-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                History
              </span>
            </div>

            {analysisCount === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <span className="material-symbols-outlined text-4xl text-slate-400">
                  query_stats
                </span>
                <div>
                  <h5 className="font-bold text-sm">
                    No analysis matching yet
                  </h5>
                  <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
                    Start by uploading a resume and submitting a job description
                    to calculate your readiness.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/analysis")}
                  className="text-primary text-xs font-bold hover:underline cursor-pointer"
                >
                  Start your first analysis &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {analyses?.slice(0, 5)?.map((run) => (
                  <div
                    key={run.id}
                    onClick={() => navigate(`/analysis/${run.id}`)}
                    className="flex items-center justify-between p-4 bg-surface-container-lowest dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-all shadow-sm border border-slate-100/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                        <span className="material-symbols-outlined">
                          analytics
                        </span>
                      </div>
                      <div>
                        <h6 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {run.job_title || `JD #${run.jd_id}`}
                        </h6>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          Resume ID: {run.resume_id} •{" "}
                          {run.created_at
                            ? new Date(run.created_at).toLocaleDateString()
                            : "Just now"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                          run.readiness_score >= 75
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-secondary"
                            : run.readiness_score >= 55
                              ? "bg-indigo-50 dark:bg-indigo-950/30 text-primary"
                              : "bg-amber-50 dark:bg-amber-950/30 text-amber-600"
                        }`}
                      >
                        {run.readiness_score}%
                      </span>
                      <span className="material-symbols-outlined text-slate-400 text-sm">
                        chevron_right
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {analysisCount > 5 && (
            <button
              onClick={() => navigate("/analysis")}
              className="mt-6 text-primary text-xs font-bold hover:underline self-start cursor-pointer"
            >
              View all analyses &rarr;
            </button>
          )}
        </div>

        {/* Right Side: Quick Action Tiles */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low dark:bg-slate-900 border border-slate-100/30 dark:border-slate-800 rounded-2xl p-6 text-left">
            <h4 className="font-headline text-md font-bold mb-4">
              Quick Operations
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/resumes")}
                className="w-full flex items-center gap-4 p-4 bg-surface-container-lowest dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-350 hover:text-primary dark:hover:text-indigo-400 rounded-xl transition-all text-left shadow-sm border border-slate-100/10 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">upload_file</span>
                </div>
                <div>
                  <h6 className="font-bold text-sm">Upload Resume</h6>
                  <p className="text-[10px] text-on-surface-variant">
                    Configure parsed AI fields
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/jobs")}
                className="w-full flex items-center gap-4 p-4 bg-surface-container-lowest dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-350 hover:text-primary dark:hover:text-indigo-400 rounded-xl transition-all text-left shadow-sm border border-slate-100/10 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <div>
                  <h6 className="font-bold text-sm">Add Job Details</h6>
                  <p className="text-[10px] text-on-surface-variant">
                    Paste roles and priorities
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Support Banner */}
          <div className="bg-primary text-on-primary rounded-2xl p-6 text-left relative overflow-hidden shadow-lg shadow-indigo-600/10">
            <h4 className="font-headline text-md font-bold mb-2">
              Curator AI Coach
            </h4>
            <p className="text-xs text-on-primary/70 leading-relaxed mb-4">
              Get detailed learning roadmaps to close your technical gaps and
              ready your applications.
            </p>
            <button
              onClick={() => navigate("/analysis")}
              className="bg-white text-primary text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm hover:scale-95 transition-transform cursor-pointer"
            >
              Analyze Now
            </button>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-15">
              <span
                className="material-symbols-outlined text-8xl"
                style={{ fontVariationSettings: "'OPSZ' 48" }}
              >
                auto_awesome
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

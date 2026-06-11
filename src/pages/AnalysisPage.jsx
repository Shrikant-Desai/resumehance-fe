import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchResumes } from "../api/resume";
import { fetchJobDescriptions } from "../api/job";
import { runAnalysis } from "../api/analysis";
import { toast } from "sonner";
import {
  Check,
  FileText,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  UserX,
} from "lucide-react";

const AnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Stepper state: 1 = Select Resume, 2 = Select Job Description, 3 = Review & Run
  const [selectedResumeId, setSelectedResumeId] = useState(
    location.state?.selectedResumeId || null,
  );
  const [selectedJobId, setSelectedJobId] = useState(
    location.state?.selectedJobId || null,
  );
  const [step, setStep] = useState(location.state?.selectedResumeId ? 2 : 1);

  // Queries
  const { data: resumes = [], isLoading: loadingResumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
  });

  const { data: jobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobDescriptions,
  });

  // Mutation: Run Match Analysis
  const runMutation = useMutation({
    mutationFn: runAnalysis,
    onSuccess: (data) => {
      toast.success("Analysis complete! Redirecting to results...");
      navigate(`/analysis/${data.id || data.analysis_id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to execute analysis. Please try again.");
    },
  });

  const selectedResume = resumes.find((r) => (r.resume_id || r.id) === selectedResumeId);
  const selectedJob = jobs.find((j) => (j.jd_id || j.id) === selectedJobId);

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedResumeId) {
        toast.error("Please select a resume to proceed.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedJobId) {
        toast.error("Please select a job description to proceed.");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleRunMatch = () => {
    if (!selectedResumeId || !selectedJobId) {
      toast.error("Analysis requires both a selected resume and job description.");
      return;
    }
    runMutation.mutate({ resume_id: selectedResumeId, jd_id: selectedJobId });
  };

  if (loadingResumes || loadingJobs) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3 mx-auto"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  const steps = [
    { label: "Select Resume", shortLabel: "Resume" },
    { label: "Select Target Role", shortLabel: "Role" },
    { label: "Run Analysis", shortLabel: "Run" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 text-left select-none relative">
      {/* Stepper Wizard Bar */}
      <section className="mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
        <div className="flex justify-between items-center relative">
          {/* Background track */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
          {/* Progress fill */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-500"
            style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
          />

          {steps.map((s, i) => {
            const stepNum = i + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isActive
                        ? "bg-primary text-white ring-4 ring-indigo-100 dark:ring-indigo-950"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center ${
                    isActive || isCompleted ? "text-primary" : "text-slate-400"
                  }`}
                >
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.shortLabel}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Execution Loader */}
      {runMutation.isPending ? (
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-100/30 dark:border-slate-800 max-w-2xl mx-auto flex flex-col items-center justify-center gap-6 shadow-sm min-h-[300px] sm:min-h-[350px]">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-slate-800 border-t-primary animate-spin" />
          <div className="space-y-2">
            <h3 className="font-headline text-xl font-bold">AI Curator Aligning Vectors...</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Vector-embedding skill lists, performing cosine similarity calculations, and
              generating your personalized learning roadmap using Gemini.
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mt-2">
            <div className="h-full bg-primary animate-pulse w-4/5 rounded-full" />
          </div>
        </section>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* STEP 1: SELECT RESUME */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight">
                  Select Target Credentials
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Choose the resume you want to match. Click on a tile to select.
                </p>
              </div>

              {resumes.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/30 dark:border-slate-800 p-6 flex flex-col items-center gap-4 shadow-sm">
                  <UserX size={40} className="text-slate-400" />
                  <div>
                    <h5 className="font-bold text-sm">No resumes uploaded yet</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      You need to upload at least one resume PDF before running a match.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/resumes")}
                    className="bg-primary-gradient text-white py-2.5 px-6 rounded-lg text-xs font-bold shadow-md cursor-pointer"
                  >
                    Go Upload Resume
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resumes.map((resume) => {
                    const rId = resume.resume_id || resume.id;
                    const isSelected = selectedResumeId === rId;
                    return (
                      <div
                        key={rId}
                        onClick={() => setSelectedResumeId(rId)}
                        className={`p-4 sm:p-5 rounded-xl cursor-pointer transition-all border-2 flex items-start gap-4 hover:scale-[1.01] ${
                          isSelected
                            ? "bg-white dark:bg-slate-800 border-primary shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {isSelected ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            <FileText size={14} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                            {resume.candidate_name || resume.file_name || resume.filename || "Resume Document"}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {resume.file_name || resume.filename || "PDF"}{" "}
                            {resume.seniority_level ? `• ${resume.seniority_level}` : ""}{" "}
                            {resume.total_experience_years != null
                              ? `• ${resume.total_experience_years}y exp`
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SELECT JOB DESCRIPTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight">
                  Select Target Position
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Choose the job description profile to evaluate compatibility against.
                </p>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/30 dark:border-slate-800 p-6 flex flex-col items-center gap-4 shadow-sm">
                  <Briefcase size={40} className="text-slate-400" />
                  <div>
                    <h5 className="font-bold text-sm">No job descriptions saved</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Save a job description before evaluating matching scores.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/jobs")}
                    className="bg-primary-gradient text-white py-2.5 px-6 rounded-lg text-xs font-bold shadow-md cursor-pointer"
                  >
                    Create Job Description
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {jobs.map((job) => {
                    const jId = job.jd_id || job.id;
                    const isSelected = selectedJobId === jId;
                    return (
                      <div
                        key={jId}
                        onClick={() => setSelectedJobId(jId)}
                        className={`p-4 sm:p-5 rounded-xl cursor-pointer transition-all border-2 flex items-start gap-4 hover:scale-[1.01] ${
                          isSelected
                            ? "bg-white dark:bg-slate-800 border-primary shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {isSelected ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            <Briefcase size={14} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                            {job.job_title || "Target Role"}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            {job.company || job.domain || "—"}
                            {job.seniority_level ? ` • ${job.seniority_level}` : ""}
                            {job.minimum_years_required != null ? ` • ${job.minimum_years_required}y min` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: REVIEW & EXECUTE */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight">
                  Review Alignment Setup
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Confirm your parameters and prompt Gemini to execute vector similarity matchmaking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Selected Resume Review */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Candidate
                  </span>
                  <h4 className="font-headline font-bold text-lg mt-1 text-indigo-700 dark:text-indigo-400">
                    {selectedResume?.candidate_name ||
                      selectedResume?.file_name ||
                      selectedResume?.filename ||
                      "Resume Document"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {selectedResume?.file_name || selectedResume?.filename || "PDF"}
                    {selectedResume?.seniority_level ? ` • ${selectedResume.seniority_level}` : ""}
                    {selectedResume?.total_experience_years != null
                      ? ` • ${selectedResume.total_experience_years}y experience`
                      : ""}
                    {selectedResume?.resume_domain ? ` • ${selectedResume.resume_domain}` : ""}
                  </p>
                </div>

                {/* Selected Job Review */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-100/10 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Job Profile
                  </span>
                  <h4 className="font-headline font-bold text-lg mt-1 text-emerald-700 dark:text-emerald-400">
                    {selectedJob?.job_title || "Job Description"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Company: {selectedJob?.company || "—"} <br />
                    {selectedJob?.domain ? `Domain: ${selectedJob.domain}` : ""}
                    {selectedJob?.seniority_level ? ` • ${selectedJob.seniority_level}` : ""}
                    {selectedJob?.minimum_years_required != null
                      ? ` • ${selectedJob.minimum_years_required}+ yrs required`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation Actions */}
          <div className="mt-10 sm:mt-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-4">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer text-xs transition-colors"
            >
              <ChevronLeft size={14} />
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                className="bg-primary-gradient px-6 sm:px-8 py-2.5 rounded-lg text-white font-bold flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-md cursor-pointer text-xs"
              >
                <span>Next Step</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleRunMatch}
                className="bg-emerald-600 px-6 sm:px-8 py-2.5 rounded-lg text-white font-bold flex items-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/10 cursor-pointer text-xs"
              >
                <span>Run Match Analysis</span>
                <CheckCircle2 size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;

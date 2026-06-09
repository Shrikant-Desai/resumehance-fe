import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchResumes } from "../api/resume";
import { fetchJobDescriptions } from "../api/job";
import { runAnalysis } from "../api/analysis";
import { toast } from "sonner";

const AnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Stepper state: 1 = Select Resume, 2 = Select Job Description, 3 = Review & Run
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.selectedResumeId || null);
  const [selectedJobId, setSelectedJobId] = useState(location.state?.selectedJobId || null);
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
      // data is the unwrapped AnalysisRunResponse from the backend envelope
      toast.success("Analysis complete! Redirecting to results...");
      navigate(`/analysis/${data.id || data.analysis_id}`);
    },
    onError: (err) => {
      // err is the normalized error: { message, code, details, status }
      toast.error(
        err.message || "Failed to execute analysis. Please try again.",
      );
    },
  });

  const selectedResume = resumes.find(
    (r) => (r.id || r.resume_id) === selectedResumeId,
  );
  const selectedJob = jobs.find((j) => (j.id || j.jd_id) === selectedJobId);

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
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRunMatch = () => {
    if (!selectedResumeId || !selectedJobId) {
      toast.error(
        "Analysis requires both a selected resume and job description.",
      );
      return;
    }
    runMutation.mutate({
      resume_id: selectedResumeId,
      jd_id: selectedJobId,
    });
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

  return (
    <div className="space-y-10 text-left select-none relative">
      {/* Stepper Wizard Bar */}
      <section className="mb-12 max-w-4xl mx-auto">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest dark:bg-slate-800 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
          ></div>

          {/* Step 1 Node */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step > 1
                  ? "bg-primary text-white"
                  : step === 1
                    ? "bg-primary text-white ring-4 ring-primary-fixed"
                    : "bg-surface-container-highest text-on-surface-variant"
              }`}
            >
              {step > 1 ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                "1"
              )}
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                step >= 1 ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              Select Resume
            </span>
          </div>

          {/* Step 2 Node */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step > 2
                  ? "bg-primary text-white"
                  : step === 2
                    ? "bg-primary text-white ring-4 ring-primary-fixed"
                    : "bg-surface-container-highest dark:bg-slate-800 text-on-surface-variant"
              }`}
            >
              {step > 2 ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                "2"
              )}
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                step >= 2 ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              Select Target Role
            </span>
          </div>

          {/* Step 3 Node */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step === 3
                  ? "bg-primary text-white ring-4 ring-primary-fixed"
                  : "bg-surface-container-highest dark:bg-slate-800 text-on-surface-variant"
              }`}
            >
              3
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                step === 3 ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              Run Analysis
            </span>
          </div>
        </div>
      </section>

      {/* Main Execution Loader */}
      {runMutation.isPending ? (
        <section className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100/30 dark:border-slate-800 max-w-2xl mx-auto flex flex-col items-center justify-center gap-6 shadow-sm min-h-[350px]">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-150 border-t-primary animate-spin"></div>
          <div className="space-y-2">
            <h3 className="font-headline text-xl font-bold">
              AI Curator Aligning Vectors...
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Vector-embedding skill lists, performing cosine similarity
              calculations, and generating your personalized learning roadmap
              using Gemini.
            </p>
          </div>
          <div className="w-full bg-surface-container-highest dark:bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mt-2">
            <div className="h-full bg-primary animate-pulse w-4/5 rounded-full"></div>
          </div>
        </section>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* STEP 1: SELECT RESUME */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-2xl font-extrabold tracking-tight">
                  Select Target Credentials
                </h3>
                <p className="text-on-surface-variant text-xs mt-1">
                  Choose the resume you want to match. Click on a tile to
                  select.
                </p>
              </div>

              {resumes.length === 0 ? (
                <div className="text-center py-16 bg-surface-container-low dark:bg-slate-900 rounded-2xl border border-slate-100/30 p-6 flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-4xl text-slate-400">
                    contact_page
                  </span>
                  <div>
                    <h5 className="font-bold text-sm">
                      No resumes uploaded yet
                    </h5>
                    <p className="text-xs text-on-surface-variant mt-1">
                      You need to upload at least one resume PDF before running
                      a match.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumes.map((resume) => {
                    const rId = resume.id || resume.resume_id;
                    const isSelected = selectedResumeId === rId;
                    return (
                      <div
                        key={rId}
                        onClick={() => setSelectedResumeId(rId)}
                        className={`p-5 rounded-xl cursor-pointer transition-all border-2 flex items-start gap-4 hover:scale-[1.01] ${
                          isSelected
                            ? "bg-white dark:bg-slate-850 border-primary shadow-sm"
                            : "bg-surface-container-low dark:bg-slate-900 border-transparent hover:bg-white dark:hover:bg-slate-850"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-surface-container-highest dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isSelected ? "check" : "description"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                            {resume.filename || "Resume Document"}
                          </h4>
                          <p className="text-[10px] text-on-surface-variant mt-1">
                            Skills:{" "}
                            {(
                              resume.parsed_resume?.skills ||
                              resume.skills ||
                              []
                            )
                              .slice(0, 4)
                              .join(", ")}
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
                <h3 className="font-headline text-2xl font-extrabold tracking-tight">
                  Select Target Position
                </h3>
                <p className="text-on-surface-variant text-xs mt-1">
                  Choose the job description profile to evaluate compatibility
                  against.
                </p>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-16 bg-surface-container-low dark:bg-slate-900 rounded-2xl border border-slate-100/30 p-6 flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-4xl text-slate-400">
                    work
                  </span>
                  <div>
                    <h5 className="font-bold text-sm">
                      No job descriptions saved
                    </h5>
                    <p className="text-xs text-on-surface-variant mt-1">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => {
                    const jId = job.id || job.jd_id;
                    const isSelected = selectedJobId === jId;
                    return (
                      <div
                        key={jId}
                        onClick={() => setSelectedJobId(jId)}
                        className={`p-5 rounded-xl cursor-pointer transition-all border-2 flex items-start gap-4 hover:scale-[1.01] ${
                          isSelected
                            ? "bg-white dark:bg-slate-850 border-primary shadow-sm"
                            : "bg-surface-container-low dark:bg-slate-900 border-transparent hover:bg-white dark:hover:bg-slate-850"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-surface-container-highest dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isSelected ? "check" : "work"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                            {job.job_title || "Target Role"}
                          </h4>
                          <p className="text-[10px] text-on-surface-variant mt-1">
                            {job.company || "Acme Corp"} • Extracted Skills:{" "}
                            {(
                              job.parsed_job?.required_skills ||
                              job.required_skills ||
                              []
                            )
                              .slice(0, 3)
                              .join(", ")}
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
                <h3 className="font-headline text-2xl font-extrabold tracking-tight">
                  Review Alignment Setup
                </h3>
                <p className="text-on-surface-variant text-xs mt-1">
                  Confirm your parameters and prompt Gemini to execute vector
                  similarity matchmaking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selected Resume Review */}
                <div className="bg-surface-container-low dark:bg-slate-900 rounded-xl p-6 border border-slate-100/10">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Candidate
                  </span>
                  <h4 className="font-headline font-bold text-lg mt-1 text-indigo-700 dark:text-indigo-400">
                    {selectedResume?.parsed_resume?.name ||
                      selectedResume?.filename ||
                      "Resume Document"}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    Skills:{" "}
                    {(
                      selectedResume?.parsed_resume?.skills ||
                      selectedResume?.skills ||
                      []
                    )
                      .slice(0, 5)
                      .join(", ")}
                  </p>
                </div>

                {/* Selected Job Review */}
                <div className="bg-surface-container-low dark:bg-slate-900 rounded-xl p-6 border border-slate-100/10">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Job profile
                  </span>
                  <h4 className="font-headline font-bold text-lg mt-1 text-emerald-700 dark:text-emerald-400">
                    {selectedJob?.job_title || "Job Description"}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    Company: {selectedJob?.company || "Acme Inc."} <br />
                    Required Skills:{" "}
                    {(
                      selectedJob?.parsed_job?.required_skills ||
                      selectedJob?.required_skills ||
                      []
                    )
                      .slice(0, 5)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Bottom Navigation Actions */}
          <div className="mt-12 glass-panel rounded-2xl p-4 shadow-xl border border-white/20 flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className="px-6 py-2.5 rounded-lg text-slate-700 dark:text-slate-350 font-bold hover:bg-slate-200/50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer text-xs"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                className="bg-primary-gradient px-8 py-2.5 rounded-lg text-white font-bold flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-md cursor-pointer text-xs"
              >
                <span>Next Step</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            ) : (
              <button
                onClick={handleRunMatch}
                className="bg-emerald-600 px-8 py-2.5 rounded-lg text-white font-bold flex items-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/10 cursor-pointer text-xs"
              >
                <span>Run Match Analysis</span>
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;

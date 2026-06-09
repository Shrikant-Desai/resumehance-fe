import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobDescriptions, createJobDescription } from "../api/job";
import { toast } from "sonner";

const JobsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jdText, setJdText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobDescriptions,
    onSuccess: (data) => {
      if (data.length > 0 && !selectedJobId) {
        setSelectedJobId(data[0].id || data[0].jd_id);
      }
    }
  });

  // Mutation: Create JD
  const createMutation = useMutation({
    mutationFn: createJobDescription,
    onSuccess: (data) => {
      // data is the unwrapped job description object from the backend envelope
      toast.success("Job description parsed successfully!");
      queryClient.invalidateQueries(["jobs"]);
      setSelectedJobId(data.id || data.jd_id);
      setJobTitle("");
      setCompany("");
      setJdText("");
    },
    onError: (err) => {
      // err is the normalized error: { message, code, details, status }
      toast.error(err.message || "Failed to parse job description. Please try again.");
    }
  });

  // Selected JD derivation
  const selectedJob = jobs.find(
    (j) => j.id === selectedJobId || j.jd_id === selectedJobId
  ) || jobs[0];

  if (jobs.length > 0 && !selectedJobId) {
    setSelectedJobId(jobs[0].id || jobs[0].jd_id);
  }

  // Filter JDs by search term
  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    const title = (job.job_title || "").toLowerCase();
    const comp = (job.company || "").toLowerCase();
    const text = (job.jd_text || "").toLowerCase();
    return title.includes(term) || comp.includes(term) || text.includes(term);
  });

  // Form Submit Handler
  const handleParse = (e) => {
    e.preventDefault();
    if (!jdText.trim()) {
      toast.error("Please enter the job description text.");
      return;
    }
    toast.info("AI is parsing the job description... this might take 10 seconds.");
    createMutation.mutate({
      jd_text: jdText,
      job_title: jobTitle,
      company: company,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div className="lg:col-span-7 h-[550px] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Fallbacks for Parsed Job schema
  const parsedJob = selectedJob?.parsed_job || selectedJob || {};
  const requiredSkills = parsedJob.required_skills || parsedJob.skills || ["React", "Node.js", "System Design"];
  const responsibilities = parsedJob.key_responsibilities || parsedJob.responsibilities || [];
  const keywordTags = parsedJob.keyword_tags || parsedJob.extractions || ["#ProductStrategy", "#SystemsThinking"];

  return (
    <div className="space-y-10 text-left select-none">
      {/* Search and Layout Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight">Job Descriptions</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            Store and extract insights from your targeted job requirements.
          </p>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-xs w-64 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 outline-none transition-all dark:text-slate-200"
            placeholder="Search saved job profiles..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Main Split Layout: Submit Form & Details Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Intake Form & List */}
        <div className="lg:col-span-5 space-y-8">
          {/* Create Form Container */}
          <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800">
            <h4 className="font-headline text-lg font-bold mb-4">Add Job Details</h4>
            <form onSubmit={handleParse} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Designer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-container-lowest dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2 bg-surface-container-lowest dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Job Description Text
                </label>
                <textarea
                  placeholder="Paste details of responsibilities and core skills needed..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full min-h-[160px] max-h-[220px] px-4 py-3 bg-surface-container-lowest dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 resize-none dark:text-slate-200"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-primary-gradient text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    Parse with AI
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Job Library Directory */}
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-sm mb-2">Job Library ({filteredJobs.length})</h4>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8 bg-surface-container-low dark:bg-slate-900 rounded-2xl">
                  <span className="material-symbols-outlined text-2xl text-slate-400">work</span>
                  <p className="text-xs text-on-surface-variant mt-2">No matching job profiles found.</p>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const jId = job.id || job.jd_id;
                  const isSelected = selectedJobId === jId;
                  return (
                    <div
                      key={jId}
                      onClick={() => setSelectedJobId(jId)}
                      className={`p-4 rounded-xl transition-all cursor-pointer flex justify-between items-center ${
                        isSelected
                          ? "bg-white dark:bg-slate-850 shadow-sm border-l-4 border-primary"
                          : "bg-surface-container-low dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-850"
                      }`}
                    >
                      <div>
                        <h6 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {job.job_title || "Lead Developer"}
                        </h6>
                        <p className="text-[10px] text-on-surface-variant mt-1">
                          {job.company || "Acme Inc."} • Created {job.created_at ? new Date(job.created_at).toLocaleDateString() : "Just now"}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Extraction Details Canvas */}
        <div className="lg:col-span-7 bg-surface-container-lowest dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[500px] flex flex-col justify-between">
          {!selectedJob ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-20 gap-4">
              <span className="material-symbols-outlined text-5xl text-slate-350">assignment_turned_in</span>
              <div>
                <h4 className="font-headline text-md font-bold text-slate-600 dark:text-slate-400">
                  Select a job description to inspect details
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Paste raw requirements on the left to extract parsed parameters using Google Gemini AI.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Header section */}
              <div className="flex justify-between items-start pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                    Curated Profile
                  </span>
                  <h3 className="font-headline text-2xl font-extrabold tracking-tight mt-1 text-slate-800 dark:text-slate-200">
                    {selectedJob.job_title || "Lead Developer"}
                  </h3>
                  <p className="text-on-surface-variant text-xs font-semibold mt-1">
                    {selectedJob.company || "Acme Corporation"}
                  </p>
                </div>
                
                <button
                  onClick={() => navigate("/analysis", { state: { selectedJobId } })}
                  className="bg-primary-gradient text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform cursor-pointer"
                >
                  Match to Resume
                </button>
              </div>

              {/* Grid sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Core required skills */}
                <div className="bg-surface-container-low dark:bg-slate-850 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                      Required Skills
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-lg ring-1 ring-slate-100/50 dark:ring-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Extraction Tags */}
                <div className="bg-surface-container-low dark:bg-slate-850 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-tertiary font-semibold">
                    <span className="material-symbols-outlined text-sm">key</span>
                    <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                      Extractions Keywords
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {keywordTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold rounded-lg"
                      >
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities list */}
                <div className="md:col-span-2 bg-surface-container-low dark:bg-slate-850 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-secondary font-semibold">
                    <span className="material-symbols-outlined text-sm">assignment</span>
                    <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                      Key Responsibilities
                    </h5>
                  </div>
                  {responsibilities.length === 0 ? (
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {selectedJob.jd_text || "No specific responsibility details parsed."}
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {responsibilities.map((resp, index) => (
                        <li key={index} className="flex gap-3 items-start">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                          <p className="text-xs text-on-surface-variant leading-relaxed">{resp}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default JobsPage;

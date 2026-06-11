import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobDescriptions, createJobDescription } from "../api/job";
import { toast } from "sonner";
import {
  Search,
  Brain,
  Tag,
  ClipboardList,
  Briefcase,
  ClipboardCheck,
  ChevronRight,
} from "lucide-react";

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
  });

  // Auto-select first job when data loads
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].jd_id || jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  // Mutation: Create JD
  const createMutation = useMutation({
    mutationFn: createJobDescription,
    onSuccess: (data) => {
      toast.success("Job description parsed successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setSelectedJobId(data.jd_id || data.id);
      setJobTitle("");
      setCompany("");
      setJdText("");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to parse job description. Please try again.");
    },
  });

  // Selected JD derivation
  const selectedJob =
    jobs.find((j) => j.jd_id === selectedJobId || j.id === selectedJobId) || jobs[0];

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div className="lg:col-span-7 h-[400px] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Fallbacks for Parsed Job schema
  // List endpoint: { jd_id, job_title, company, domain, seniority_level, minimum_years_required, created_at }
  // Create response: { jd_id, parsed_data: { job_title, company, domain, required_skills, good_to_have_skills, key_responsibilities, ... } }
  const parsedJob = selectedJob?.parsed_data || {};
  // required_skills may be an object with sub-categories or fallback to flat array
  const requiredSkillsObj = parsedJob.required_skills || {};
  const requiredSkillsFlat = typeof requiredSkillsObj === "object" && !Array.isArray(requiredSkillsObj)
    ? [
        ...(requiredSkillsObj.technical_skills || []),
        ...(requiredSkillsObj.frameworks || []),
        ...(requiredSkillsObj.programming_languages || []),
        ...(requiredSkillsObj.tools_and_technologies || []),
      ]
    : (Array.isArray(requiredSkillsObj) ? requiredSkillsObj : []);
  const responsibilities = parsedJob.key_responsibilities || [];
  // Use skill_priority_map keys as keyword tags if available
  const priorityMap = parsedJob.skill_priority_map || {};
  const keywordTags = Object.keys(priorityMap);

  return (
    <div className="space-y-8 sm:space-y-10 text-left select-none">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight">
            Job Descriptions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Store and extract insights from your targeted job requirements.
          </p>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            className="w-full sm:w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-primary/20 dark:text-slate-200 outline-none transition-all"
            placeholder="Search saved job profiles..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search job descriptions"
          />
        </div>
      </section>

      {/* Main Split Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: Intake Form & List */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          {/* Create Form Container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-100/30 dark:border-slate-800 shadow-sm">
            <h4 className="font-headline text-lg font-bold mb-4">Add Job Details</h4>
            <form onSubmit={handleParse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Designer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200 transition-all"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200 transition-all"
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
                  className="w-full min-h-[140px] sm:min-h-[160px] max-h-[220px] px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 resize-none dark:text-slate-200 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-primary-gradient text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <Brain size={14} />
                    Parse with AI
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Job Library Directory */}
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-sm mb-2">
              Job Library ({filteredJobs.length})
            </h4>
            <div className="space-y-3 max-h-[280px] sm:max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/30 dark:border-slate-800">
                  <Briefcase size={24} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    No matching job profiles found.
                  </p>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const jId = job.jd_id || job.id;
                  const isSelected = selectedJobId === jId;
                  return (
                    <div
                      key={jId}
                      onClick={() => setSelectedJobId(jId)}
                      className={`p-4 rounded-xl transition-all cursor-pointer flex justify-between items-center gap-2 ${
                        isSelected
                          ? "bg-white dark:bg-slate-800 shadow-sm border-l-4 border-primary border border-slate-100/10"
                          : "bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 border border-transparent"
                      }`}
                    >
                      <div className="min-w-0">
                        <h6 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                          {job.job_title || "Lead Developer"}
                        </h6>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          {job.company || job.domain || "—"} •{" "}
                          {job.created_at
                            ? new Date(job.created_at).toLocaleDateString()
                            : "Just now"}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Extraction Details Canvas */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[400px] sm:min-h-[500px] flex flex-col justify-between">
          {!selectedJob ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-16 gap-4">
              <ClipboardCheck size={48} className="text-slate-300 dark:text-slate-600" />
              <div>
                <h4 className="font-headline text-base font-bold text-slate-600 dark:text-slate-400">
                  Select a job description to inspect details
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Paste raw requirements on the left to extract parsed parameters using Google Gemini AI.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                    Curated Profile
                  </span>
                  <h3 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-slate-800 dark:text-slate-200">
                    {selectedJob.job_title || parsedJob.job_title || "Lead Developer"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
                    {selectedJob.company || parsedJob.company || "—"}{selectedJob.domain ? ` • ${selectedJob.domain}` : ""}
                  </p>
                  {selectedJob.seniority_level && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-primary text-[9px] font-bold rounded-full uppercase tracking-wider">
                        {selectedJob.seniority_level}
                      </span>
                      {selectedJob.minimum_years_required != null && (
                        <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 text-[9px] font-bold rounded-full uppercase tracking-wider">
                          {selectedJob.minimum_years_required}+ yrs required
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate("/analysis", { state: { selectedJobId } })}
                  className="bg-primary-gradient text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform cursor-pointer shrink-0"
                >
                  Match to Resume
                </button>
              </div>

              {/* Grid sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                {/* Core required skills */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Brain size={14} />
                    <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                      Required Skills
                    </h5>
                  </div>
                  {requiredSkillsFlat.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Skills data available after AI parsing. Use the form on the left to create a new JD.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {requiredSkillsFlat.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Key Extraction Tags */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                    <Tag size={14} />
                    <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                      Skill Priority Map
                    </h5>
                  </div>
                  {keywordTags.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Priority map available after AI parsing.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {keywordTags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                            priorityMap[tag] === "critical"
                              ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                              : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {tag}{" "}
                          <span className="opacity-60 font-normal text-[9px] uppercase">{priorityMap[tag]}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Responsibilities list */}
                <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-secondary font-semibold">
                    <ClipboardList size={14} />
                    <h5 className="text-xs uppercase tracking-widest font-bold text-slate-400">
                      Key Responsibilities
                    </h5>
                  </div>
                  {responsibilities.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Responsibilities available after AI parsing. Use the form to create a new job description.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {responsibilities.map((resp, index) => (
                        <li key={index} className="flex gap-3 items-start">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {resp}
                          </p>
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

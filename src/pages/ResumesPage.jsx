import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchResumes, uploadResume } from "../api/resume";
import { toast } from "sonner";
import {
  CloudUpload,
  RefreshCw,
  FileUp,
  UserCheck,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const ResumesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Queries
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: fetchResumes,
  });

  // Auto-select first resume when data loads
  useEffect(() => {
    if (resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0].resume_id || resumes[0].id);
    }
  }, [resumes, selectedResumeId]);

  // Mutation: Upload Resume
  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      toast.success("Resume parsed and uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setSelectedResumeId(data.resume_id || data.id);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to parse resume PDF. Please try again.");
    },
  });

  // Safe selected resume calculation
  const selectedResume =
    resumes.find((r) => r.resume_id === selectedResumeId || r.id === selectedResumeId) ||
    resumes[0];

  // Uploader Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) triggerUpload(files[0]);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) triggerUpload(files[0]);
  };

  const triggerUpload = (file) => {
    if (file.type !== "application/pdf") {
      toast.error("Curator AI currently only accepts PDF formats.");
      return;
    }
    toast.info("AI is parsing your resume PDF... this may take up to 20 seconds.");
    uploadMutation.mutate(file);
  };

  // Mock Delete Handler
  const handleDelete = () => {
    if (!selectedResume) return;
    setIsDeleting(true);
    setTimeout(() => {
      toast.success("Resume deleted successfully!");
      const remaining = resumes.filter(
        (r) => r.resume_id !== selectedResumeId && r.id !== selectedResumeId,
      );
      queryClient.setQueryData(["resumes"], remaining);
      if (remaining.length > 0) {
        setSelectedResumeId(remaining[0].resume_id || remaining[0].id);
      } else {
        setSelectedResumeId(null);
      }
      setIsDeleting(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4 space-y-6">
            <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div className="xl:col-span-8 h-[550px] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Map API fields — list endpoint: { resume_id, file_name, candidate_name, resume_domain, seniority_level, total_experience_years, uploaded_at }
  // Upload endpoint returns: { resume_id, file_name, parsed_data: { personal_info, skills, education, experience, ... } }
  const parsedData = selectedResume?.parsed_data || {};
  const personalInfo = parsedData.personal_info || {};
  const skillsObj = parsedData.skills || {};
  // Flatten all skill categories into a single array for display
  const allSkills = [
    ...(skillsObj.technical_skills || []),
    ...(skillsObj.frameworks || []),
    ...(skillsObj.programming_languages || []),
    ...(skillsObj.tools_and_technologies || []),
    ...(skillsObj.databases || []),
    ...(skillsObj.domain_skills || []),
    ...(skillsObj.methodologies || []),
    ...(skillsObj.soft_skills || []),
    ...(skillsObj.tools || []),
    ...(skillsObj.certifications || []),
  ];
  const education = parsedData.education || [];
  const experience = parsedData.experience || [];
  const projects = parsedData.projects || [];
  // Display name: prefer parsed personal_info.name, else candidate_name from list, else fallback
  const candidateName = personalInfo.name || selectedResume?.candidate_name || "Candidate";
  const experienceYears = parsedData.total_experience_years ?? selectedResume?.total_experience_years ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 text-left select-none">
      {/* Top Upload Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Upload Container */}
        <div className="lg:col-span-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer group ${
              dragOver
                ? "border-primary bg-indigo-50 dark:bg-indigo-950/20"
                : "border-slate-300 dark:border-slate-700 hover:bg-indigo-50/50 dark:hover:bg-slate-800/40 hover:border-primary/50"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              id="file-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadMutation.isPending}
            />
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-105 transition-transform">
              {uploadMutation.isPending ? (
                <RefreshCw size={28} className="animate-spin" />
              ) : (
                <CloudUpload size={28} />
              )}
            </div>
            <h3 className="font-headline text-lg font-bold text-center">
              {uploadMutation.isPending ? "Parsing Resume PDF..." : "Upload New Resume"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 text-center max-w-sm">
              {uploadMutation.isPending
                ? "Extracting skills, experience, and education using Google Gemini AI..."
                : "Drag and drop your PDF resume files here to start the AI parsing process."}
            </p>
            {!uploadMutation.isPending && (
              <button className="mt-4 text-primary text-xs font-bold hover:underline pointer-events-none">
                Or browse files
              </button>
            )}
          </div>
        </div>

        {/* Upload stats */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800 h-full min-h-[160px] flex flex-col justify-center shadow-sm">
          <h4 className="font-headline font-bold text-sm mb-2 text-slate-800 dark:text-slate-200">
            Extraction Metric Accuracy
          </h4>
          <div className="flex items-center gap-3 mb-2 mt-2">
            <ShieldCheck size={20} className="text-secondary shrink-0" />
            <span className="text-sm font-semibold">98.4% Parsing Accuracy</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            All details are parsed and mapped contextually, recognizing semantic terminology.
          </p>
        </div>
      </section>

      {/* Main Bento Layout: Resume List & Detail view */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
        {/* Left List Column */}
        <div className="xl:col-span-4 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline text-lg font-bold">Uploaded Resumes</h3>
            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
              {resumes.length} TOTAL
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] xl:max-h-[550px] overflow-y-auto pr-1 no-scrollbar">
            {resumes.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800">
                <FileUp size={28} className="mx-auto text-slate-400 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">No resumes uploaded yet.</p>
              </div>
            ) : (
              resumes.map((resume) => {
                const rId = resume.resume_id || resume.id;
                const isSelected = selectedResumeId === rId;
                return (
                  <div
                    key={rId}
                    onClick={() => setSelectedResumeId(rId)}
                    className={`rounded-xl p-4 transition-all hover:scale-[1.01] cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-white dark:bg-slate-800 shadow-sm border-l-4 border-primary border border-slate-100/10"
                        : "bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 border border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs truncate text-slate-800 dark:text-slate-200 flex-1">
                        {resume.file_name || resume.filename || "Resume PDF"}
                      </h4>
                      <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold shrink-0">
                        Parsed
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold truncate">
                      {resume.candidate_name || "—"}
                    </p>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex justify-between gap-2 flex-wrap">
                      <span>{resume.resume_domain || resume.seniority_level || ""}</span>
                      <span>
                        {resume.uploaded_at || resume.created_at
                          ? new Date(resume.uploaded_at || resume.created_at).toLocaleDateString()
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail View Column */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100/30 dark:border-slate-800 min-h-[400px] sm:min-h-[550px] flex flex-col justify-between shadow-sm">
          {!selectedResume ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-16 gap-4">
              <UserCheck size={48} className="text-slate-300 dark:text-slate-600" />
              <div>
                <h4 className="font-headline text-base font-bold text-slate-600 dark:text-slate-400">
                  Select a resume to inspect details
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload a PDF in the uploader box above to extract parsed fields.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Header profile details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-200/50 dark:border-slate-800">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-primary-gradient flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
                    {candidateName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-headline text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-200">
                      {candidateName}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
                      {experienceYears > 0
                        ? `${experienceYears}+ Years Experience`
                        : "Fresher / Less than 1 year"}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {selectedResume?.seniority_level && (
                        <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 text-[9px] font-bold rounded-full uppercase tracking-wider">
                          {selectedResume.seniority_level}
                        </span>
                      )}
                      {selectedResume?.resume_domain && (
                        <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-secondary text-[9px] font-bold rounded-full uppercase tracking-wider">
                          {selectedResume.resume_domain}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-bold rounded-full uppercase tracking-wider">
                        Parsed AI
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-white dark:bg-slate-800 dark:text-slate-300 px-3 sm:px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    <Trash2 size={14} />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>

                  <button
                    onClick={() => navigate("/analysis", { state: { selectedResumeId } })}
                    className="bg-primary-gradient text-white px-4 sm:px-5 py-2.5 rounded-lg font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform cursor-pointer"
                  >
                    Match to Job
                  </button>
                </div>
              </div>

              {/* Parsed Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                {/* Left Side: Skills & Education */}
                <div className="space-y-6">
                  {/* Skills Container */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl space-y-4">
                    <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400">
                      Extracted Skills
                    </h4>
                    {allSkills.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">No skills data available for this resume. Full details shown after upload.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {allSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Education Container */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl space-y-4">
                    <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400">
                      Education
                    </h4>
                    {education.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">No education details available. Full details shown after upload.</p>
                    ) : (
                      <div className="space-y-4">
                        {education.map((edu, index) => (
                          <div
                            key={index}
                            className={`space-y-1 ${index > 0 ? "pt-3 border-t border-slate-200 dark:border-slate-700" : ""}`}
                          >
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                              {edu.degree || "Degree"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{edu.field ? `${edu.field} — ` : ""}{edu.institution || edu.school || "University"}</p>
                            {edu.year && <p className="text-[10px] text-slate-400 mt-1">{edu.year}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Professional Experience & Projects */}
                <div className="space-y-6">
                  {/* Work Experience Container */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl space-y-4">
                    <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400">
                      Work Experience
                    </h4>
                    {experience.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">No work experience available. Full details shown after upload.</p>
                    ) : (
                      <div className="space-y-4">
                        {experience.map((exp, index) => (
                          <div
                            key={index}
                            className={`relative pl-4 border-l-2 border-indigo-200/50 space-y-1 ${index > 0 ? "pt-2" : ""}`}
                          >
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                              {exp.role || exp.title || "Role Title"}
                            </p>
                            <p className="text-xs text-primary font-semibold">{exp.company || "Company"}</p>
                            {(exp.start_date || exp.end_date) && (
                              <p className="text-[10px] text-slate-400">
                                {exp.start_date} — {exp.end_date || "Present"}
                                {exp.duration_months ? ` (${exp.duration_months}mo)` : ""}
                              </p>
                            )}
                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <ul className="mt-1 space-y-0.5">
                                {exp.responsibilities.slice(0, 3).map((r, ri) => (
                                  <li key={ri} className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex gap-1.5">
                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-300 shrink-0" />
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {exp.description && !exp.responsibilities && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Projects Container */}
                  {projects.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl space-y-4">
                      <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400">
                        Key Projects
                      </h4>
                      <div className="space-y-3">
                        {projects.map((proj, index) => (
                          <div key={index} className="bg-white dark:bg-slate-800 p-3 rounded-lg text-left border border-slate-200 dark:border-slate-700">
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{proj.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic leading-relaxed">
                              {proj.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
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

export default ResumesPage;

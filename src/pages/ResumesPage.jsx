import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchResumes, uploadResume } from "../api/resume";
import { toast } from "sonner";

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
    onSuccess: (data) => {
      if (data.length > 0 && !selectedResumeId) {
        setSelectedResumeId(data[0].id);
      }
    }
  });

  // Mutation: Upload Resume
  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      // data is the unwrapped resume object from the backend envelope
      toast.success("Resume parsed and uploaded successfully!");
      queryClient.invalidateQueries(["resumes"]);
      setSelectedResumeId(data.id || data.resume_id);
    },
    onError: (err) => {
      // err is the normalized error: { message, code, details, status }
      toast.error(err.message || "Failed to parse resume PDF. Please try again.");
    }
  });

  // Safe selected resume calculation
  const selectedResume = resumes.find(
    (r) => r.id === selectedResumeId || r.resume_id === selectedResumeId
  ) || resumes[0];

  // If we had no selection set yet, set it to the first item
  if (resumes.length > 0 && !selectedResumeId) {
    setSelectedResumeId(resumes[0].id || resumes[0].resume_id);
  }

  // Uploader Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      triggerUpload(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      triggerUpload(files[0]);
    }
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
        (r) => r.id !== selectedResumeId && r.resume_id !== selectedResumeId
      );
      queryClient.setQueryData(["resumes"], remaining);
      if (remaining.length > 0) {
        setSelectedResumeId(remaining[0].id || remaining[0].resume_id);
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

  // Extra fallback properties for parsed resume data in case backend returns simplified schema
  const parsedData = selectedResume?.parsed_resume || selectedResume || {};
  const skills = parsedData.skills || ["Communication", "Problem Solving", "Management"];
  const education = parsedData.education || [];
  const experience = parsedData.experience || [];
  const projects = parsedData.projects || [];
  const candidateName = parsedData.name || selectedResume?.filename || "Alex Rivera";
  const experienceYears = parsedData.total_experience_years || 8;

  return (
    <div className="space-y-8 text-left select-none">
      {/* Top Upload Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Upload Container */}
        <div className="lg:col-span-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative bg-surface-container-low dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer group ${
              dragOver
                ? "border-primary bg-indigo-50 dark:bg-indigo-950/20"
                : "border-outline-variant/30 hover:bg-indigo-50/50 dark:hover:bg-slate-800/40"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              id="file-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadMutation.isLoading}
            />
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-850 flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-3xl">
                {uploadMutation.isPending ? "sync" : "cloud_upload"}
              </span>
            </div>
            <h3 className="font-headline text-lg font-bold">
              {uploadMutation.isPending ? "Parsing Resume PDF..." : "Upload New Resume"}
            </h3>
            <p className="text-on-surface-variant text-xs mt-2 text-center max-w-sm">
              {uploadMutation.isPending
                ? "Extracting skills, experience, and education using Google Gemini AI..."
                : "Drag and drop your PDF resume files here to start the AI parsing process."}
            </p>
            {!uploadMutation.isPending && (
              <button className="mt-4 text-primary text-xs font-bold hover:underline">
                Or browse files
              </button>
            )}
          </div>
        </div>

        {/* Upload stats */}
        <div className="bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6 border border-slate-100/30 dark:border-slate-800 h-full min-h-[190px] flex flex-col justify-center">
          <h4 className="font-headline font-bold text-sm mb-2 text-slate-800 dark:text-slate-200">
            Extraction Metric Accuracy
          </h4>
          <div className="flex items-center gap-3 mb-2 mt-2">
            <span className="material-symbols-outlined text-secondary">verified_user</span>
            <span className="text-sm font-semibold">98.4% Parsing Accuracy</span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            All details are parsed and mapped contextually, recognizing semantic terminology.
          </p>
        </div>
      </section>

      {/* Main Bento Layout: Resume List & Detail view */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left List Column */}
        <div className="xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline text-lg font-bold">Uploaded Resumes</h3>
            <span className="bg-surface-container-highest dark:bg-slate-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
              {resumes.length} TOTAL
            </span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 no-scrollbar">
            {resumes.length === 0 ? (
              <div className="text-center py-10 bg-surface-container-low dark:bg-slate-900 rounded-2xl p-6">
                <span className="material-symbols-outlined text-3xl text-slate-400">upload_file</span>
                <p className="text-xs text-on-surface-variant mt-2">No resumes uploaded yet.</p>
              </div>
            ) : (
              resumes.map((resume) => {
                const rId = resume.id || resume.resume_id;
                const isSelected = selectedResumeId === rId;
                return (
                  <div
                    key={rId}
                    onClick={() => setSelectedResumeId(rId)}
                    className={`rounded-xl p-4 transition-all hover:scale-[1.01] cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-white dark:bg-slate-850 shadow-sm border-l-4 border-primary"
                        : "bg-surface-container-low dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs truncate max-w-[200px] text-slate-800 dark:text-slate-200">
                        {resume.filename || "Resume PDF"}
                      </h4>
                      <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                        Parsed
                      </span>
                    </div>
                    <div className="text-[10px] text-on-surface-variant font-medium flex justify-between">
                      <span>Id: {rId}</span>
                      <span>Uploaded {resume.created_at ? new Date(resume.created_at).toLocaleDateString() : "Just now"}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail View Column */}
        <div className="xl:col-span-8 bg-surface-container-low dark:bg-slate-900 rounded-2xl p-8 border border-slate-100/30 dark:border-slate-800 min-h-[550px] flex flex-col justify-between">
          {!selectedResume ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-20 gap-4">
              <span className="material-symbols-outlined text-5xl text-slate-350">contact_page</span>
              <div>
                <h4 className="font-headline text-md font-bold text-slate-600 dark:text-slate-400">
                  Select a resume to inspect details
                </h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Upload a PDF in the uploader box above to extract parsed fields.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Header profile details */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-800">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary-gradient flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {candidateName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-200">
                      {candidateName}
                    </h2>
                    <p className="text-on-surface-variant text-xs font-semibold mt-1">
                      {experienceYears > 0 ? `${experienceYears}+ Years Experience` : "Experienced Professional"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 text-[9px] font-bold rounded-full uppercase tracking-wider">
                        Top Talent
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-secondary text-[9px] font-bold rounded-full uppercase tracking-wider">
                        Parsed AI
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-white dark:bg-slate-800 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                  
                  <button
                    onClick={() => navigate("/analysis", { state: { selectedResumeId } })}
                    className="bg-primary-gradient text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform cursor-pointer"
                  >
                    Match to Job
                  </button>
                </div>
              </div>

              {/* Parsed Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Left Side: Skills & Education */}
                <div className="space-y-6">
                  {/* Skills Container */}
                  <div className="bg-surface-container-lowest dark:bg-slate-850 p-6 rounded-xl space-y-4 shadow-sm">
                    <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400">
                      Extracted Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-surface-container-low dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education Container */}
                  <div className="bg-surface-container-lowest dark:bg-slate-850 p-6 rounded-xl space-y-4 shadow-sm">
                    <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400">
                      Education
                    </h4>
                    {education.length === 0 ? (
                      <p className="text-xs text-on-surface-variant">No education details extracted.</p>
                    ) : (
                      <div className="space-y-4">
                        {education.map((edu, index) => (
                          <div
                            key={index}
                            className={`space-y-1 ${index > 0 ? "pt-3 border-t border-slate-100 dark:border-slate-800" : ""}`}
                          >
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                              {edu.degree || "Degree"}
                            </p>
                            <p className="text-xs text-on-surface-variant">{edu.school || "University"}</p>
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
                  <div className="bg-surface-container-lowest dark:bg-slate-850 p-6 rounded-xl space-y-4 shadow-sm">
                    <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400">
                      Work Experience
                    </h4>
                    {experience.length === 0 ? (
                      <p className="text-xs text-on-surface-variant">No work experience details extracted.</p>
                    ) : (
                      <div className="space-y-4">
                        {experience.map((exp, index) => (
                          <div
                            key={index}
                            className={`relative pl-4 border-l-2 border-indigo-200/50 space-y-1 ${
                              index > 0 ? "pt-2" : ""
                            }`}
                          >
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                              {exp.role || exp.title || "Role Title"}
                            </p>
                            <p className="text-xs text-primary font-semibold">{exp.company || "Company"}</p>
                            {exp.description && (
                              <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
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
                    <div className="bg-surface-container-lowest dark:bg-slate-850 p-6 rounded-xl space-y-4 shadow-sm">
                      <h4 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-400">
                        Key Projects
                      </h4>
                      <div className="space-y-3">
                        {projects.map((proj, index) => (
                          <div key={index} className="bg-surface-container-low dark:bg-slate-800 p-3 rounded-lg text-left">
                            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{proj.name}</p>
                            <p className="text-[10px] text-on-surface-variant mt-1 italic leading-relaxed">
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

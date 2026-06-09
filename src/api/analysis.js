import apiClient from "./client";

// Backend envelope: { success: true, message: "...", data: { ... } }
// We unwrap `data` so callers receive the actual resource objects directly.

export const runAnalysis = async ({ resume_id, jd_id }) => {
  const response = await apiClient.post("/analysis/run", {
    resume_id: parseInt(resume_id, 10),
    jd_id: parseInt(jd_id, 10),
  });
  // Unwrap envelope: data contains the full AnalysisRunResponse
  return response.data?.data || response.data;
};

export const fetchAnalyses = async () => {
  const response = await apiClient.get("/analysis/");
  // Unwrap envelope: data is the list of analyses (paginated or plain array)
  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : [];
};

export const fetchAnalysisDetails = async (id) => {
  const response = await apiClient.get(`/analysis/${id}`);
  // Unwrap envelope: data contains the full analysis object
  return response.data?.data || response.data;
};

export const fetchAnalysisSummary = async (id) => {
  const response = await apiClient.get(`/analysis/${id}/summary`);
  // Unwrap envelope: data contains the summary object
  return response.data?.data || response.data;
};

export const fetchAnalysesByResume = async (resumeId) => {
  const response = await apiClient.get(`/analysis/by-resume/${resumeId}`);
  // Unwrap envelope: data is the list of analyses for this resume
  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : [];
};

export const fetchAnalysesByJd = async (jdId) => {
  const response = await apiClient.get(`/analysis/by-jd/${jdId}`);
  // Unwrap envelope: data is the list of analyses for this JD
  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : [];
};

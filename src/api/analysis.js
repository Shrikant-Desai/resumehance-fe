import apiClient from "./client";

export const runAnalysis = async ({ resume_id, jd_id }) => {
  const response = await apiClient.post("/analysis/run", {
    resume_id: parseInt(resume_id, 10),
    jd_id: parseInt(jd_id, 10),
  });
  return response.data;
};

export const fetchAnalyses = async () => {
  const response = await apiClient.get("/analysis/");
  return response.data;
};

export const fetchAnalysisDetails = async (id) => {
  const response = await apiClient.get(`/analysis/${id}`);
  return response.data;
};

export const fetchAnalysisSummary = async (id) => {
  const response = await apiClient.get(`/analysis/${id}/summary`);
  return response.data;
};

export const fetchAnalysesByResume = async (resumeId) => {
  const response = await apiClient.get(`/analysis/by-resume/${resumeId}`);
  return response.data;
};

export const fetchAnalysesByJd = async (jdId) => {
  const response = await apiClient.get(`/analysis/by-jd/${jdId}`);
  return response.data;
};

import apiClient from "./client";

export const createJobDescription = async ({ jd_text, job_title, company }) => {
  const response = await apiClient.post("/job/create", {
    jd_text,
    job_title: job_title || undefined,
    company: company || undefined,
  });
  return response.data;
};

export const fetchJobDescriptions = async () => {
  const response = await apiClient.get("/job/");
  return response.data;
};

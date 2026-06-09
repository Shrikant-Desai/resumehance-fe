import apiClient from "./client";

// Backend envelope: { success: true, message: "...", data: { ... } }
// We unwrap `data` so callers receive the actual resource objects directly.

export const createJobDescription = async ({ jd_text, job_title, company }) => {
  const response = await apiClient.post("/job/create", {
    jd_text,
    job_title: job_title || undefined,
    company: company || undefined,
  });
  // Unwrap envelope: data contains the created job description object
  return response.data?.data || response.data;
};

export const fetchJobDescriptions = async () => {
  const response = await apiClient.get("/job/");
  // Unwrap envelope: data is the list of job descriptions (paginated or plain array)
  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : [];
};

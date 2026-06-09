import apiClient from "./client";

// Backend envelope: { success: true, message: "...", data: { ... } }
// We unwrap `data` so callers receive the actual resource objects directly.

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  // Unwrap envelope: data contains the uploaded resume object
  return response.data?.data || response.data;
};

export const fetchResumes = async () => {
  const response = await apiClient.get("/resume/");
  // Unwrap envelope: data is the list of resumes (paginated or plain array)
  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : [];
};

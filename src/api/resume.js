import apiClient from "./client";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchResumes = async () => {
  const response = await apiClient.get("/resume/");
  return response.data;
};

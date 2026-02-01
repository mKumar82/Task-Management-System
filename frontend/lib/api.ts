import toast from "react-hot-toast";

const API_URL = "http://localhost:4000";

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error: any = new Error("API Error");
    error.status = res.status;
    throw error;
  }

  // handle empty responses (DELETE, etc.)
  if (res.status === 204) return null;

  return res.json();
};

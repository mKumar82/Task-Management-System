import { redirect } from "next/navigation";
import toast from "react-hot-toast";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  localStorage.clear();
  redirect("/login");
  //   window.location.href = "/login";
};


export const refreshSession = async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });

    if (!res.ok) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);

    toast.success("Session refreshed");
    redirect("/tasks")
  } catch {
    toast.error("Unable to refresh session");
  }
};
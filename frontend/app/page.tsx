"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      //   window.location.href = "/tasks";
      router.replace("/tasks");
    } else {
      //   window.location.href = "/login";
      router.replace("/login");
    }
  }, []);

  return null;
}

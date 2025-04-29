"use client";

import { useEffect, useState } from "react";

export const useGetUserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    userId: "",
    userEmail: "",
    isAuth: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onStorageChange = () => {
        const storedData = localStorage.getItem("auth");
        if (storedData) {
          setUserInfo(JSON.parse(storedData));
        } else {
          setUserInfo({ name: "", userId: "", userEmail: "", isAuth: false });
        }
      };
      window.addEventListener("storage", onStorageChange);
      // Initial load
      onStorageChange();
      return () => window.removeEventListener("storage", onStorageChange);
    }
  }, []);

  // Add this effect to update state immediately after sign-in in the same tab
  useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        const storedData = localStorage.getItem("auth");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setUserInfo((prev) => {
            if (
              parsed.name !== prev.name ||
              parsed.userId !== prev.userId ||
              parsed.userEmail !== prev.userEmail ||
              parsed.isAuth !== prev.isAuth
            ) {
              return parsed;
            }
            return prev;
          });
        } else {
          setUserInfo({ name: "", userId: "", userEmail: "", isAuth: false });
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []); // Remove userInfo from dependency array

  return userInfo;
};
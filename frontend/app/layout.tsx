"use client";

import { useEffect } from "react";
import "./globals.css";
import { Toaster } from "sonner";
import { getMeAPI } from "@/lib/api/authAPI";
import userStore from "@/lib/store";
import { observer } from "mobx-react-lite";

export default observer(function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    userStore.setToken(token);
    if (token) {
      try {
        getMeAPI().then((user) => {
          userStore.setUser(user);
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        userStore.setUser(null);
      }
    }else{
      userStore.setUser(null);
    }
  }, [userStore]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {userStore.user === undefined ? "loading..." : children}
        <Toaster />
      </body>
    </html>
  );
});


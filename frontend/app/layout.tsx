"use client";

import { Loader } from "@/components/ui/loader";
import { getMeAPI } from "@/lib/api/authAPI";
import userStore from "@/lib/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Toaster } from "sonner";
import axios from "axios";  // <-- import axios
import "./globals.css";

export default observer(function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    userStore.setToken(token);

    const fetchCsrfCookieAndUser = async () => {
      try {
        // First: get Sanctum CSRF cookie
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
          withCredentials: true,
        });

        // Then: fetch user data if token exists
        if (token) {
          const user = await getMeAPI();  // Your existing user fetch function
          userStore.setUser(user);
        } else {
          userStore.setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch CSRF cookie or user data:", error);
        userStore.setUser(null);
      }
    };

    fetchCsrfCookieAndUser();
  }, []);

  const queryClient = new QueryClient();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          {userStore.user === undefined ? <Loader /> : children}
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
});

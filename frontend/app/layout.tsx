"use client";

import { getMeAPI } from "@/lib/api/authAPI";
import userStore from "@/lib/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { Loader } from "@/components/ui/loader";

export default observer(function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    userStore.setToken(token);

    const fetchUser = async () => {
      if (token) {
        try {
          const user = await getMeAPI();
          userStore.setUser(user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          userStore.setUser(null);
        }
      } else {
        userStore.setUser(null);
      }
    };

    fetchUser();
  }, [userStore]);

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

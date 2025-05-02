"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import NavBar from "@/components/navComponents/NavBar";
import "../globals.css";
import userStore from "@/lib/store";
import { redirect } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    // Client can access /talent, all others are denied
    if (userStore.user?.type !== "Client" && pathname?.startsWith("/talent")) {
      toast.error("Only clients can access the talent page");
      redirect("/signin");
    }
  }, [pathname]);

  return (
    <div>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}

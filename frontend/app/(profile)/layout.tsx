"use client";
import userStore from "@/lib/store";
import { redirect } from "next/navigation";
import "../globals.css";
import NavBar from "@/components/navComponents/NavBar";
import Footer from "@/components/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = userStore.user;

  if (user === null) redirect("/signin");
  return <div>
    <NavBar />
    <div className="w-[60%] mx-auto py-8 px-4">
    {children}
    </div>
    <Footer />
    </div>;
}

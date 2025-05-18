"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import NavBar from "@/components/navComponents/NavBar";
import "../globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Define routes where Footer should be hidden
  const hideFooterRoutes = ["/chat"];

  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <div>
      <NavBar />
      {children}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

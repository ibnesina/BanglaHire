import userStore from "@/lib/store";
import { redirect } from "next/navigation";
import "../globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = userStore.user;
  if (!user === null) redirect("/signin");
  return <div>{children}</div>;
}

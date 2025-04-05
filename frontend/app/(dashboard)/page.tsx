import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-slate-100">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="banglahire" width={100} height={100} />
          <h1 className="text-4xl font-bold text-center">
            Welcome to BanglaHire
          </h1>
          <p className="text-lg text-center">
            The best place to find Bangladeshi talent
          </p>
        </div>
      </div>
      
    </div>
  );
}

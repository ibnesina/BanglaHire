import CategoriesWithMatrix from "@/components/CategoriesWithMatrix";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="relative flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://www.advanceitbd.com/wp-content/uploads/2020/09/ultimate-guide-for-freelancing-in-bangladesh.jpg"
            alt="Bangladesh cityscape"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in-up">
            Welcome to <span className="text-yellow-400">BanglaHire</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
            Discover exceptional Bangladeshi talent and unlock new opportunities
            for growth and innovation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-600">
            <Link href="/talent" className="bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
              Find Talent
            </Link>
            <Link href="/profile/create-project" className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-blue-900 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
              Post a Job
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
      <CategoriesWithMatrix />
    </div>
  );
}

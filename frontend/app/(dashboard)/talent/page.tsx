"use client";
import CategorySelectionOnFnd from "@/components/CategorySelectionOnFnd";
import FreelancerComponent from "@/components/FrelancerComponent";
import UserDetails from "@/components/UserDetails";
import { Category } from "@/contracts/posts";
import { getTalentAPI } from "@/lib/api/FindAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function TalentPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const { data: freelancers, isLoading } = useQuery({
    queryKey: ["talent", selectedCategory, selectedSkills],
    queryFn: () =>
      getTalentAPI(
        selectedCategory?.id || undefined,
        selectedSkills.length > 0 ? selectedSkills : undefined
      ),
  });


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    console.log(selectedCategory, selectedSkills, freelancers);
  }, [selectedCategory, selectedSkills, freelancers]);

  return (
    <main className="container mx-auto my-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Find Talented Freelancers
        </h1>
        <p className="text-gray-600 mt-2">
          Browse our top rated professionals for your projects
        </p>
      </div>

      <div className="flex gap-6 p-6 bg-gray-50 rounded-xl">
        <div className="w-full md:w-1/4">
          <CategorySelectionOnFnd
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            initialCategoryId={categoryParam ? parseInt(categoryParam) : undefined}
          />
        </div>
        <div className="w-full md:w-2/4">
          <FreelancerComponent freelancers={freelancers} isLoading={isLoading} />
        </div>
        <div className="w-full md:w-1/4">
          <UserDetails />
        </div>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer dark:bg-emerald-600 dark:hover:bg-emerald-700"
          aria-label="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </main>
  );
}

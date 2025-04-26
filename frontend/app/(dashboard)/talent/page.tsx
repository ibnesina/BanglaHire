"use client";
import { useEffect, useState } from "react";
import CategorySelectionOnFnd from "@/components/CategorySelectionOnFnd";
import PostList from "@/components/PostList";
import UserDetails from "@/components/UserDetails";
import { Category, Post } from "@/contracts/posts";
import { User } from "@/contracts/users";
import { generateRandomPosts } from "@/lib/utils";

const userData: User = {
  name: "John Smith",
  company: "Tech Solutions Ltd",
  averageRating: 4.8,
  totalSpending: "$5,240",
  totalPosts: 12,
  ongoingProjects: 3,
  paymentVerified: true,
  id: "1",
  type: "Freelancer",
  email: "john.smith@example.com",
  profile_picture: null,
  payment_phone: null,
  balance: "0.00",
  google_id: null,
  avatar: null,
  payment_history_id: null,
  nationality: null,
  email_verified_at: null,
  created_at: "2023-01-01T00:00:00.000Z",
  updated_at: "2023-01-01T00:00:00.000Z",
};



export default function TalentPage() {
  // State to track scroll position
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

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

  useEffect(() => {
    setPosts(generateRandomPosts(10));
  }, [selectedCategory, selectedSkills]); 

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          />
        </div>
        <div className="w-full md:w-2/4">
          <PostList posts={posts} />
        </div>
        <div className="w-full md:w-1/4">
          <UserDetails {...userData} />
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesWithMatrixAPI } from "@/lib/api/FindAPI";
import { Loader } from "@/components/ui/loader";
import { TCategoryWithMatrix } from "@/contracts/types";

const CategoriesWithMatrix: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const { data: categoriesWithMatrix = [], isLoading } = useQuery<
    TCategoryWithMatrix[]
  >({
    queryKey: ["categoriesWithMatrix"],
    queryFn: getCategoriesWithMatrixAPI,
    initialData: [],
  });

  const initialDisplayCount = 8;
  const displayedCategories = showAll 
    ? categoriesWithMatrix 
    : categoriesWithMatrix.slice(0, initialDisplayCount);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-purple-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Categories</h2>
          <Link href="/jobs">
            <p className="mt-2 sm:mt-0 text-purple-100 hover:underline">
              Looking for work? <span className="underline">Explore Job</span>
            </p>
          </Link>
        </header>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col justify-between border-l-4 border-purple-500"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">{cat.name}</h3>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    <span>{cat.skill_count} {cat.skill_count === 1 ? "skill" : "skills"}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mt-2">
                  <p className="font-medium mb-1">Top skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills?.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {cat.skills?.length > 3 && (
                      <span className="text-xs text-gray-500">+{cat.skills.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-auto pt-2 border-t">
                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 fill-current text-yellow-500 mr-1"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09L5.64 11.545.763 7.91l6.09-.887L10 1l2.14 6.022 6.09.887-4.877 3.636 1.518 6.545z" />
                  </svg>
                  <span className="font-medium">{cat.avg_rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 ml-1">/5</span>
                </div>
                <Link href={`/talent?category=${cat.id}`}>
                  <span className="text-purple-600 text-sm hover:underline">View talents →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {categoriesWithMatrix.length > initialDisplayCount && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-white text-purple-800 px-6 py-2 rounded-full font-medium hover:bg-purple-100 transition-colors"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesWithMatrix;

"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjectByIdAPI } from "@/lib/api/clientAPI";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";

export default function BiddingPage() {
  const { project_id } = useParams();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", project_id],
    queryFn: () => getProjectByIdAPI(Number(project_id)),
    enabled: !!project_id,
  });

  if (isLoading) {
    return <Loader className="mx-auto my-12" />;
  }

  if (error || !project) {
    toast.error("Failed to load project details");
    return <div className="text-center my-12 text-red-500 font-semibold">Failed to load project details</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-extrabold text-gray-800">{project.title}</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              project.status === "Open" ? "bg-green-100 text-green-800 border border-green-200" :
              project.status === "In Progress" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" : 
              "bg-red-100 text-red-800 border border-red-200"
            }`}>
              {project.status}
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{project.description || "No description provided"}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Budget
                </h3>
                <p className="mt-2 text-2xl font-bold text-blue-600">৳{parseFloat(project.budget).toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category
                </h3>
                <p className="mt-2 text-gray-700 font-medium">{project.category.name}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.required_skills.map((skill: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Client
                </h3>
                <p className="mt-2 text-gray-700 font-medium">{project.client?.company_name || "Unknown Client"}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Posted On
                </h3>
                <p className="mt-2 text-gray-700 font-medium">{formatDate(project.created_at)}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <Link 
              href={`/bidding/${project_id}/submit`}
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Submit Bid
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

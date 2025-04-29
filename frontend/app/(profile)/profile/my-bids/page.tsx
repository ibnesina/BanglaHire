"use client";
import { useQuery } from "@tanstack/react-query";
import { getMyBiddingsAPI } from "@/lib/api/bidAPI";
import { Loader } from "@/components/ui/loader";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export default function MyBids() {
  const { data: biddings, isLoading, error } = useQuery({
    queryKey: ["myBiddings"],
    queryFn: getMyBiddingsAPI,
  });

  if (isLoading) {
    return <Loader className="mx-auto my-12" />;
  }

  if (error || !biddings) {
    toast.error("Failed to load your biddings");
    return (
      <div className="text-center my-12 text-red-500 font-semibold">
        Failed to load your biddings
      </div>
    );
  }

  if (biddings.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bids Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any bids on projects yet.</p>
          <Link href="/dashboard">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Browse Projects
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bids</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {biddings.map((bid) => (
          <div key={bid.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/projects/${bid.project_id}`}>
                    <h2 className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      {bid.project.title}
                    </h2>
                  </Link>
                  <div className="flex flex-col mt-2 space-y-1">
                    <span className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Bid placed: {formatDate(bid.created_at)}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Client: {bid.project.client.company_name}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Category: {bid.project.category.name}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex gap-2 items-center">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Budget: ৳{bid.project.budget}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Your Bid: ৳{bid.bidding_amount}
                    </span>
                  </div>
                  <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    bid.project.status === "Open" ? "bg-blue-100 text-blue-800" :
                    bid.project.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {bid.project.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700">Project Description:</h3>
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {bid.project.description || "No description provided"}
                </p>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700">Your Proposal:</h3>
                <p className="mt-2 text-gray-600 line-clamp-3">
                  {bid.cover_letter || "No cover letter provided"}
                </p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {bid.project.required_skills && bid.project.required_skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

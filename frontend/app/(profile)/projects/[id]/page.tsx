"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/ui/loader";
import { getMyBiddingsAPI } from "@/lib/api/bidAPI";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Bidding } from "@/contracts/posts";
import { Calendar, DollarSign, FileText, User, Clock } from "lucide-react";

export default function MyBids() {
  const params = useParams();
  const projectId = params.id;
  
  const { data: biddings, isLoading, error } = useQuery({
    queryKey: ["myBiddings"],
    queryFn: getMyBiddingsAPI,
  });

  if (isLoading) return <Loader />;
  
  if (error) {
    toast.error("Failed to load biddings");
    return <div>Error loading biddings</div>;
  }

  const selectedBidding = biddings?.find((bid: Bidding) => bid.project_id.toString() === projectId);
  
  if (!selectedBidding) {
    return <div className="p-8 text-center">No bidding found for this project</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{selectedBidding.project.title}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Project Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span>Client: {selectedBidding.project.client.company_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span>Budget: ${selectedBidding.project.budget}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span>Posted: {formatDate(selectedBidding.project.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span>Category: {selectedBidding.project.category.name}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-700">{selectedBidding.project.description}</p>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {selectedBidding.project.required_skills.map((skill: string, index: number) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Bid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span>Bid Amount: ${selectedBidding.bidding_amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>Submitted: {formatDate(selectedBidding.created_at)}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Cover Letter</h3>
          <p className="text-gray-700">{selectedBidding.cover_letter}</p>
        </div>
      </div>
    </div>
  );
}

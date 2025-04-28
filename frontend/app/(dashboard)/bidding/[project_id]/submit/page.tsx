"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createBiddingAPI } from "@/lib/api/bidAPI";
import { getProjectByIdAPI } from "@/lib/api/clientAPI";
import { Loader } from "@/components/ui/loader";
import { formatDate } from "@/lib/utils";

const bidSchema = z.object({
  cover_letter: z.string().min(10, "Cover letter must be at least 10 characters"),
  bidding_amount: z.number().positive("Bid amount must be positive")
});

export default function SubmitBidPage() {
  const { project_id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    cover_letter: "",
    bidding_amount: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", project_id],
    queryFn: () => getProjectByIdAPI(Number(project_id)),
  });

  const bidMutation = useMutation({
    mutationFn: async () => {
      return await createBiddingAPI(
        Number(project_id),
        {
          cover_letter: formData.cover_letter,
          bidding_amount: parseFloat(formData.bidding_amount)
        }
      );
    },
    onSuccess: () => {
      toast.success("Bid submitted successfully!");
      router.push(`/bidding/${project_id}`);
    },
    onError: () => {
      toast.error("Failed to submit bid");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    try {
      bidSchema.parse({
        cover_letter: formData.cover_letter,
        bidding_amount: parseFloat(formData.bidding_amount) || 0 // Handle NaN case
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = String(err.path[0]);
            newErrors[path] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        // Handle other types of errors
        toast.error("Validation failed. Please check your inputs.");
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent form submission if validation fails
    if (!validateForm()) {
      return false;
    }
    
    // Only mutate if validation passed
    bidMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Project Details Card */}
        <div className="md:w-1/2">
          {project && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
              <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95a1 1 0 001.715 1.029zM6 12a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">৳{project.budget}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{formatDate(project.created_at)}</span>
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <h3 className="font-medium mb-2 text-gray-700">Project Description</h3>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
                <div className="mt-6">
                  <h3 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.required_skills?.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-100 transition-colors hover:bg-indigo-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bid Form Card */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-800">Submit Your Bid</h2>
              <p className="text-indigo-600 text-sm mt-1">Provide details about your proposal for this project</p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="p-0">
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="bidding_amount" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Bid Amount
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">৳</span>
                    <input
                      id="bidding_amount"
                      name="bidding_amount"
                      type="number"
                      step="0.01"
                      placeholder="Enter your bid amount"
                      className="w-full rounded-md border border-gray-300 pl-8 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={formData.bidding_amount}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.bidding_amount && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.bidding_amount}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="cover_letter" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Cover Letter
                  </label>
                  <textarea
                    id="cover_letter"
                    name="cover_letter"
                    placeholder="Explain why you're the best fit for this project..."
                    rows={8}
                    value={formData.cover_letter}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                  />
                  {errors.cover_letter && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.cover_letter}
                    </p>
                  )}
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                    <p className="text-sm text-blue-700 flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 6a2 2 0 100 4 2 2 0 000-4zm3 8a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                      </svg>
                      <span>Be sure to include your best skills and experience that align with the project requirements.</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                    disabled={bidMutation.isPending}
                  >
                    {bidMutation.isPending ? (
                      <Loader size="sm" />
                    ) : (
                      "Submit Bid"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

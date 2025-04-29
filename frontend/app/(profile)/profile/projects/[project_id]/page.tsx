"use client";
import { Loader } from "@/components/ui/loader";
import { Bidding } from "@/contracts/posts";
import {
  createAssignmentAPI,
  getAssignmentAPI,
  getBiddingsAPI,
  updateAssignmentAPI,
} from "@/lib/api/bidAPI";
import { getProjectByIdAPI } from "@/lib/api/clientAPI";
import { formatDate } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ProjectDetails() {
  const { project_id } = useParams();

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", project_id],
    queryFn: () => getProjectByIdAPI(Number(project_id)),
    enabled: !!project_id,
  });

  const {
    data: biddings,
    isLoading: biddingsLoading,
    error: biddingsError,
  } = useQuery<Bidding[]>({
    queryKey: ["biddings", project_id],
    queryFn: () => getBiddingsAPI(Number(project_id)),
    enabled: !!project_id && project?.status === "Open",
  });

  const { data: assignment } = useQuery({
    queryKey: ["assignment", project_id],
    queryFn: () => getAssignmentAPI(Number(project_id)),
    enabled: !!project_id && project?.status === "Assigned",
  });

  useEffect(() => {
    console.log(assignment);
  }, [assignment]);

  const assignFreelancerMutation = useMutation({
    mutationFn: (data: { project_id: number; freelancer_id: string }) =>
      createAssignmentAPI(data),
    onSuccess: () => {
      toast.success("Freelancer assigned successfully");
      // Force a complete data refetch instead of just refreshing the page
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error) => {
      toast.error("Failed to assign freelancer");
      console.error(error);
    },
  });

  const handleApproveBid = (bid: Bidding) => {
    assignFreelancerMutation.mutate({
      project_id: Number(project_id),
      freelancer_id: bid.freelancer_id,
    });
  };

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center my-20">
        <Loader className="w-12 h-12 text-blue-600" />
      </div>
    );
  }

  if (projectError) {
    toast.error("Failed to load project details");
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        Error loading project details
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {project.title}
            </h1>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                project.status === "Open"
                  ? "bg-green-100 text-green-800"
                  : project.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6 space-y-8">
          {/* Description */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-5 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {project.description || "No description provided"}
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Project Details
              </h3>
              <div className="space-y-3">
                <p className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Budget:</span>{" "}
                  <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                    ৳{parseFloat(project.budget).toFixed(2)}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Category:</span>{" "}
                  <span className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700">
                    {project.category.name}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">Created:</span>{" "}
                  <span>{formatDate(project.created_at)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Last Updated:
                  </span>{" "}
                  <span>{formatDate(project.updated_at)}</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Biddings Section */}
          {project.status === "Open" && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  Biddings
                </h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {biddings?.length || 0} total bids
                </span>
              </div>

              {biddingsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-8 h-8 text-blue-600" />
                </div>
              ) : biddingsError ? (
                <p className="text-center text-red-500 py-4">
                  Failed to load biddings
                </p>
              ) : biddings && biddings.length > 0 ? (
                <div className="space-y-4">
                  {biddings?.map((bid: Bidding) => (
                    <div
                      key={bid.id}
                      className="border border-gray-200 rounded-md p-4 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                            {bid.freelancer.user?.name?.charAt(0) || "F"}
                          </div>
                          <span className="font-medium">
                            {bid.freelancer.user?.name || "Freelancer"}
                          </span>
                        </div>
                        <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                          ৳{parseFloat(bid.bidding_amount).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-4 bg-gray-50 p-3 rounded-md">
                        {bid.cover_letter || ""}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 text-xs">
                          {formatDate(bid.created_at)}
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            onClick={() => handleApproveBid(bid)}
                            disabled={assignFreelancerMutation.isPending}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              className="h-4 w-4"
                            >
                              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                            </svg>
                            Approve
                          </button>
                          <button
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            onClick={() =>
                              toast.error(
                                `Rejected bid from ${
                                  bid.freelancer.user.name || "Freelancer"
                                }`
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              className="h-4 w-4"
                            >
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="mx-auto text-gray-400 mb-3"
                  >
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  <p className="text-gray-500">
                    No biddings yet for this project
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Assigned Freelancer */}
          {project.status === "Assigned" && assignment && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Assignment Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Freelancer Information */}
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    Assigned Freelancer
                  </h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-12 w-12 rounded-full flex items-center justify-center font-bold shadow-md">
                      {assignment?.freelancer?.bio?.charAt(0) || "F"}
                    </div>
                    <div>
                      <p className="font-medium text-lg">Freelancer</p>
                      <p className="text-gray-600 text-sm">
                        {assignment?.freelancer?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Skills:</span>{" "}
                      {JSON.parse(assignment.freelancer.skills || "[]").join(
                        ", "
                      )}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Hourly Rate:</span> ৳
                      {parseFloat(assignment.freelancer.hourly_rate).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Assignment Status */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Assignment Status
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {assignment.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment:</span>
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                        {assignment.payment_status} - ৳
                        {parseFloat(assignment.payment_amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Assigned Date:</span>
                      <span className="text-gray-800">
                        {formatDate(assignment.assigned_date)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="text-gray-800 font-medium">
                        {formatDate(assignment.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Client Information
                </h4>
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {assignment.client.company_name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {assignment.client.company_name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Payment verified:{" "}
                      {assignment.client.payment_method_verified ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* submitted project */}
          {project.status === "Submitted" && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow mt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Project Submission
              </h3>
              <p className="mb-4 text-gray-600">
                The freelancer has submitted the project. Please review and take
                action.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() =>
                    updateAssignmentAPI(project.id, {
                      status: "Completed",
                    }).then(() => {
                      setTimeout(() => {
                        // window.location.reload();
                      }, 500);
                    })
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Accept Submission
                </button>
                <button
                  onClick={() =>
                    updateAssignmentAPI(project.id, {
                      status: "Canceled",
                    }).then(() => {
                      setTimeout(() => {
                        // window.location.reload();
                      }, 500);
                    })
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Reject Submission
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

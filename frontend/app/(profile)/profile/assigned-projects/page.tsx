"use client";
import { Loader } from "@/components/ui/loader";
import { Assignment } from "@/contracts/posts";
import { getMyAssignmentsAPI, updateAssignmentAPI } from "@/lib/api/bidAPI";
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function AssignedProjects() {
  const queryClient = useQueryClient();

  const {
    data: assignments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myAssignments"],
    queryFn: getMyAssignmentsAPI,
  });

  const submitWorkMutation = useMutation({
    mutationFn: (assignmentId: number) =>
      updateAssignmentAPI(assignmentId, { status: "Submitted" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAssignments"] });
      toast.success("Work submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: () => {
      toast.error("Failed to submit work");
    },
  });

  const handleSubmitWork = (assignmentId: number) => {
    submitWorkMutation.mutate(assignmentId);
  };

  if (isLoading) return <Loader />;

  if (error) {
    toast.error("Failed to load assignments");
    return <div className="text-center p-10">Failed to load assignments</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        My Assigned Projects
      </h1>

      {assignments && assignments.length > 0 ? (
        <div className="grid gap-6">
          {assignments.map((assignment: Assignment) => (
            <div
              key={assignment.id}
              className="border rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {assignment.project.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.status === "Assigned"
                        ? "bg-blue-100 text-blue-800"
                        : assignment.status === "Submitted"
                        ? "bg-amber-100 text-amber-800"
                        : assignment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={18} />
                    <span className="font-medium">Client:</span>
                    <span>{assignment.client.company_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span className="font-medium">Assigned:</span>
                    <span>{formatDate(assignment.assigned_date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} />
                    <span className="font-medium">Deadline:</span>
                    <span className="text-red-600 font-medium">
                      {formatDate(assignment.deadline)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign size={18} />
                    <span className="font-medium">Payment:</span>
                    <span>
                      ৳{assignment.payment_amount} ({assignment.payment_status})
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-start gap-2 mb-2">
                    <FileText size={18} className="mt-1 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-700">
                        Project Description:
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {assignment.project.description}
                      </p>
                    </div>
                  </div>

                  {assignment.project.required_skills &&
                    assignment.project.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {assignment.project.required_skills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    )}
                </div>

                <div className="flex justify-end items-center mt-5 pt-4 border-t">
                  {assignment.status === "Assigned" && (
                    <button
                      onClick={() => handleSubmitWork(assignment.project.id)}
                      disabled={submitWorkMutation.isPending}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      <CheckCircle size={18} />
                      {submitWorkMutation.isPending
                        ? "Submitting..."
                        : "Submit Work"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4">
            <FileText size={48} className="mx-auto text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Assigned Projects
          </h3>
          <p className="text-gray-500">
            You don&apos;t have any assigned projects yet.
          </p>
        </div>
      )}
    </div>
  );
}

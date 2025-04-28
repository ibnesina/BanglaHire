"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjectByIdAPI } from "@/lib/api/clientAPI";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function ProjectDetails() {
  const { project_id } = useParams();
  
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", project_id],
    queryFn: () => getProjectByIdAPI(Number(project_id)),
    enabled: !!project_id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load project details");
    return <div className="container mx-auto py-8">Error loading project details</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === "Open" ? "bg-blue-100 text-blue-800" :
              project.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
            }`}>
              {project.status}
            </span>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{project.description || "No description provided"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Project Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Budget:</span> ${parseFloat(project.budget).toFixed(2)}</p>
                <p><span className="font-medium">Category:</span> {project.category.name}</p>
                <p><span className="font-medium">Created:</span> {formatDate(project.created_at)}</p>
                <p><span className="font-medium">Last Updated:</span> {formatDate(project.updated_at)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((skill: string, index: number) => (
                  <span key={index} className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {project.assigned_freelancer && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Assigned Freelancer</h3>
              <p>{project.assigned_freelancer.name}</p>
            </div>
          )}

          {project.file && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Attachments</h3>
              <a 
                href={project.file} 
                className="text-blue-600 hover:underline"
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Attachment
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Work } from "@/contracts/posts";
import { getMyProjectsAPI } from "@/lib/api/clientAPI";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

export default function MyProjects() {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myProjects"],
    queryFn: getMyProjectsAPI,
  });

  if (isLoading) {
    return <Loader className="mx-auto my-10" />;
  }

  if (error) {
    toast.error("Failed to load projects");
    return <div>Error loading projects</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Projects</h1>
        <Link href="/profile/create-project">
          <Button className="bg-slate-500 hover:bg-slate-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Project
          </Button>
        </Link>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Work) => (
            <div
              key={project.id}
              className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5 border-b">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    {project.title}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ${project.budget}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {project.description}
                </p>
              </div>

              <div className="px-5 py-3 bg-gray-50">
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-500">
                    Category:
                  </span>
                  <span className="ml-2 text-sm text-gray-700">
                    {project.category?.name}
                  </span>
                </div>

                {project.required_skills &&
                  project.required_skills.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-500">
                        Skills:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.required_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex justify-between items-center mt-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      project.status === "Open"
                        ? "bg-green-100 text-green-800"
                        : project.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status}
                  </span>
                  <Link href={`/profile/projects/${project.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-slate-700 border-slate-300 hover:bg-slate-100"
                    >
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 mb-4">
            You don&apos;t have any projects yet
          </p>
          <Link href="/profile/create-project">
            <Button className="bg-slate-500 hover:bg-slate-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create Your First Project
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

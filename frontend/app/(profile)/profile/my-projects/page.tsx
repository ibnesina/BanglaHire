"use client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMyProjectsAPI } from "@/lib/api/clientAPI";
import { Work } from "@/contracts/posts";



export default function MyProjects() {
  const { data, isLoading, error } = useQuery({
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
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Link href="/profile/create-project">
          <Button className="cursor-pointer">Create New Project</Button>
        </Link>
      </div>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((project:Work) => (
            <div key={project.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-2 line-clamp-2">{project.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  Budget: ${project.budget}
                </span>
                <Link href={`/profile/projects/${project.id}`}>
                  <Button variant="outline" size="sm" className="cursor-pointer">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You don&apos;t have any projects yet</p>
          <Link href="/profile/create-project">
            <Button className="cursor-pointer">Create Your First Project</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

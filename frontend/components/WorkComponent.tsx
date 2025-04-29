import { Work } from "@/contracts/posts";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";

const WorkComponent = ({
  works,
  isLoading,
}: {
  works: Work[];
  isLoading: boolean;
}) => {
  if (isLoading) return <Loader />;
  return (
    <div className="w-full space-y-6">
    
    {works.length === 0 && (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12a4 4 0 100-8 4 4 0 000 8z"></path>
        </svg>
        <p className="text-xl font-semibold text-gray-700">No works found</p>
        <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
      </div>
    )}

      {works.map((work, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {work.title}
            </h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded-full text-sm">
              ${work.budget}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {work.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {work.required_skills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                {work.category.name}
              </span>{" "}
              •<span className="ml-2">{work.client.company_name}</span>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                work.status === "Open"
                  ? "bg-green-100 text-green-700"
                  : work.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {work.status}
            </span>
          </div>
          
          <Link href={`/bidding/${work.id}`}>
            <button className="w-full px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors text-sm font-medium cursor-pointer">
              View Details & Bid
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default WorkComponent;

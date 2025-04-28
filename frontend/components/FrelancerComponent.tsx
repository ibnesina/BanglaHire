import { Freelancer } from "@/contracts/posts";
import { Loader } from "@/components/ui/loader";




const FreelancerComponent = ({
  freelancers,
  isLoading,
}: {
  freelancers: Freelancer[];
  isLoading: boolean;
}) => {
  if (isLoading) return <Loader />;
  return (
    <div className="w-full space-y-6">
      {freelancers.length === 0 && (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12a4 4 0 100-8 4 4 0 000 8z"></path>
        </svg>
        <p className="text-xl font-semibold text-gray-700">No Talent found</p>
        <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
      </div>
    )}
      {freelancers.map((freelancer, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {freelancer.user.name}
            </h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded-full text-sm">
              ${freelancer.hourly_rate}/hr
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {freelancer.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {JSON.parse(freelancer.skills).map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
              <span>{freelancer.user.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Joined {new Date(freelancer.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{freelancer.user.nationality || "Not specified"}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span
              className={`flex items-center text-sm ${
                freelancer.user.email_verified_at ? "text-green-600" : "text-amber-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {freelancer.user.email_verified_at ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                )}
              </svg>
              {freelancer.user.email_verified_at ? "Verified Account" : "Unverified Account"}
            </span>

            <span className="flex items-center text-sm text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span className="font-medium">{freelancer.reviews_avg_rating || "No ratings"}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FreelancerComponent;


import CategorySelectionOnFnd from "@/components/CategorySelectionOnFnd";
import PostList from "@/components/PostList";
import UserDetails from "@/components/UserDetails";

export default function TalentPage() {
  // Sample user data for UserDetails component
  const userData = {
    name: "John Smith",
    company: "Tech Solutions Ltd",
    averageRating: 4.8,
    totalSpending: "$5,240",
    totalPosts: 12,
    ongoingProjects: 3,
    paymentVerified: true,
  };

  return (
    <main className="container mx-auto my-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Find Talented Freelancers
        </h1>
        <p className="text-gray-600 mt-2">
          Browse our top rated professionals for your projects
        </p>
      </div>

      <div className="flex gap-6 p-6 bg-gray-50 rounded-xl">
        <div className="w-full md:w-1/4">
          <CategorySelectionOnFnd />
        </div>
        <div className="w-full md:w-2/4">
          <PostList />
        </div>
        <div className="w-full md:w-1/4">
          <UserDetails {...userData} />
        </div>
      </div>
    </main>
  );
}

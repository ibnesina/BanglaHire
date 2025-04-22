import { User } from "@/contracts/users";


const UserDetails: React.FC<User> = ({
  name,
  company,
  averageRating,
  totalSpending,
  totalPosts,
  ongoingProjects,
  paymentVerified
}) => (
  <div className="w-full bg-white p-6 rounded-lg shadow-lg border sticky top-24 z-[10] border-gray-200 hover:shadow-xl transition-shadow max-w-2xl mx-auto">
    <div className="flex flex-col space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">{company}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Rating:</span>
          <span className="font-medium">{averageRating}</span>
          <div className="text-yellow-500">★</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Spent:</span>
          <span className="font-medium">{totalSpending}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Posts:</span>
          <span className="font-medium">{totalPosts}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">Active:</span>
          <span className="font-medium">{ongoingProjects}</span>
        </div>
      </div>
      
      <div className="pt-3 border-t">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {paymentVerified ? '✓ Payment Verified' : '⚠ Payment Pending'}
        </span>
      </div>
    </div>
  </div>
);

export default UserDetails;

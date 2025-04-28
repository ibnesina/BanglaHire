import userStore from "@/lib/store";
import { observer } from "mobx-react-lite";

const UserDetails = observer(() => {
  const { user } = userStore;

  if (!user) return null;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border sticky top-24 z-[10] border-gray-200 hover:shadow-xl transition-shadow max-w-2xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{user.type}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Email:</span>
            <span className="font-medium truncate">{user.email}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Balance:</span>
            <span className="font-medium">৳{user.balance}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Nationality:</span>
            <span className="font-medium">
              {user.nationality || "Not specified"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Joined:</span>
            <span className="font-medium">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.email_verified_at
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.email_verified_at
              ? "✓ Email Verified"
              : "⚠ Email Not Verified"}
          </span>
        </div>
      </div>
    </div>
  );
});

export default UserDetails;

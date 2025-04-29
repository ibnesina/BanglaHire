"use client";
import UserDetails from "@/components/UserDetails";

const Profile = () => {
  return (
    <main className="p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>
      <UserDetails />
    </main>
  );
};

export default Profile;

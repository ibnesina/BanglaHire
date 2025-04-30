"use client";
import UserDetails from "@/components/UserDetails";
import { observer } from "mobx-react";
import userStore from "@/lib/store";
import FreelancerDetails from "@/components/FreelancerDetails";
import ClientComponent from "@/components/ClientComponent";

const Profile = observer(() => {
  const { user } = userStore;

  return (
    <main className="p-6 bg-white rounded-lg">
      {user?.type === "Freelancer" ? (
        <FreelancerDetails userId={user.id} />
      ) : user?.type === "Client" ? (
        <ClientComponent userId={user.id} />
      ) : (
        <UserDetails />
      )}
    </main>
  );
});

export default Profile;

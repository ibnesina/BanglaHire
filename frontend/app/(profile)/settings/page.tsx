"use client";

import UserDetails from "@/components/UserDetails";
import { observer } from "mobx-react";
import userStore from "@/lib/store";
import ClientComponent from "@/components/ClientComponent";
import FreelancerEditComponent from "@/components/FreelancerEditComponent";

const Settings = observer(() => {
  const { user } = userStore;

  return (
    <main className="flex-1 p-4">
      {user?.type === "Client" ? (
        <ClientComponent userId={user.id} />
      ) : user?.type === "Freelancer" ? (
        <FreelancerEditComponent userId={user.id} />
      ) : (
        <UserDetails />
      )}
    </main> 
  );
});

export default Settings;

// app/dashboard/viewfreelancer/[id]/page.tsx
import { useEffect, useState } from "react";
import api from "@/lib/api/api";

interface Props {
  params: { id: string };
}

export default function FreelancerProfile({ params }: Props) {
  const { id } = params;
  const [freelancer, setFreelancer] = useState<any>(null);

  useEffect(() => {
    async function fetchFreelancer() {
      try {
        const res = await api.get(`/viewfreelancer/${id}`);
        setFreelancer(res.data);
      } catch (error) {
        console.error("Failed to fetch freelancer", error);
      }
    }
    fetchFreelancer();
  }, [id]);

  if (!freelancer) return <div>Loading...</div>;

  return (
    <div>
      <h1>{freelancer.user.name}</h1>
      <p>{freelancer.bio}</p>
      {/* Render other details as you want */}
    </div>
  );
}

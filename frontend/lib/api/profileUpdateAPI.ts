import { toast } from "sonner";
import apiRequest from "./apiRequest";

export const getFreelancerByIdAPI = async (id: string) => {
  const response = await apiRequest({
    method: "GET",
    url: `/freelancers/${id}`,
  });

  if (response.status === 200) {
    return response.data;
  } else if (response.status === 404) {
    toast.error("Freelancer not found");
    return null;
  } else {
    toast.error(response.data.message || "Failed to fetch freelancer profile");
    return null;
  }
};

export const getClientByIdAPI = async (id: string) => {
  const response = await apiRequest({
    method: "GET",
    url: `/clients/${id}`,
  });

  if (response.status === 200) {
    return response.data;
  } else if (response.status === 404) {
    toast.error("Client not found");
    return null;
  } else {
    toast.error(response.data.message || "Failed to fetch client profile");
    return null;
  }
};



export const updateFreelancerProfileAPI = async (data: {
  bio?: string;
  category_id: number;
  skills?: string[];
  experiences?: string;
  hourly_rate?: number;
  certifications?: string[];
  portfolio_link?: string;
}) => {
  const response = await apiRequest({
    method: "PUT",
    url: "/freelancers",
    data: {
      bio: data.bio,
      category_id: data.category_id,
      skills: data.skills,
      experiences: data.experiences,
      hourly_rate: data.hourly_rate,
      certifications: data.certifications,
      portfolio_link: data.portfolio_link,
    },
  });

  if (response.status === 200 || response.status === 201) {
    toast.success(response.data.message || "Profile updated successfully");
    return response.data.freelancer;
  } else if (response.status === 401) {
    toast.error("Unauthorized. Please log in.");
    return null;
  } else if (response.status === 403) {
    toast.error("Unauthorized. Only freelancers can create profiles.");
    return null;
  } else if (response.status === 422) {
    toast.error(response.data.message || "Validation error");
    return null;
  } else {
    toast.error(response.data.message || "Failed to update profile");
    return null;
  }
};

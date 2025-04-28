import apiRequest from "@/lib/api/apiRequest";
import { toast } from "sonner";

export const createBiddingAPI = async (
  projectId: number,
  data: {
    cover_letter: string;
    bidding_amount: number;
  }
) => {
  const response = await apiRequest({
    method: "POST",
    url: `/projects/${projectId}/biddings`,
    data: {
      cover_letter: data.cover_letter,
      bidding_amount: data.bidding_amount,
    },
  });

  if (response.status === 201) {
    toast.success("Bid placed successfully");
    return response.data;
  } else if (response.status === 422) {
    toast.error(response.data.message || "Validation error");
    return null;
  } else if (response.status === 401) {
    toast.error("Unauthorized. Please sign in as a freelancer.");
    return null;
  } else if (response.status === 404) {
    toast.error("Project not found");
    return null;
  } else {
    toast.error(response.data.message || "Failed to place bid");
    return null;
  }
};

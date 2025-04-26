import { toast } from "sonner";
import apiRequest from "./apiRequest";

export const getCategoriesAPI = async () => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: "/categories",
    });

    if (response.status === 200) {
      return response.data;
    } else {
      toast.error(response.data.message || "Failed to fetch categories");
      return [];
    }
  } catch (error) {
    toast.error("Failed to fetch categories");
  }
};

export const getTalentAPI = async (params?: {
  category_id?: number;
  skills?: string[];
}) => {
  const response = await apiRequest({
    method: "GET",
    url: "/talent",
    params,
  });

  if (response.status === 200) {
    return response.data;
  } else {
    toast.error(response.data.message || "Failed to fetch talent");
    return [];
  }
};

import { CategoryWithMatrix } from "@/contracts/types";
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
  } catch {
    toast.error("Failed to fetch categories");
  }
};

export const getCategoriesWithMatrixAPI = async (): Promise<
  CategoryWithMatrix[]
> => {
  try {
    const response = await apiRequest({
      method: "GET",
      url: "/categoriesWithMetrics",
    });

    if (response.status === 200) {
      return response.data as CategoryWithMatrix[];
    } else {
      toast.error(response.data.message || "Failed to fetch categories");
      return [];
    }
  } catch {
    toast.error("Failed to fetch categories");
    return [];
  }
};
export const getTalentAPI = async (category_id?: number, skills?: string[]) => {
  const response = await apiRequest({
    method: "GET",
    url: "/talent",
    params: {
      ...(category_id && { category_id }),
      ...(skills?.length && { skills: skills.join(",") }),
    },
  });

  if (response.status === 200) {
    return response.data;
  } else {
    toast.error(response.data.message || "Failed to fetch talent");
    return [];
  }
};

export const getWorkAPI = async (category_id?: number, skills?: string[]) => {
  const response = await apiRequest({
    method: "GET",
    url: "/work",
    params: {
      ...(category_id && { category_id }),
      ...(skills?.length && { skills: skills.join(",") }),
    },
  });

  if (response.status === 200) {
    return response.data;
  } else {
    toast.error(response.data.message || "Failed to fetch talent");
    return [];
  }
};

import apiRequest from "./apiRequest";
import { toast } from "sonner";

export const createProjectAPI = async (data: {
  title: string;
  description?: string;
  category_id: number;
  required_skills: string[];
  budget: number;
}) => {
  const response = await apiRequest({
    method: 'POST',
    url: '/projects',
    data: {
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      required_skills: data.required_skills,
      budget: data.budget
    }
  });

  if (response.status === 201) {
    toast.success('Project created successfully');
    return response.data;
  } else if (response.status === 422) {
    toast.error(response.data.message || 'Validation error');
    return null;
  } else if (response.status === 401) {
    toast.error('Unauthorized. Please sign in as a client.');
    return null;
  } else {
    toast.error(response.data.message || 'Failed to create project');
    return null;
  }
};

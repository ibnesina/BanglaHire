"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProjectAPI } from "@/lib/api/clientAPI";
import { toast } from "sonner";
import { getCategoriesAPI } from "@/lib/api/FindAPI";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";

interface Category {
  id: number;
  name: string;
  skills: string[];
}

const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  required_skills: z.array(z.string()).min(1, "At least one skill is required"),
  budget: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Budget must be a positive number",
    }),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function CreateProject() {
  const router = useRouter();
  const [categorySkills, setCategorySkills] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    category_id: "",
    required_skills: [],
    budget: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAPI
  });


  const createProjectMutation = useMutation({
    mutationFn: createProjectAPI,
    onSuccess: () => {
      toast.success("Project created successfully!");
      router.push("/profile/my-projects");
    },
    onError: () => {
      toast.error("Error creating project");
    },
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormData({
      ...formData,
      category_id: categoryId,
      required_skills: [],
    });

    const selectedCategory = categories.find(
      (cat:Category) => cat.id.toString() === categoryId
    );
    setCategorySkills(selectedCategory?.skills || []);
  };

  const handleSkillChange = (skill: string) => {
    const updatedSkills = formData.required_skills.includes(skill)
      ? formData.required_skills.filter((s) => s !== skill)
      : [...formData.required_skills, skill];

    setFormData({
      ...formData,
      required_skills: updatedSkills,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    try {
      projectSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createProjectMutation.mutate({
      ...formData,
      category_id: parseInt(formData.category_id),
      budget: parseFloat(formData.budget),
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="title"
          >
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter project title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Enter project description"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="category_id"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleCategoryChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.category_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a category</option>
            {categories?.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Required Skills <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categorySkills.length > 0 ? (
              categorySkills.map((skill) => (
                <div key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`skill-${skill}`}
                    checked={formData.required_skills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                    className="mr-2"
                  />
                  <label htmlFor={`skill-${skill}`}>{skill}</label>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                Select a category to view available skills
              </p>
            )}
          </div>
          {errors.required_skills && (
            <p className="text-red-500 text-sm mt-1">
              {errors.required_skills}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="budget"
          >
            Budget <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2">৳</span>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className={`w-full pl-8 pr-3 py-2 border rounded-md ${
                errors.budget ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="1000.00"
              step="0.01"
              min="0"
            />
          </div>
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

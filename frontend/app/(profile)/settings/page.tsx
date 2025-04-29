"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import userStore from "@/lib/store";
import { observer } from "mobx-react";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  nationality: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Settings = observer(() => {
  const [loading, setLoading] = useState(false);
  const { user } = userStore;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      nationality: user?.nationality || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      // API call would go here
      // await updateProfileAPI(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const inputFieldDesign =
    "block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring";

  return (
    <main className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-4">General Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className={inputFieldDesign}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={inputFieldDesign}
            disabled
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          <p className="text-xs text-gray-500">Email cannot be changed. Contact support for assistance.</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="nationality">
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            {...register("nationality")}
            className={inputFieldDesign}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "cursor-not-allowed" : ""
          } px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
});

export default Settings;

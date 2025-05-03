import React, { useState } from "react";
import { Loader } from "./ui/loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFreelancerByIdAPI } from "@/lib/api/profileUpdateAPI";
import { updateFreelancerProfileAPI } from "@/lib/api/profileUpdateAPI";
import { Freelancer } from "@/contracts/users";
import { Category } from "@/contracts/posts";
import CategorySelectionOnFnd from "./CategorySelectionOnFnd";
import { toast } from "sonner";

export default function FreelancerEditComponent({
  userId,
}: {
  userId: string;
}) {
  const queryClient = useQueryClient();

  // Fetch freelancer data
  const {
    data: freelancerData,
    isLoading,
    error,
  } = useQuery<Freelancer, Error>({
    queryKey: ["freelancer", userId],
    queryFn: () => getFreelancerByIdAPI(userId),
  });

  // Convert string JSON to actual arrays if needed
  const parsedSkills = freelancerData?.skills
    ? typeof freelancerData.skills === "string"
      ? JSON.parse(freelancerData.skills)
      : freelancerData.skills
    : [];

  const parsedCertifications = freelancerData?.certifications
    ? typeof freelancerData.certifications === "string"
      ? JSON.parse(freelancerData.certifications)
      : freelancerData.certifications
    : [];

  // Form state
  const [bio, setBio] = useState(freelancerData?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(
    freelancerData?.hourly_rate ? String(freelancerData.hourly_rate) : ""
  );
  const [experiences, setExperiences] = useState(
    freelancerData?.experiences || ""
  );
  const [portfolioLink, setPortfolioLink] = useState(
    freelancerData?.portfolio_link || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(parsedSkills);
  const [certifications, setCertifications] =
    useState<string[]>(parsedCertifications);
  const [newCertification, setNewCertification] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update form state when freelancerData changes
  React.useEffect(() => {
    if (freelancerData) {
      setBio(freelancerData.bio || "");
      setHourlyRate(String(freelancerData.hourly_rate || ""));
      setExperiences(freelancerData.experiences || "");
      setPortfolioLink(freelancerData.portfolio_link || "");

      // Parse skills if it's a string
      const skills =
        typeof freelancerData.skills === "string"
          ? JSON.parse(freelancerData.skills)
          : freelancerData.skills || [];
      setSelectedSkills(skills);

      // Parse certifications if it's a string
      const certs =
        typeof freelancerData.certifications === "string"
          ? JSON.parse(freelancerData.certifications)
          : freelancerData.certifications || [];
      setCertifications(certs);
    }
  }, [freelancerData]);

  // Handle form submission
  const updateProfile = useMutation({
    mutationFn: updateFreelancerProfileAPI,
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["freelancer", userId] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!bio.trim()) {
      errors.bio = "Bio is required";
    }

    if (!selectedCategory) {
      errors.category = "Category is required";
    }

    if (selectedSkills.length === 0) {
      errors.skills = "At least one skill is required";
    }

    if (!experiences.trim()) {
      errors.experiences = "Experience information is required";
    }

    if (!hourlyRate || isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0) {
      errors.hourlyRate = "Valid hourly rate is required";
    }

    if (!portfolioLink.trim()) {
      errors.portfolioLink = "Portfolio link is required";
    } else if (!portfolioLink.startsWith("http")) {
      errors.portfolioLink = "Portfolio link must be a valid URL";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateProfile.mutate({
      bio,
      category_id: selectedCategory?.id || freelancerData?.category_id || 0,
      skills: selectedSkills,
      experiences,
      hourly_rate: Number(hourlyRate),
      certifications: certifications,
      portfolio_link: portfolioLink,
    });
  };

  const addCertification = () => {
    if (!newCertification.trim()) return;

    if (!newCertification.startsWith("http")) {
      setFormErrors({
        ...formErrors,
        certifications: "Certificate link must be a valid URL",
      });
      return;
    }

    setCertifications([...certifications, newCertification]);
    setNewCertification("");
    setFormErrors({ ...formErrors, certifications: "" });
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    console.log(freelancerData);
  }, [freelancerData]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-red-500">
        Error loading freelancer data: {error.message}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Edit Your Freelancer Profile
      </h2>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Bio */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label
            htmlFor="bio"
            className="block text-gray-700 font-semibold mb-2"
          >
            Professional Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            rows={4}
            placeholder="Describe your expertise and experience"
          />
          {formErrors.bio && (
            <p className="text-red-500 text-sm mt-1">{formErrors.bio}</p>
          )}
        </div>

        {/* Category and Skills */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Expertise
          </h3>
          <CategorySelectionOnFnd
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            initialCategoryId={freelancerData?.category_id || undefined}
          />
          {formErrors.category && (
            <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
          )}
          {formErrors.skills && (
            <p className="text-red-500 text-sm mt-1">{formErrors.skills}</p>
          )}
        </div>

        {/* Experiences */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label
            htmlFor="experiences"
            className="block text-gray-700 font-semibold mb-2"
          >
            Work Experience
          </label>
          <textarea
            id="experiences"
            value={experiences}
            onChange={(e) => setExperiences(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            rows={4}
            placeholder="Describe your professional experiences"
          />
          {formErrors.experiences && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.experiences}
            </p>
          )}
        </div>

        {/* Two columns for Hourly Rate and Portfolio Link */}
        <div className="">
          {/* Hourly Rate */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label
              htmlFor="hourlyRate"
              className="block text-gray-700 font-semibold mb-2"
            >
              Hourly Rate (৳)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">৳</span>
              <input
                type="number"
                id="hourlyRate"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full p-3 pl-7 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                min="1"
                step="0.01"
                placeholder="Your hourly rate"
              />
            </div>
            {formErrors.hourlyRate && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.hourlyRate}
              </p>
            )}
          </div>

          {/* Portfolio Link */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label
              htmlFor="portfolioLink"
              className="block text-gray-700 font-semibold mb-2"
            >
              Portfolio Link
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">🔗</span>
              <input
                type="text"
                id="portfolioLink"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Your portfolio URL (https://...)"
              />
            </div>
            {formErrors.portfolioLink && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.portfolioLink}
              </p>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-gray-700 font-semibold mb-3">
            Certifications & Credentials
          </label>
          <div className="flex mb-3">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Add certification link (https://...)"
            />
            <button
              type="button"
              onClick={addCertification}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          {formErrors.certifications && (
            <p className="text-red-500 text-sm mb-2">
              {formErrors.certifications}
            </p>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {certifications.length > 0 ? (
              certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                >
                  <a
                    href={cert}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline truncate"
                  >
                    {cert}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-3">
                No certifications added yet
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shadow-md transition-all"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating Profile...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

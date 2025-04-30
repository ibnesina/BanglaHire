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
  const parsedSkills = freelancerData?.skills ? 
    (typeof freelancerData.skills === 'string' ? 
      JSON.parse(freelancerData.skills) : 
      freelancerData.skills) : 
    [];
    
  const parsedCertifications = freelancerData?.certifications ?
    (typeof freelancerData.certifications === 'string' ? 
      JSON.parse(freelancerData.certifications) : 
      freelancerData.certifications) : 
    [];

  // Form state
  const [bio, setBio] = useState(freelancerData?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(
    freelancerData?.hourly_rate ? String(freelancerData.hourly_rate) : ""
  );
  const [experiences, setExperiences] = useState(freelancerData?.experiences || "");
  const [portfolioLink, setPortfolioLink] = useState(freelancerData?.portfolio_link || "");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(parsedSkills);
  const [certifications, setCertifications] = useState<string[]>(parsedCertifications);
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
      const skills = typeof freelancerData.skills === 'string' 
        ? JSON.parse(freelancerData.skills) 
        : (freelancerData.skills || []);
      setSelectedSkills(skills);
      
      // Parse certifications if it's a string
      const certs = typeof freelancerData.certifications === 'string'
        ? JSON.parse(freelancerData.certifications)
        : (freelancerData.certifications || []);
      setCertifications(certs);
    }
  }, [freelancerData]);

  // Handle form submission
  const updateProfile = useMutation({
    mutationFn: updateFreelancerProfileAPI,
    onSuccess: () => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['freelancer', userId] });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    }
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
      certifications:certifications,
      portfolio_link: portfolioLink
    });
  };

  const addCertification = () => {
    if (!newCertification.trim()) return;
    
    if (!newCertification.startsWith("http")) {
      setFormErrors({...formErrors, certifications: "Certificate link must be a valid URL"});
      return;
    }
    
    setCertifications([...certifications, newCertification]);
    setNewCertification("");
    setFormErrors({...formErrors, certifications: ""});
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading freelancer data: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Describe your expertise and experience"
          />
          {formErrors.bio && <p className="text-red-500 text-sm mt-1">{formErrors.bio}</p>}
        </div>
        
        {/* Category and Skills */}
        <div>
          <CategorySelectionOnFnd
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
          />
          {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
          {formErrors.skills && <p className="text-red-500 text-sm mt-1">{formErrors.skills}</p>}
        </div>
        
        {/* Experiences */}
        <div>
          <label htmlFor="experiences" className="block text-gray-700 font-medium mb-2">
            Experiences
          </label>
          <textarea
            id="experiences"
            value={experiences}
            onChange={(e) => setExperiences(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Describe your professional experiences"
          />
          {formErrors.experiences && <p className="text-red-500 text-sm mt-1">{formErrors.experiences}</p>}
        </div>
        
        {/* Hourly Rate */}
        <div>
          <label htmlFor="hourlyRate" className="block text-gray-700 font-medium mb-2">
            Hourly Rate ($)
          </label>
          <input
            type="number"
            id="hourlyRate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            min="1"
            step="0.01"
            placeholder="Your hourly rate"
          />
          {formErrors.hourlyRate && <p className="text-red-500 text-sm mt-1">{formErrors.hourlyRate}</p>}
        </div>
        
        {/* Certifications */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Certifications
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add certification link (https://...)"
            />
            <button
              type="button"
              onClick={addCertification}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          {formErrors.certifications && <p className="text-red-500 text-sm mb-2">{formErrors.certifications}</p>}
          
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <a href={cert} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                  {cert}
                </a>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Portfolio Link */}
        <div>
          <label htmlFor="portfolioLink" className="block text-gray-700 font-medium mb-2">
            Portfolio Link
          </label>
          <input
            type="text"
            id="portfolioLink"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your portfolio URL (https://...)"
          />
          {formErrors.portfolioLink && <p className="text-red-500 text-sm mt-1">{formErrors.portfolioLink}</p>}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
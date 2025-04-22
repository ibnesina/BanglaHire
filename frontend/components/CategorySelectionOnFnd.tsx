"use client";

import { Post } from '@/contracts/posts';
import React, { useEffect, useState } from 'react';

// Dummy data (categories with skills)
const categories = [
  {
    id: 1,
    name: "Web Development",
    skills: ["HTML", "CSS", "JavaScript", "React", "Angular", "Vue"]
  },
  {
    id: 2,
    name: "Mobile Development",
    skills: ["Android", "iOS", "React Native", "Flutter", "Kotlin", "Swift"]
  },
  {
    id: 3,
    name: "Design",
    skills: ["UI/UX", "Graphic Design", "Photoshop", "Illustrator", "Figma"]
  },
  {
    id: 4,
    name: "Data Science",
    skills: ["Python", "R", "Machine Learning", "Data Analysis", "SQL"]
  },
  {
    id: 5,
    name: "Digital Marketing",
    skills: ["SEO", "SEM", "Social Media", "Content Marketing", "Analytics"]
  }
];


/*
const posts = [
  {
    title: "Android App Tester for Multiple Devices",
    budget: "$10",
    description: "Eyta hobe description ekhane usfdgkfdgkdlsfjkdfjdskfjkdjkd",
    skills: ["skill 1", "skill 2", "skill 3", "skill 4"],
    client: "habibul pantho",
    date: "2025-03-22",
    file: "asd/fdsj/fdsj.doc",
    location: "Bangladesh",
    paymentVerified: true,
    bids: 4,
  },
  {
    title: "iOS Developer Needed for App Testing",
    budget: "$15",
    description:
      "Looking for an experienced iOS developer for app testing in multiple environments.",
    skills: ["skill 2", "skill 4", "skill 5"],
    client: "John Doe",
    date: "2025-03-21",
    file: "asd/fdsj/fdsj2.doc",
    location: "USA",
    paymentVerified: false,
    bids: 2,
  },
];
*/
function generateRandomPosts(count = 10) {
  const titles = [
    "Web Developer for E-commerce Site",
    "Mobile App UI Designer",
    "Full Stack Developer for SaaS Platform",
    "Content Writer for Tech Blog",
    "Data Analyst for Market Research",
    "WordPress Developer for Blog Setup",
    "Logo Designer for New Brand",
    "SEO Specialist for Website Optimization",
    "Video Editor for YouTube Channel",
    "Social Media Manager for Startup",
  ];
  
  const descriptions = [
    "Looking for an experienced professional to help with our project.",
    "Need someone who can deliver high-quality work on a tight deadline.",
    "Seeking a talented individual with proven expertise in this field.",
    "We need assistance with a complex project requiring specialized skills.",
    "Searching for a dedicated freelancer who can work independently.",
  ];
  
  const skillSets = [
    ["HTML", "CSS", "JavaScript", "React"],
    ["Python", "Django", "SQL", "AWS"],
    ["UI/UX", "Figma", "Adobe XD", "Sketch"],
    ["Content Writing", "SEO", "Research", "Editing"],
    ["Node.js", "Express", "MongoDB", "REST API"],
  ];
  
  const locations = ["Bangladesh", "USA", "India", "UK", "Canada", "Australia"];
  const clients = ["John Doe", "Jane Smith", "Alex Johnson", "Sam Wilson", "Emily Brown", "Michael Zhang"];
  
  return Array.from({ length: count }, () => {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30));
    
    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      budget: `$${Math.floor(Math.random() * 100) + 5}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      skills: skillSets[Math.floor(Math.random() * skillSets.length)],
      client: clients[Math.floor(Math.random() * clients.length)],
      date: randomDate.toISOString().split('T')[0],
      file: `document/file_${Math.floor(Math.random() * 1000)}.doc`,
      location: locations[Math.floor(Math.random() * locations.length)],
      paymentVerified: Math.random() > 0.3,
      bids: Math.floor(Math.random() * 10),
    };
  });
}

interface Category {
  id: number;
  name: string;
  skills: string[];
}

const CategorySelectionOnFnd = ({ setPosts }: { setPosts: (posts: Post[]) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(event.target.value);
    const category = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(category || null);
    setSelectedSkills([]); // Reset skills when category changes
    setError("");
  };

  const handleSkillChange = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
        setError("");
      } else {
        setError("You can select up to 5 skills only");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }
    if (selectedSkills.length === 0) {
      setError("Please select at least one skill");
      return;
    }
    
    setPosts(generateRandomPosts(5));
    // Here you would typically send the data to your API
  };


  useEffect(() => {
    setPosts(generateRandomPosts(5));
  }, []);
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Select Category and Skills</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Category:</label>
          <select 
            onChange={handleCategoryChange} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Skills: <span className="text-sm text-gray-500">(Select up to 5)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {selectedCategory.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`skill-${index}`}
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`skill-${index}`} className="text-gray-700">
                    {skill}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Submit
          </button>
          
          {selectedSkills.length > 0 && (
            <div className="text-sm text-gray-600">
              Selected: {selectedSkills.length}/5
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategorySelectionOnFnd;

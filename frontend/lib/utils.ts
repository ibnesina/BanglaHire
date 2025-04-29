import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}


export function generateRandomPosts(count = 10) {
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
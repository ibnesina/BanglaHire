import { User } from "./users";

export interface Post {
  title: string;
  budget: string;
  description: string;
  skills: string;
  client: string;
  date: string;
  file: string;
  location: string;
  paymentVerified: boolean;
  bids: number;
}

export interface Category {
  id: number;
  name: string;
  skills: string[];
}
export interface Freelancer {
  freelancer_id: string;
  bio: string;
  category_id: number;
  skills: string;
  experiences: string;
  hourly_rate: string;
  certifications: string;
  portfolio_link: string;
  created_at: string;
  updated_at: string;
  reviews_avg_rating: number | null;
  user: User;
}
export interface Bidding {
  id: number;
  project_id: number;
  freelancer_id: string;
  cover_letter: string | null;
  bidding_amount: string;
  created_at: string;
  updated_at: string;
  freelancer: Freelancer;
}

export interface MyBid {
  id: number;
  project_id: number;
  freelancer_id: string;
  cover_letter: string | null;
  bidding_amount: string;
  created_at: string;
  updated_at: string;
  project: {
    id: number;
    client_id: string;
    category_id: number;
    title: string;
    description: string;
    required_skills: string[];
    budget: string;
    status: string;
    assigned_freelancer_id: string | null;
    file: string | null;
    created_at: string;
    updated_at: string;
    client: {
      client_id: string;
      company_name: string;
      payment_method_verified: number;
      created_at: string;
      updated_at: string;
    };
    category: {
      id: number;
      name: string;
      skills: string[];
      created_at: string;
      updated_at: string;
    };
  };
}

export interface Assignment {
  id: number;
  project_id: number;
  client_id: string;
  freelancer_id: string;
  assigned_date: string;
  status: 'Assigned' | 'Submitted' | 'In Progress' | 'Completed' | 'Canceled';
  deadline: string;
  payment_amount: string;
  payment_status: 'Pending' | 'Released' | 'Failed' | 'Disputed';
  completion_date: string | null;
  review_id: number | null;
  created_at: string;
  updated_at: string;
  project: {
    id: number;
    client_id: string;
    category_id: number;
    title: string;
    description: string;
    required_skills: string[];
    budget: string;
    status: string;
    assigned_freelancer_id: string | null;
    file: string | null;
    created_at: string;
    updated_at: string;
  };
  client: {
    client_id: string;
    company_name: string;
    payment_method_verified: number;
    created_at: string;
    updated_at: string;
  };
  freelancer: {
    freelancer_id: string;
    bio: string;
    category_id: number;
    skills: string;
    experiences: string;
    hourly_rate: string;
    certifications: string;
    portfolio_link: string;
    created_at: string;
    updated_at: string;
  };
  review: {
    id: number;
    rating: number;
    comment: string | null;
  } | null;
}


export interface Work {
  id: number;
  client_id: string;
  category_id: number;
  title: string;
  description: string;
  required_skills: string[];
  budget: string;
  status: "Open" | "In Progress" | "Closed";
  assigned_freelancer_id: string | null;
  file: string | null;
  created_at: string;
  updated_at: string;
  client: {
    client_id: string;
    company_name: string;
    payment_method_verified: number;
    created_at: string;
    updated_at: string;
  };

  category: {
    id: number;
    name: string;
    skills: string[];
    created_at: string;
    updated_at: string;
  };
}

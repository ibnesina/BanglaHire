import { User } from "./users";

export interface TCategoryWithMatrix {
  id: number;
  name: string;
  skills: string[];
  created_at: string;
  updated_at: string;
  skill_count: number;
  avg_rating: number;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: string;
  gateway: string;
  payment_details: {
    account_no: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
  user: User;
}

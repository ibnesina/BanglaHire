
export interface User {
  id: string; // UUID
  type: "Admin" | "Freelancer" | "Client";
  email: string;
  name: string;
  profile_picture: string | null;
  payment_phone: string | null;
  balance: string; // decimal
  google_id: string | null;
  avatar: string | null;
  payment_history_id: number | null;
  nationality: string | null;
  email_verified_at: string | null; // datetime
  created_at: string; // datetime
  updated_at: string; // datetime
}
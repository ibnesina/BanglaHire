import { z } from "zod";

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

export const userRegistrationSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    password_confirmation: z.string(),
    type: z.enum(["Freelancer", "Client"]),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type TUserRegistrationSchema = z.infer<typeof userRegistrationSchema>;

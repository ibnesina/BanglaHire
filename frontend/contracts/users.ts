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
  
  // company?: string | null;
  // averageRating?: number | null;
  // totalSpending?: string | null;
  // totalPosts?: number | null;
  // ongoingProjects?: number | null;
  // paymentVerified?: boolean | null;
}

export interface Freelancer {
  freelancer_id: string;
  bio: string | null;
  category_id: number | null;
  skills: string[];
  experiences: string | null;
  hourly_rate: number | null;
  certifications: string[];
  portfolio_link: string | null;
  created_at: string;
  updated_at: string;
  reviews_avg_rating?: number | null;
  user: User;
}

export const userRegistrationSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .nonempty("Password is required"),
    password_confirmation: z.string().nonempty("Confirm your password"),
    type: z.enum(["Freelancer", "Client"]),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type TUserRegistrationSchema = z.infer<typeof userRegistrationSchema>;

export const userSignInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

export type TUserSignInSchema = z.infer<typeof userSignInSchema>;

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    old_password: z.string().nonempty("Old password is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .nonempty("New password is required"),
    password_confirmation: z.string().nonempty("Confirm your new password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const passwordChangeSchema = z
  .object({
    token: z.string().nonempty("Token is required"),
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .nonempty("Password is required"),
    password_confirmation: z.string().nonempty("Confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type TPasswordChangeSchema = z.infer<typeof passwordChangeSchema>;

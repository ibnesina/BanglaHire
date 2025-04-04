"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formDataSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  passwordConfirmation: z.string(),
  type: z.enum(["Freelancer", "Client"]),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type FormData = z.infer<typeof formDataSchema>;

export default function Signup() {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: async (values, context, options) => {
      try {
        const result = await formDataSchema.parseAsync(values);
        return { values: result };
      } catch (error) {
        return { errors: error.flatten() };
      }
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    <motion.div
      className="h-screen overflow-scroll flex flex-col items-center justify-center bg-gradient-to-r from-sky-500 to-sky-700"
    >
      <div className="text-5xl font-bold text-white mb-6">
        <span className="text-teal-400">B</span>angla
        <span className="text-teal-400">H</span>ire
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Sign up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="password-confirmation"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password-confirmation"
              {...register("passwordConfirmation")}
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            Sign up
          </button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?
            <Link href="/signin">
              <p className="text-blue-500 hover:underline">Sign in</p>
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
}


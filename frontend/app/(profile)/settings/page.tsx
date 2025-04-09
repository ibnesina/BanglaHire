"use client";

import { resetPasswordSchema, TResetPasswordSchema } from "@/contracts/users";
import { resetPasswordAPI } from "@/lib/api/authAPI";
import userStore from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Settings = observer(() => {
  const [loading, setLoading] = useState(false);
  const user = userStore.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: user?.email,
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: TResetPasswordSchema) => {
    setLoading(true);
    try {
      await resetPasswordAPI(data);
    } finally {
      setLoading(false);
    }
  };
  const inputFieldDesign =
    "block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring";
  return (
    <div className="flex w-[60%] mx-auto my-10">
      <aside className="w-64 bg-gray-200 p-4">
        <ul>
          <li className="font-bold">Settings</li>
          <li>Password</li>
          {/* Add more settings options here */}
        </ul>
      </aside>
      <main className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              className={inputFieldDesign}
              value={user?.email}
              readOnly
              {...register("email")}
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="oldPassword"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              {...register("old_password")}
              className={inputFieldDesign}
            />
            {errors.old_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.old_password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              {...register("password")}
              className={inputFieldDesign}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="confirmNewPassword"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              {...register("password_confirmation")}
              className={inputFieldDesign}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "cursor-not-allowed" : ""
            } px-4 py-2 bg-blue-500 text-white rounded-md`}
          >
            {loading ? "Wait..." : "Change Password"}
          </button>
        </form>
      </main>
    </div>
  );
});

export default Settings;

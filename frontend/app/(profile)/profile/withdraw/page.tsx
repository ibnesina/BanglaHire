"use client";

import { createWithdrawRequest } from "@/lib/api/withdrawAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const withdrawSchema = z.object({
  amount: z.number().positive(),
  gateway: z.enum(["stripe", "sslcommerz", "bkash"]),
  payment_details: z.string(),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

export default function WithdrawPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
  });

  const withdrawMutation = useMutation({
    mutationFn: createWithdrawRequest,
    onSuccess: () => {
      toast.success("Withdraw request submitted successfully");
      setLoading(false);
      // Clear the form
      reset();

    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit withdraw request");
      setLoading(false);
    },
  });

  const onSubmit = (data: WithdrawFormValues) => {
    setLoading(true);
    withdrawMutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
  <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">Withdraw Funds</h1>
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Amount
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">৳</span>
        <input
          type="number"
          {...register("amount", { valueAsNumber: true })}
          className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter amount"
        />
      </div>
      {errors.amount && (
        <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>
      )}
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Gateway
      </label>
      <select
        {...register("gateway")}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Select a gateway</option>
        <option value="stripe">Stripe</option>
        <option value="sslcommerz">SSLCommerz</option>
        <option value="bkash">bKash</option>
      </select>
      {errors.gateway && (
        <p className="mt-2 text-sm text-red-600">{errors.gateway.message}</p>
      )}
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Payment Details
      </label>
      <textarea
        {...register("payment_details")}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter payment details as JSON"
        rows={4}
      />
      {errors.payment_details && (
        <p className="mt-2 text-sm text-red-600">{errors.payment_details.message}</p>
      )}
    </div>
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        "Submit Withdraw Request"
      )}
    </button>
  </form>
</div>
  );
}

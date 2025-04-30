"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createWithdrawRequestAPI } from "@/lib/api/withdrawAPI";
import { Banknote, CreditCard, Wallet } from "lucide-react";

const withdrawSchema = z.object({
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  gateway: z.enum(["stripe", "sslcommerz", "bkash"], {
    required_error: "Please select a payment gateway",
  }),
  account_no: z.string().min(1, "Account number is required"),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

export default function WithdrawPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 0,
      gateway: "stripe",
      account_no: "",
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number; gateway: string; payment_details: { account_no: string } }) => 
      createWithdrawRequestAPI(data.amount, data.gateway, data.payment_details.account_no),
    onSuccess: () => {
      toast.success("Withdrawal request submitted successfully");
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to submit withdrawal request");
      console.error(error);
    },
  });

  const onSubmit = (data: WithdrawFormValues) => {
    setIsLoading(true);
    
    withdrawMutation.mutate({
      amount: data.amount,
      gateway: data.gateway,
      payment_details: {
        account_no: data.account_no,
      },
    }, {
      onSettled: () => setIsLoading(false),
    });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
          </div>
          <p className="text-blue-100 mt-2">Request to withdraw your available balance</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`pl-10 w-full h-12 border ${form.formState.errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  {...form.register("amount", { 
                    valueAsNumber: true,
                  })}
                />
              </div>
              {form.formState.errors.amount && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.amount.message}</p>
              )}
              <p className="text-gray-500 text-sm">Enter the amount you wish to withdraw</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Gateway
              </label>
              <div className="relative">
                <select
                  className={`w-full h-12 pl-3 pr-10 border ${form.formState.errors.gateway ? 'border-red-500' : 'border-gray-300'} rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  {...form.register("gateway")}
                >
                  <option value="stripe">Stripe</option>
                  <option value="sslcommerz">SSLCommerz</option>
                  <option value="bkash">bKash</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {form.formState.errors.gateway && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.gateway.message}</p>
              )}
              <p className="text-gray-500 text-sm">Choose your preferred payment method</p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter your account number"
                  className={`pl-10 w-full h-12 border ${form.formState.errors.account_no ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  {...form.register("account_no")}
                />
              </div>
              {form.formState.errors.account_no && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.account_no.message}</p>
              )}
              <p className="text-gray-500 text-sm">Enter the account number for receiving funds</p>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70"
            >
              {isLoading ? "Processing..." : "Submit Withdrawal Request"}
            </button>
            
            <div className="text-xs text-gray-500 text-center mt-4 px-4 py-3 bg-gray-50 rounded-lg">
              A 2% processing fee will be applied to all withdrawals
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

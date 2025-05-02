"use client";

import apiRequest from "@/lib/api/apiRequest";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AddBalancePage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"sslcommerz" | "stripe">("sslcommerz");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, status } = await apiRequest({
        method: "POST",
        url: "/add-balance",
        data: { amount: parseFloat(amount), payment_method: method },
      });
      if (status === 201 && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error(data.message || "Failed to initiate payment");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl relative">
        {/* Enhanced decorative elements */}
        <div className="absolute -left-24 -top-24 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: "2s"}}></div>
        <div className="absolute left-1/2 top-1/3 w-60 h-60 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: "3s"}}></div>
        
        <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border border-white/30 overflow-hidden">
          {/* Header with enhanced gradient */}
          <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-8 py-8 text-white">
            <h2 className="text-3xl font-extrabold tracking-tight text-center drop-shadow-sm">
              Add Balance
            </h2>
            <p className="text-blue-100 text-center mt-3 font-medium">Secure payment processing with industry-leading providers</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {/* Amount input with enhanced animation */}
            <div className="group">
              <label htmlFor="amount" className="block mb-3 text-lg font-semibold text-gray-800">
                Amount (BDT)
              </label>
              <div className="flex transition-all duration-300 group-focus-within:ring-4 group-focus-within:ring-indigo-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md">
                <span className="inline-flex items-center px-5 border-y border-l border-gray-300 bg-gradient-to-b from-indigo-50 to-indigo-100 text-indigo-800 text-xl font-bold rounded-l-xl">
                  ৳
                </span>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 border border-gray-300 px-5 py-5 text-lg focus:outline-none focus:border-indigo-400 rounded-r-xl"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Payment Method with enhanced hover effects */}
            <fieldset className="space-y-4">
              <legend className="block mb-3 text-lg font-semibold text-gray-800">
                Payment Method
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="cursor-pointer transform transition-transform duration-300 hover:scale-105">
                  <input
                    type="radio"
                    name="payment_method"
                    value="sslcommerz"
                    checked={method === "sslcommerz"}
                    onChange={() => setMethod("sslcommerz")}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center space-x-3 py-6 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                    method === "sslcommerz"
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white text-gray-800 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md"
                  }`}>
                    <ShieldCheck className={`w-7 h-7 ${method === "sslcommerz" ? "text-indigo-200" : "text-indigo-600"}`} />
                    <span>SSLCOMMERZ</span>
                  </div>
                </label>

                <label className="cursor-pointer transform transition-transform duration-300 hover:scale-105">
                  <input
                    type="radio"
                    name="payment_method"
                    value="stripe"
                    checked={method === "stripe"}
                    onChange={() => setMethod("stripe")}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-center space-x-3 py-6 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                    method === "stripe"
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white text-gray-800 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md"
                  }`}>
                    <CreditCard className={`w-7 h-7 ${method === "stripe" ? "text-indigo-200" : "text-indigo-600"}`} />
                    <span>Stripe</span>
                  </div>
                </label>
              </div>
            </fieldset>

            {/* Enhanced security note */}
            <div className="flex items-center space-x-3 text-sm text-gray-700 bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <p className="font-medium">Your payment information is processed securely. We do not store your card details.</p>
            </div>

            {/* Enhanced submit button with animation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 transform transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <CreditCard className="w-7 h-7" />
              )}
              <span>{loading ? "Processing..." : "Continue to Payment"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

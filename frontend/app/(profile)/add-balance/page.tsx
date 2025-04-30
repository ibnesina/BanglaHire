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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Added py-24 for top/bottom padding */}
      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="relative w-full max-w-2xl p-12 bg-white bg-opacity-40 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>

          <h2 className="relative text-4xl font-extrabold text-blue-800 text-center mb-10">
            Add Balance
          </h2>

          <form onSubmit={handleSubmit} className="relative space-y-10">
            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block mb-2 text-lg font-medium text-gray-800"
              >
                Amount (BDT)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-200 text-gray-700 text-lg">
                  ৳
                </span>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-r-lg px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <fieldset>
              <legend className="block mb-4 text-lg font-medium text-gray-800">
                Payment Method
              </legend>
              <div className="grid grid-cols-2 gap-6">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="sslcommerz"
                    checked={method === "sslcommerz"}
                    onChange={() => setMethod("sslcommerz")}
                    className="sr-only"
                  />
                  <div
                    className={`flex items-center justify-center space-x-3 py-4 px-6 border rounded-2xl text-lg font-semibold transition ${
                      method === "sslcommerz"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <ShieldCheck className="w-6 h-6" />
                    <span>SSLCOMMERZ</span>
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="stripe"
                    checked={method === "stripe"}
                    onChange={() => setMethod("stripe")}
                    className="sr-only"
                  />
                  <div
                    className={`flex items-center justify-center space-x-3 py-4 px-6 border rounded-2xl text-lg font-semibold transition ${
                      method === "stripe"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span>Stripe</span>
                  </div>
                </label>
              </div>
            </fieldset>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:opacity-90 transition cursor-pointer"
            >
              <CreditCard className="w-6 h-6" />
              <span>{loading ? "Please wait…" : "Continue to Payment"}</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

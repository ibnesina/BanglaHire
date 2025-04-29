"use client";

import { useState } from "react";
import { toast } from "sonner";
import apiRequest from "@/lib/api/apiRequest";
import NavBar from "@/components/navComponents/NavBar";
import Footer from "@/components/Footer";

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
        // Redirect browser to the payment gateway
        window.location.href = data.checkout_url;
      } else {
        toast.error(data.message || "Failed to initiate payment");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="bg-white shadow-2xl rounded-2xl p-12 max-w-2xl w-full mx-4">
          <h2 className="text-4xl font-extrabold text-blue-700 text-center mb-10">
            Add Balance
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block mb-3 text-lg font-medium text-gray-800">
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
                  className="flex-1 border border-gray-300 rounded-r-lg px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <span className="block mb-3 text-lg font-medium text-gray-800">Payment Method</span>
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
                    className={`py-4 border rounded-lg text-center text-lg font-semibold transition ${
                      method === "sslcommerz"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    SSLCOMMERZ
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
                    className={`py-4 border rounded-lg text-center text-lg font-semibold transition ${
                      method === "stripe"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    Stripe
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-semibold hover:opacity-90 transition"
            >
              {loading ? "Please wait…" : "Continue to Payment"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

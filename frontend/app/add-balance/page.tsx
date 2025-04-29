"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiRequest from "@/lib/api/apiRequest";

export default function AddBalancePage() {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<"stripe"|"sslcommerz">("stripe");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (amount < 1) {
      toast.error("Amount must be at least 1");
      return;
    }
    setLoading(true);

    const { data, status } = await apiRequest({
      method: "POST",
      url: "/add-balance",
      data: { amount, payment_method: method },
    });

    setLoading(false);
    if (status === 201 && data.checkout_url) {
      // redirect browser
      window.location.href = data.checkout_url;
    } else {
      toast.error(data.message || "Failed to start payment");
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Add Balance</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Amount (BDT)</label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={e => setAmount(+e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label>Method</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value as any)}
            className="w-full border p-2"
          >
            <option value="stripe">Credit Card (Stripe)</option>
            <option value="sslcommerz">SSLCommerz</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing…" : "Continue"}
        </button>
      </form>
    </div>
  );
}

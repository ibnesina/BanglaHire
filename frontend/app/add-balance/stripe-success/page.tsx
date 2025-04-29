"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import apiRequest from "@/lib/api/apiRequest";

export default function StripeSuccess() {
  const params = useSearchParams();
  const session_id = params.get("session_id");

  useEffect(() => {
    if (!session_id) return;
    (async () => {
      const { data, status } = await apiRequest({
        method: "GET",
        url: "/add-balance/stripe-success",
        params: { session_id },
      });
      if (status === 200) {
        toast.success(`Added ${data.amount} ${data.currency}!`);
      } else {
        toast.error(data.message || "Verification failed");
      }
    })();
  }, [session_id]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl">Verifying payment…</h2>
      <p>Please wait.</p>
    </div>
  );
}

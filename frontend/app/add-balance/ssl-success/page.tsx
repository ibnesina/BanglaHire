"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import apiRequest from "@/lib/api/apiRequest";

export default function SSLSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const tran_id = params.get("tran_id");

  useEffect(() => {
    if (!tran_id) return;
    (async () => {
      // gather all query params into an object
      const data = Object.fromEntries(params.entries());
      const { data: resp, status } = await apiRequest({
        method: "POST",
        url: "/add-balance/ssl-success",
        data,
      });
      if (status === 200) {
        toast.success(`Added ${resp.amount} ${resp.currency}!`);
      } else {
        toast.error(resp.message || "Verification failed");
      }
    })();
  }, [tran_id]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl">Verifying SSLCommerz…</h2>
      <p>Please wait.</p>
    </div>
  );
}

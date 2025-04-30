"use client";

import { Loader } from "@/components/ui/loader";
import {
  getWithdrawRequestsAPI,
  approveWithdrawRequestAPI,
  rejectWithdrawRequestAPI,
} from "@/lib/api/withdrawAPI";
import { formatDate } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { WithdrawalRequest } from "@/contracts/types";
import { toast } from "sonner";

export default function WithdrawalListPage() {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: getWithdrawRequestsAPI,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveWithdrawRequestAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      toast.success("Withdrawal request approved successfully");
    },
    onError: () => {
      toast.error("Failed to approve withdrawal request");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectWithdrawRequestAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      toast.success("Withdrawal request rejected successfully");
    },
    onError: () => {
      toast.error("Failed to reject withdrawal request");
    },
  });

  if (isPending) return <Loader />;

  return (
    <div>
      {data && data.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Your Withdrawal Requests</h2>
          <div className="grid gap-4">
            {data.map((withdrawal: WithdrawalRequest) => (
              <div
                key={withdrawal.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-lg">
                      ৳{parseFloat(withdrawal.amount).toFixed(2)}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    withdrawal.status === "approved" 
                      ? "bg-green-100 text-green-800" 
                      : withdrawal.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {withdrawal.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Gateway:{" "}
                      <span className="font-medium capitalize">
                        {withdrawal.gateway}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Account:{" "}
                      <span className="font-medium">
                        {withdrawal.payment_details.account_no}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Date:{" "}
                      <span className="font-medium">
                        {formatDate(withdrawal.created_at)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Last Updated:{" "}
                      <span className="font-medium">
                        {formatDate(withdrawal.updated_at)}
                      </span>
                    </span>
                  </div>
                </div>

                {withdrawal.status === "pending" && (
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        approveMutation.mutate(withdrawal.id);
                        setTimeout(() => {
                          window.location.reload();
                        }, 500);
                      }}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        rejectMutation.mutate(withdrawal.id);
                        setTimeout(() => {
                          window.location.reload();
                        }, 500);
                      }}
                      disabled={rejectMutation.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            You don&apos;t have any withdrawal requests yet.
          </p>
        </div>
      )}
    </div>
  );
}

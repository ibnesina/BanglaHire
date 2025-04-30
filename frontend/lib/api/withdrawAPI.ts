import { toast } from "sonner";
import apiRequest from "./apiRequest";

export const getWithdrawRequestsAPI = async () => {
  const response = await apiRequest({
    method: "GET",
    url: "/withdraw-requests",
  });
  if (response.status === 200) {
    return response.data.withdrawals;
  } else {
    toast.error(response.data.message);
    return null;
  }
};

 

export const createWithdrawRequestAPI = async (
  amount: number,
  gateway: string,
  account_no: string,
) => {
  const response = await apiRequest({
    method: "POST",
    url: "/withdraw-requests",
    data: {
      amount,
      gateway,
      payment_details: {
        account_no,
      },
    },
  });
  if (response.status === 200) {
    toast.success("Withdraw request created successfully");
    return response.data;
  } else {
    toast.error(response.data.message);
    return null;
  }
};

export const approveWithdrawRequestAPI = async (id: string) => {
  const response = await apiRequest({
    method: "POST",
    url: `/withdraw-requests/${id}/approve`,
  });
  if (response.status === 200) {
    toast.success("Withdraw request approved");
    return true;
  } else {
    toast.error(response.data.message);
    return false;
  }
};

export const rejectWithdrawRequestAPI = async (id: string) => {
  const response = await apiRequest({
    method: "POST",
    url: `/withdraw-requests/${id}/reject`,
  });
  if (response.status === 200) {
    toast.success("Withdraw request rejected");
    return true;
  } else {
    toast.error(response.data.message);
    return false;
  }
};

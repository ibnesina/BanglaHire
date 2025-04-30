import { toast } from "sonner";
import apiRequest from "./apiRequest";

export const getWithdrawRequests = async () => {
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

export const getWithdrawRequest = async (id: string) => {
  const response = await apiRequest({
    method: "GET",
    url: `/withdraw-requests/${id}`,
  });
  if (response.status === 200) {
    return response.data.withdraw_request;
  } else {
    toast.error(response.data.message);
    return null;
  }
};

export const createWithdrawRequest = async (data: {
  amount: number;
  gateway: string;
  payment_details: object;
}) => {
  const response = await apiRequest({
    method: "POST",
    url: "/withdraw-requests",
    data,
  });
  if (response.status === 200) {
    toast.success("Withdraw request created successfully");
    return response.data;
  } else {
    toast.error(response.data.message);
    return null;
  }
};

export const approveWithdrawRequest = async (id: string) => {
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

export const rejectWithdrawRequest = async (id: string) => {
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

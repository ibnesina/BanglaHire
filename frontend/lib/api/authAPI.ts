import { toast } from "sonner";

import apiRequest from "./apiRequest";
import userStore from "../store";

export const signupAPI = async (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type: string;
}) => {
  const response = await apiRequest({ method: "POST", url: `/register`, data });
  if (response.status === 201) {
    userStore.setUser(response.data.user, response.data.token);
    localStorage.setItem("token", response.data.token);
    toast(response.data.message);
    // window.location.href = "/";
  } else {
    toast(response.data.message);
  }
};

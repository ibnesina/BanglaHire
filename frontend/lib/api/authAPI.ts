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
  console.log(response.message);
  if (response.status === 201) {
    userStore.setUser(response.user, response.token);
    localStorage.setItem("token", response.token);
    alert(response.message);
    // window.location.href = "/";
  } else {
    alert(response.message);
  }
};

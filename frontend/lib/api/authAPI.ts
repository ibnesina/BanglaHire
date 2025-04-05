import { toast } from "sonner";
import userStore from "../store";
import apiRequest from "./apiRequest";
import { TUserRegistrationSchema, TUserSignInSchema } from "@/contracts/users";

export const signupAPI = async (data: TUserRegistrationSchema) => {
  const response = await apiRequest({ method: "POST", url: `/register`, data });

  if (response.status === 201) {
    userStore.setUser(response.user, response.token);
    localStorage.setItem("token", response.token);
    toast.success(response.message);
    // window.location.href = "/";
  } else {
    toast.error(response.message);
  }
};

export const signInAPI = async (data: TUserSignInSchema) => {
  const response = await apiRequest({
    method: "POST",
    url: "/login",
    data,
  });

  if (response.status == 403) {
    toast.info(response.message);
  } else if (response.status == 200) {
    userStore.setUser(response.user, response.token);
    localStorage.setItem("token", response.token);
    toast.success(response.message);
  } else {
    toast.error(response.message);
  }
};

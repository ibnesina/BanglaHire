import { toast } from "sonner";
import userStore from "../store";
import apiRequest from "./apiRequest";
import { TUserRegistrationSchema, TUserSignInSchema } from "@/contracts/users";
import { redirect } from "next/navigation";

export const signupAPI = async (data: TUserRegistrationSchema) => {
  const response = await apiRequest({ method: "POST", url: `/register`, data });

  if (response.status === 201) {
    userStore.setUser(response.user, response.token);
    toast.success(response.message);
    redirect("/login");
  } else if (response.status === 422) {
    toast.info(response.message);
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
    // forbidden error
    toast.info(response.message);
  } else if (response.status == 200) {
    userStore.setUser(response.user, response.token);
    toast.success(response.message);
    setTimeout(() => {
      redirect("/");
    }, 1000);
  } else {
    toast.error(response.message);
  }
};

export const getMeAPI = async () => {
  const response = await apiRequest({ method: "GET", url: "/me" });
  if (response.status === 200) {
    return response;
  }
  toast.error(response.message);
};


export const logoutAPI = async () => {
  const response = await apiRequest({ method: "POST", url: "/logout" });
  if (response.status === 200) {
    userStore.clearUser();
    toast.success(response.message);
    redirect("/signin");
  } else {
    toast.error(response.message);
  }
};


import {
  TPasswordChangeSchema,
  TResetPasswordSchema,
  TUserRegistrationSchema,
  TUserSignInSchema,
} from "@/contracts/users";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import userStore from "../store";
import apiRequest from "./apiRequest";

export const signupAPI = async (data: TUserRegistrationSchema) => {
  const response = await apiRequest({ method: "POST", url: `/register`, data });

  if (response.status === 201) {
    userStore.setUser(response.data.user);
    userStore.setToken(response.data.token);
    toast.success(response.data.message);
    redirect("/signin");
  } else if (response.status === 422) {
    toast.info(response.data.message);
  } else {
    toast.error(response.data.message);
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
    toast.info(response.data.message);
  } else if (response.status == 200) {
    userStore.setUser(response.data.user);
    userStore.setToken(response.data.token);
    toast.success(response.data.message);
    setTimeout(() => {
      redirect("/");
    }, 1000);
  } else {
    toast.error(response.data.message);
  }
};

export const getMeAPI = async () => {
  const response = await apiRequest({ method: "GET", url: "/me" });
  if (response.status === 200) {
    return response.data;
  }
  toast.error(response.data.message);
};

export const logoutAPI = async () => {
  const response = await apiRequest({ method: "POST", url: "/logout" });
  if (response.status === 200) {
    userStore.clearUser();
    toast.success(response.data.message);
    redirect("/signin");
  } else {
    toast.error(response.data.message);
  }
};

export const resetPasswordAPI = async (data: TResetPasswordSchema) => {
  const response = await apiRequest({
    method: "POST",
    url: "/reset-password",
    data,
  });
  console.log(response);
  if (response.status === 200) {
    toast.success(response.data.message);
  } else {
    toast.error(response.data.message);
  }
};

export const forgotPasswordAPI = async (email: string) => {
  const response = await apiRequest({
    method: "POST",
    url: "/forgot-password",
    data: { email },
  });
  if (response.status === 200) {
    toast.success(response.data.message);
  } else {
    toast.error(response.data.message ?? "Unable to send reset password link");
  }
};

export const passwordChangeAPI = async (data: TPasswordChangeSchema) => {
  const response = await apiRequest({
    method: "POST",
    url: "/password/change",
    data,
  });
  if (response.status === 200) {
    toast.success(response.data.message);
    setTimeout(() => {
      redirect("/signin");
    }, 2000);
  } else {
    toast.error(response.data.message);
  }
};

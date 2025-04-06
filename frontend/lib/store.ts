"use client";

import { User } from "@/contracts/users";
import { makeAutoObservable } from "mobx";
import { toast } from "sonner";
import { getMeAPI } from "./api/authAPI";

class UserStore {
  user: User | null | undefined;
  token: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.token = localStorage.getItem("token");

    if (this.token) {
      this.getUserData();
    }
  }

  async getUserData() {
    try {
      const response = await getMeAPI();
      this.user = response;
    } catch (error) {
      toast.error("Failed to get user data:", error || "");
    }
  }

  setUser(user: User, token: string) {
    this.user = user;
    this.token = token;
    localStorage.setItem("token", token);
  }

  clearUser() {
    this.user = null;
    this.token = null;
    localStorage.removeItem("token");
  }
}

const userStore = new UserStore();
export default userStore;

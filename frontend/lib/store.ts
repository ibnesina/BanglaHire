"use client";

import { User } from "@/contracts/users";
import { makeAutoObservable } from "mobx";
import { toast } from "sonner";
import { getMeAPI } from "./api/authAPI";

class UserStore {
  user: User | null | undefined=undefined;
  token: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.token = localStorage.getItem("token");
    console.log(this.user);
    this.user = this.token ? this.getUserData() as unknown as User : null;
    console.log(this.user);
  }

  async getUserData() {
    try {
      const response = await getMeAPI();
      console.log(response);
      return await response as User;
    } catch (error) { 
      toast.error("Failed to get user data:", error || "");
      return null;
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

"use client";

import { User } from "@/contracts/users";
import { makeAutoObservable } from "mobx";

class UserStore {
  user: User | null | undefined = undefined;
  token: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User|null) {
    this.user = user;
  }

  setToken(token: string | null) {
    this.token = token;
    if (window !== undefined && token) localStorage.setItem("token", token);
  }

  clearUser() {
    this.user = null;
    this.token = null;
    if (window !== undefined) localStorage.removeItem("token");
  }
}

const userStore = new UserStore();
export default userStore;

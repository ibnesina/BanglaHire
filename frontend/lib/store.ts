import { User } from "@/contracts/users";
import { makeAutoObservable } from "mobx";

class UserStore {
  user: User | null = null;
  token: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User, token: string) {
    this.user = user;
    this.token = token;
  }

  clearUser() {
    this.user = null;
    this.token = null;
  }
}

const userStore = new UserStore();
export default userStore;

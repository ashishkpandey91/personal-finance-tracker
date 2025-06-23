import { Account, ID, Models } from "appwrite";
import { handleError } from "@/utils/errorHandler";
import AppClient from "../client";
import { Service } from "@/type/services";
import { AppUser } from "@/type/user";

class AuthService extends AppClient {
  account: Account;

  constructor() {
    super();
    this.account = new Account(this.client);
  }

  // Method for create account
  async singup(
    email: string,
    password: string,
    name: string
  ): Promise<Service<Models.User<Models.Preferences>>> {
    try {
      const res = await this.account.create(ID.unique(), email, password, name);
      return { data: res, error: null };
    } catch (error) {
      return handleError(error);
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<Service<Models.Session>> {
    try {
      const res = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return { data: res, error: null };
    } catch (error) {
      return handleError(error);
    }
  }

  async logout(): Promise<Service<boolean>> {
    try {
      await this.account.deleteSessions();
      return { data: true, error: null };
    } catch (error) {
      return handleError(error);
    }
  }

  async getCurrentUser(): Promise<Service<AppUser>> {
    try {
      const user = await this.account.get();
      return { data: user, error: null };
    } catch (error) {
      return handleError(error);
    }
  }
}

export const authService = new AuthService();
export default authService;

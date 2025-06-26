import { handleError } from "@/utils/errorHandler";
import axios from "axios";

const BASE_URL = "http://localhost:3001/v1/api/auth";

const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      return { data: response.data, error: null };
    } catch (error: any) {
      return handleError(error);
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/signup`,
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      return { data: response.data, error: null };
    } catch (error: any) {
      return handleError(error);
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return { data: null, error: "No token found" };
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return handleError(error);
    }
  },
};

export default authService;

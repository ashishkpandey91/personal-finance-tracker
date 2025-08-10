import CONF from "@/conf";
import { handleError } from "@/utils/errorHandler";
import axios from "axios";

const BASE_URL = `${CONF.get("API_BASE_URL")}/auth`;

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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      return handleError(error);
    }
  },
};

export default authService;
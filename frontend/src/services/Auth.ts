import axios from "axios";

const BASE_URL = "http://localhost:3001/v1/api/auth";

const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response.data };
    }
  },
  signup: async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/signup`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store JWT token if returned
      localStorage.setItem("token", response.data.token);

      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data || { message: "Signup failed" } };
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return { data: null };
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data };
    } catch {
      return { data: null };
    }
  },
};

export default authService;

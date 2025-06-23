import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Import createBrowserRouter and RouterProvider
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import store from "./store/store.ts";
import { Provider } from "react-redux";
import AuthLayout from "./components/AuthLayout.tsx";
import Index from "./pages/Index.tsx";
import LoginPage from "./pages/Login.tsx";
import SignupPage from "./pages/Signup.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication>
            <Index />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignupPage />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </StrictMode>
);

import { useEffect, useState } from "react";
import { authService } from "@/appwrite/services/Auth";
import { login, logout } from "@/features/authSlice";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "@/store/hook";
import { CircleUser} from "lucide-react";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(({ data }) => {
        if (data) {
          // console.log("user data: ", data);
          dispatch(login(data));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <main className=" flex flex-col items-center justify-center align-middle w-full min-h-screen">
      <Outlet />
    </main>
  ) : null;
}

export default App;

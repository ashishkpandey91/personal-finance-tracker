import authService from "@/services/Auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAppDispatch } from "@/store/hook";
import { login } from "@/features/authSlice";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async () => {
    const { error, data } = await authService.login(email, password);
    if (data) {
      const userRes = await authService.getCurrentUser();
      if (userRes.data) {
        dispatch(login(userRes.data));
      }
      navigate("/");
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Card className="w-full mx-3 md:w-[450px]">
      <CardHeader>
        <CardTitle className="text-center text-xl pt-3">Login</CardTitle>
        <CardDescription className="text-center text-sm">
          Don't have an account?{" "}
          <Link className="font-semibold" to={"/signup"}>
            Sign up
          </Link>{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="user_email">Email:</Label>
              <Input
                id="user_email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="user_password">Password:</Label>
              <Input
                id="user_password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center ">
        <Button
          className="w-full tracking-wide"
          disabled={loading}
          onClick={onSubmit}
          type="submit"
          // loading={loading}
        >
          Sing In
        </Button>
      </CardFooter>
    </Card>
  );
}

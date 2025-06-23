import authService from "@/appwrite/services/Auth";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hook";
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
import { login } from "@/features/authSlice";
import Loader from "@/components/Loader";

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit = async () => {
    if (!email || !password) {
      console.log("no email password");
      return;
    }

    setLoading(true);
    const { error, data } = await authService.singup(email, password, name);
    if (data) {
      dispatch(login(data));
      navigate("/");
    }
    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Account created",
    });
  };

  return (
    <Card className="w-full mx-3 md:w-[450px]">
      <CardHeader>
        <CardTitle className="text-center text-xl pt-3">
          Sign up to create account
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Already have an account?{" "}
          <Link className="font-semibold hover:text-emerald-600" to={"/login"}>
            Sign in
          </Link>{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="user_name">Name:</Label>
              <Input
                type="text"
                id="user_name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
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
          className="w-full tracking-wide bg-emerald-600 hover:bg-emerald-700"
          disabled={loading}
          onClick={onSubmit}
          type="submit"
        >
          {loading ? <Loader /> : "Sign up"}
        </Button>
      </CardFooter>
    </Card>
  );
}

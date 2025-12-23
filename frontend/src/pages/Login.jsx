import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { login } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-[url('https://plus.unsplash.com/premium_photo-1682130157004-057c137d96d5?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <Card className="w-[360px] bg-white/85">
        <CardHeader>
          <CardTitle className="font-bold">Clinic Login</CardTitle>
          <CardDescription className="text-center p-5 bg-muted rounded-lg">Please use doctor credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@gmail.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="12345" />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


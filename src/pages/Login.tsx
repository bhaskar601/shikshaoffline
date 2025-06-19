import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { BookOpen } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !password) {
      toast({
        title: "Error",
        description: "Please enter ID and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const url =
        role === "student"
          ? "http://192.168.0.100:5000/students/login"
          : "http://192.168.0.100:5000/teachers/login";

      const payload =
        role === "student"
          ? { studentId: id, password }
          : { teacherId: id, password };

      const response = await axios.post(url, payload);

      if (role === "teacher") {
        // ✅ Store teacher data in cookie
        Cookies.set("teacher", JSON.stringify(response.data), {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
      } else {
        // ✅ Store student data in localStorage
        localStorage.setItem("student", JSON.stringify(response.data));
      }

      toast({
        title: "Success",
        description: `${
          role === "student" ? "Student" : "Teacher"
        } login successful`,
      });

      // ✅ Redirect
      navigate(role === "student" ? "/student" : "/teacher");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
            <BookOpen className="h-10 w-10 text-edu-blue" />
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Login to access NMMS preparation resources
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "student" | "teacher")
                }
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="id">
                {role === "student" ? "Student ID" : "Teacher ID"}
              </Label>
              <Input
                id="id"
                type="text"
                placeholder={`Enter your ${
                  role === "student" ? "Student" : "Teacher"
                } ID`}
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">Demo credentials:</p>
              <p className="text-xs text-gray-500">ID: 1001</p>
              <p className="text-xs text-gray-500">Password: 1234</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="/register" className="text-edu-blue hover:underline">
                Register here
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

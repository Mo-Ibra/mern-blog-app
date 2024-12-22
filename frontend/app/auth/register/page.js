"use client";

import { useState } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast, ToastContainer } from "react-toastify";
import { api } from "@/config/api";
import { useAuth } from "@/context/AuthContext";
import AlreadyLogged from "@/components/auth/AlreadyLogged";

function RegisterPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [error, setError] = useState("");

  const { user } = useAuth();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (password !== rePassword) {
      toast.error("Passwords do not match", { position: 'bottom-right'});
      return;
    }

    // API Call to register the user
    try {
      
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        rePassword,
      });

      console.log(response.data);

      if (response.status === 201) {
        toast.success("Registration successful! Please log in.", { position: 'bottom-right'});
        setName("");
        setEmail("");
        setPassword("");
        setRePassword("");

        location.href = '/auth/login?registered=true';

      }

    } catch (err) {
      setError(err.response.data.message);
    }

  };

  if (user) {
    return (
      <AlreadyLogged />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password Confirmation</Label>
                <Input
                  id="re-password"
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Register
              </Button>
              <ToastContainer />
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterPage;
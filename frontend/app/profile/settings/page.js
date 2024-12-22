"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "@/config/api";
import { toast, ToastContainer } from "react-toastify";

const ProfileSettings = () => {
  const { user, loading } = useAuth();
  const [newName, setNewName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      location.href = "/auth/login";
    }
  }, [user]);

  if (!user) {
    return <p>You can't access here</p>;
  }

  const handleNameChange = async () => {
    try {

      const response = await api.post('/auth/change-name', { name: newName }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        setError("");
        setMessage("Name updated successfully!");
        toast.success("Name updated successfully", { position: 'bottom-right' });
        setNewName("");
        user.name = newName;
      }

    } catch (err) {
      console.log(err.response.data.message);
      setMessage("");
      setError(err.response.data.message || "An error occurred");
    }
  };


  const handlePasswordChange = async () => {

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields", { position: 'bottom-right' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { position: 'bottom-right' });
      return;
    }

    try {

      const response = await api.post('/auth/change-password', { oldPassword, newPassword, rePassword: confirmPassword }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log(response);

      if (response.status === 200) {
        setError("");
        setMessage("Password updated successfully!");
        toast.success("Password updated successfully", { position: 'bottom-right' });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

    } catch (err) {
      console.log(err.response.data.message);
      setMessage("");
      setError(err.response.data.message || "An error occurred");
    }

  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center">
            Profile Setting
          </CardTitle>
          <CardDescription className="text-center text-sm text-gray-600">
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={user.name}
                readOnly
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                readOnly
                className="mt-2"
              />
            </div>

            {/* Change Name */}
            <div>
              <Label htmlFor="new-name">Change Name</Label>
              <Input
                id="new-name"
                type="text"
                placeholder="Enter new name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-2"
              />
              <Button onClick={handleNameChange} className="mt-4 w-full">
                Update Name
              </Button>
            </div>

            {/* Change Password */}
            <div>
              <Label htmlFor="old-password">Old Password</Label>
              <Input
                id="old-password"
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button onClick={handlePasswordChange} className="mt-4 w-full">
              Update Password
            </Button>
            <ToastContainer />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;

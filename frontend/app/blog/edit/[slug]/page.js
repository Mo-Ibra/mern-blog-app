"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !body) {
      alert("All fields are required!");
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      description,
      body,
    };

    console.log("New Post Submitted:", newPost);

    // Clear form inputs
    setTitle("");
    setDescription("");
    setBody("");

    // TODO: Send `newPost` to backend or API for saving
    alert("Post created successfully!");
    toast.success("Post created successfully!", { position: "bottom-right" });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title"
                className="mt-1 block w-full"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a short description"
                className="mt-1 block w-full"
                required
              />
            </div>

            {/* Body Input */}
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700"
              >
                Body
              </label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write the body of the post..."
                className="mt-1 block w-full"
                rows={6}
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Submit Post
            </Button>
            <ToastContainer />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

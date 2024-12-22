"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "@/config/api";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !content) {
      toast.error("All fields are required!");
      return;
    }

    const newArticle = {
      id: Date.now(),
      title,
      description,
      content,
    };

    try {

      const response = await api.post('/articles', newArticle, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        toast.success("Post created successfully!", { position: "bottom-right" });
        console.log("New Article Submitted:", newArticle);
        setTitle("");
        setDescription("");
        setContent("");
      }

    } catch (err) {
      console.log(err.response.data.message);
      setError(err.response.data.message || "An error occurred");
    }

  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
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

            {/* Content Input */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the content of the post..."
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

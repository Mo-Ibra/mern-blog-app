"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/config/api";
import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { LoadingComponent } from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";

const Page = () => {
  const [article, setArticle] = useState({});
  const [articleLoadingData, setArticleLoadingData] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentLoadingData, setCommentLoadingData] = useState(true);

  const [newCommentText, setNewCommentText] = useState("");

  const [error, setError] = useState(null);

  const { slug } = useParams();

  const { user } = useAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/article/${slug}`);

        if (response.status === 200) {
          console.log(response.data);
          setArticle(response.data);
        }
      } catch (err) {
        console.log(err);
        setError(err.response.data.message || "An error occurred");
      } finally {
        setArticleLoadingData(false);
      }
    };

    const fetchArticleComments = async () => {
      try {
        const response = await api.get(`/comments/article/${slug}`);

        if (response.status === 200) {
          console.log(response.data);
          setComments(response.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setCommentLoadingData(false);
      }
    };

    fetchArticle();

    fetchArticleComments();
  }, [slug]);

  const handleAddComment = async () => {
    if (newCommentText.trim() === "") {
      return;
    }

    if (newCommentText.length > 100) {
      toast.error("Comment must be less than 100 characters");
      return;
    }

    if (newCommentText.length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    try {
      const newComment = {
        content: newCommentText,
        articleId: slug,
      };

      const response = await api.post(`/comments/article/${slug}`, newComment, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        console.log(response.data);
        setNewCommentText("");
        toast.success("Comments fetched successfully!", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      if (err.response.status === 403) {
        toast.error("You must be logged in to add a comment");
        setIsLoading(false);
        return;
      }

      console.log(err);
      setError(err.response.data.message || "An error occurred");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3">
        {articleLoadingData ? (
          <LoadingComponent />
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {article.title}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Created By: {article.user.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800">{article.content}</p>
            </CardContent>
          </Card>
        )}
        {/* Comments Section */}
        <div className="mt-6">
          <Card className="w-full">
            {commentLoadingData ? (
              <LoadingComponent />
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Comments</CardTitle>
                  <CardDescription className="text-gray-600">
                    {comments.length} Comments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="p-4 border border-gray-300 rounded-md bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          {comment.user && (
                            <p className="font-semibold text-gray-800">
                              {comment.user.name}
                            </p>
                          )}
                          <p className="text-gray-500 text-sm">
                            {comment.createdAt}
                          </p>
                        </div>
                        <p className="text-gray-800 mt-2">{comment.content}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </>
            )}
          </Card>
        </div>

        {/* Add Comment Input */}
        <div className="mt-4">
          {user && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Add a Comment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                  />
                  <Button onClick={handleAddComment}>Submit</Button>
                </div>
              </CardContent>
              <ToastContainer />
            </Card>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Sidebar</CardTitle>
            <CardDescription className="text-gray-600">
              Related Links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Related Post 1
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Related Post 2
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Related Post 3
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default Page;

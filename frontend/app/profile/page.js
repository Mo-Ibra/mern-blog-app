"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/config/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { LoadingComponent } from "@/components/Loading";

const ProfilePage = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get Article by user id
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles/user/" + user.id);

        if (response.status == 200) {
          console.log(response.data);
          setArticles(response.data);
        }
      } catch (err) {
        console.log(err.response.data.message);
        setError(err.response.data.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchArticles();
    }
  }, [user]);

  const stats = {
    totalArticles: articles.length,
    totalComments: articles.length,
    profileViews: 340,
  };

  if (!user) {
    return (
      <div className="py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-600">You are not logged in.</p>
            <Link href="/">
              <Button className="mt-4">Return Back</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Profile Header with Stats */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold">{stats.totalArticles}</p>
                <p className="text-gray-600">Articles</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.totalComments}</p>
                <p className="text-gray-600">Comments</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.profileViews}</p>
                <p className="text-gray-600">Profile Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Your Articles
            </CardTitle>
          </CardHeader>

          {isLoading ? (
            <LoadingComponent />
          ) : (
            <CardContent>
              {articles.length > 0 ? (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="p-4 bg-white shadow-sm rounded-md border border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-lg">{article.title}</p>
                        <p className="text-gray-600 text-sm">1 comments</p>
                      </div>
                      <div className="items-center space-x-6 hidden md:flex">
                        <p className="text-sm text-gray-500">
                          Published on {article.createdAt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  You haven't published any articles yet.
                </p>
              )}
            </CardContent>
          )}
        </Card>

        {/* Buttons for Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/profile/settings">
            <Button variant="outline" className="w-full md:w-auto">
              Profile Settings
            </Button>
          </Link>
          <Link href="/blog/create">
            <Button className="w-full md:w-auto">Create New Article</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

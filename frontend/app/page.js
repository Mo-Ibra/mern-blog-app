"use client";

import FeaturedPost from "@/components/FeaturedPost";
import RecentArticles from "@/components/RecentArticles";
import { api } from "@/config/api";
import { useEffect, useState } from "react";

// Import react toastify
import "react-toastify/dist/ReactToastify.css";

function Home() {

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        console.log(response.data);
        setArticles(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();

  }, []);

  return (
    <>
      <RecentArticles articles={articles} isLoading={isLoading} />
    </>
  );
}

export default Home;
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingComponent } from "./Loading";
import formatDate from "@/lib/formatDate";

const tags = ["CSS", "JavaScript", "Web Development"];

function RecentArticles({ articles, isLoading }) {

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recent Articles</h2>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{article.content}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                By {article.user.name} on {formatDate(article.createdAt)}
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href={`/blog/${article.id}`}
                className="text-blue-600 hover:underline"
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RecentArticles;
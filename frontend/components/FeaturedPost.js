import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function FeaturedPost() {
  const post = {
    title: "Understanding React Hooks",
    excerpt:
      "React Hooks are a powerful feature introduced in React 16.8. They allow you to use state and other React features without writing a class. This means you can use React without classes.",
    author: "Jane Doe",
    date: "May 15, 2023",
    tags: ["React", "JavaScript", "Web Development"],
    slug: "understanding-react-hooks",
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          By {post.author} on {post.date}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className="text-blue-600 hover:underline"
        >
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
}

export default FeaturedPost;
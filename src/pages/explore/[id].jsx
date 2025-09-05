import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AppLayout } from "@/layout/AppLayout";
import axios from "@/lib/axios";

const getImageUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_STATIC_BASE;
  return `${baseUrl}${path}`;
};

export default function ArticleDetailPage() {
  const { id } = useRouter().query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/articles/${id}`);
        if (res.data.success) {
          setArticle(res.data.article);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const getBadgeColor = (category) => {
    const colors = {
      rare: "bg-blue-200 text-blue-800",
      "my collection": "bg-red-200 text-red-800",
      troubleshooting: "bg-green-200 text-green-800",
      indoors: "bg-yellow-200 text-yellow-800",
      default: "bg-gray-200 text-gray-800",
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  if (loading) {
    return (
      <AppLayout title="Loading...">
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Loading article...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Error">
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-red-500">{error}</p>
        </div>
      </AppLayout>
    );
  }

  if (!article) {
    return (
      <AppLayout title="Not Found">
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Article not found</p>
        </div>
      </AppLayout>
    );
  }

  const imageUrl = getImageUrl(article.image);

  return (
    <AppLayout title={article.title}>
      <div className="space-y-6">
        {/* Article Image */}
        <div className="w-full">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-64 object-cover shadow"
          />
        </div>

        {/* Article Content */}
        <div className="space-y-2 px-4">
          {/* Category Badge */}
          <div>
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full uppercase ${getBadgeColor(
                article.category
              )}`}
            >
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 leading-tight">
            {article.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>By {article.author}</span>
            <span>•</span>
            <span>
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </p>
          </div>
        </div>

        {/* Related Articles or Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 px-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Article Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Category:</strong> {article.category}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Published:</strong>{" "}
              {new Date(article.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong>{" "}
              {new Date(article.updatedAt || article.createdAt).toLocaleString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                }
              )}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
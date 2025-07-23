import { useState, useEffect } from "react";
import { AppLayout } from "@/layout/AppLayout";
import { getAllArticles } from "@/lib/articleService"; // ✅ new import

export default function ExplorePage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories] = useState([
    "All", "Rare", "My collection", "Troubleshooting", "Indoors"
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await getAllArticles();
        if (res.success) {
          setArticles(res.articles);
          setFilteredArticles(res.articles);
        }
      } catch (err) {
        console.error("❌ Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = [...articles];

    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (article) => article.category === activeCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  }, [activeCategory, searchQuery, articles]);

  return (
    <AppLayout title="Explore">
      <div className="px-4">
        {/* 🔍 Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* 🧭 Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full border ${
                activeCategory === category
                  ? "bg-green-700 text-white"
                  : "border-green-700 text-green-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 📚 Article Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {filteredArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

function ArticleCard({ article }) {
  const imageUrl = `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${article.image}`;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img
        src={imageUrl}
        alt={article.title}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <p className="text-xs text-green-700 font-semibold mb-2 uppercase">{article.category}</p>
      <h2 className="text-lg font-bold text-gray-800">{article.title}</h2>
      <p className="text-sm text-gray-600">{article.content}</p>
      <p className="text-xs text-gray-400 mt-2">
        By {article.author} • {new Date(article.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

import { useState, useEffect } from "react";
import { AppLayout } from "@/layout/AppLayout";
import { getAllArticles } from "@/lib/articleService"; 
import { useRouter } from "next/router";

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
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 bg-[#D9D9D9] text-gray-800"
          />
          {/* Search Icon */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 🧭 Category Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`w-32 px-2  rounded-full border text-xs ${
                activeCategory === category
                  ? "bg-[#0A5D2F] text-white"
                  : "border-[#0A5D2F] text-[#0A5D2F]"
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
  const router = useRouter();
  const imageUrl = `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}${article.image}`;

  const handleCardClick = () => {
    router.push(`/explore/${article._id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl pb-4 shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleCardClick}
    >
      <img
        src={imageUrl}
        alt={article.title}
        className="w-full h-40 object-cover rounded-t-lg mb-4"
      />
      <div className="px-4">
        <span className="inline-block text-xs font-semibold mb-2 px-3 py-1 rounded-full uppercase bg-[#B3CDBF] text-[#0A5D2F]">
          {article.category}
        </span>
      </div>
      <h2 className="px-4 text-lg font-bold text-[#0A5D2F]">{article.title}</h2>
      <p className="px-4 text-sm text-gray-600">{article.content}</p>
      <p className="px-4 text-xs text-gray-400 mt-2">
        By {article.author} • {new Date(article.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

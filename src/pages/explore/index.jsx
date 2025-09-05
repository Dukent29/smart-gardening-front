import { useState, useEffect } from "react";
import { AppLayout } from "@/layout/AppLayout";
import { getAllArticles } from "@/lib/articleService"; 
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles

export default function ExplorePage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories] = useState([
    "All", "Rare", "favoris", "Troubleshooting", "Indoors"
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true); // Set loading to true when fetching articles
      try {
        const res = await getAllArticles();
        if (res.success) {
          setArticles(res.articles);
          setFilteredArticles(res.articles);
        }
      } catch (err) {
        console.error("❌ Error fetching articles:", err);
      } finally {
        setLoading(false); // Set loading to false after fetching articles
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let filtered = [...articles];

    if (activeCategory === "favoris") {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      filtered = filtered.filter((article) => favorites.includes(article._id));
    } else if (activeCategory !== "All") {
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
            className="w-full p-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-100 text-gray-800"
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
              className={`w-32 px-2 py-2 rounded-full border text-xs ${
                activeCategory === category
                  ? "bg-[#0A5D2F] text-white"
                  : "border-[#0A5D2F] text-[#0A5D2F]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 📚 Article Cards or Skeletons */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl pb-4 shadow">
                  <Skeleton height={160} className="rounded-t-lg" />
                  <div className="px-4">
                    <Skeleton width="60%" height={20} className="mt-4" />
                    <Skeleton width="40%" height={15} className="mt-2" />
                    <Skeleton width="80%" height={15} className="mt-2" />
                  </div>
                </div>
              ))
            : filteredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
        </div>
      </div>
    </AppLayout>
  );
}

// Utility function to handle image URLs
const getImageUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g., "https://awm.portfolio-etudiant-rouen.com/api"
  if (path.startsWith('/')) {
    path = path.slice(1); // Remove leading slash to avoid double slashes
  }
  return `${baseUrl}/${path}`;
};

function ArticleCard({ article }) {
  const router = useRouter();
  const imageUrl = article.image?.startsWith('http') ? article.image : getImageUrl(article.image);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(article._id));
  }, [article._id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(article._id)) {
      const updatedFavorites = favorites.filter(id => id !== article._id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(article._id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

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
      <div className="px-4 flex justify-between items-center">
        <span className="inline-block text-xs font-semibold mb-2 px-3 py-1 rounded-full uppercase bg-[#B3CDBF] text-[#0A5D2F]">
          {article.category}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering card click
            toggleFavorite();
          }}
          className="focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isFavorite ? "#FF69B4" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={isFavorite ? "#FF69B4" : "currentColor"}
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.998 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54l-1.45 1.31z"
            />
          </svg>
        </button>
      </div>
      <h2 className="px-4 text-lg font-bold text-[#0A5D2F]">{article.title}</h2>
      <p className="px-4 text-sm text-gray-600">{article.content}</p>
      <p className="px-4 text-xs text-gray-400 mt-2">
        By {article.author} • {new Date(article.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

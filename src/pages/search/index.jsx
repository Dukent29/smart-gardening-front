import { useState, useEffect } from "react";
import { AppLayout } from "@/layout/AppLayout";
import { getAllArticles } from "@/lib/articleService";
import { getPlants } from "@/lib/plantService";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/router"; // Import useRouter


const getImageUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_STATIC_BASE;
  return `${baseUrl}${path}`;
};

export default function SearchPage() {
  const [plants, setPlants] = useState([]);
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const router = useRouter(); 

  useEffect(() => {
    const loadData = async () => {
      try {
        const [plantsData, articlesData] = await Promise.all([
          getPlants(),
          getAllArticles(),
        ]);
        setPlants(plantsData);
        setArticles(articlesData.articles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  const matchedPlants = plants.filter((plant) =>
    plant.plant_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchedArticles = articles.filter((article) =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const combinedResults =
    filter === "plants"
      ? matchedPlants
      : filter === "articles"
      ? matchedArticles
      : [...matchedPlants, ...matchedArticles];

  const handleResultClick = (id, type) => {
    if (type === "plant") {
      router.push(`/dashboard`); 
    } else if (type === "article") {
      router.push(`/explore`); 
    }
  };

  return (
    <AppLayout title="Recherche">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Search Input */}
          <div className="flex items-center">
            <div className="relative w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search plants, species, care tips"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-full bg-white/80 backdrop-blur ring-1 ring-gray-200 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent
                           placeholder:text-gray-500 text-gray-700"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 h-9 rounded-full text-sm font-medium transition
                ${filter === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white/80 text-gray-700 ring-1 ring-gray-200 hover:bg-white"}`}
            >
              All ({matchedPlants.length + matchedArticles.length})
            </button>

            <button
              onClick={() => setFilter("plants")}
              className={`px-4 h-9 rounded-full text-sm font-medium transition
                ${filter === "plants"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white/80 text-gray-700 ring-1 ring-gray-200 hover:bg-white"}`}
            >
              Plants ({matchedPlants.length})
            </button>

            <button
              onClick={() => setFilter("articles")}
              className={`px-4 h-9 rounded-full text-sm font-medium transition
                ${filter === "articles"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white/80 text-gray-700 ring-1 ring-gray-200 hover:bg-white"}`}
            >
              Articles ({matchedArticles.length})
            </button>
          </div>

          {/* Results */}
          {searchTerm ? (
            <div>
              {combinedResults.length > 0 ? (
                combinedResults.map((result, index) =>
                  result.plant_name ? (
                    <div
                      key={index}
                      onClick={() => handleResultClick(result.id, "plant")}
                      className="group flex items-center gap-4 p-4 mb-3 rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200
                                 hover:shadow-md hover:ring-gray-300 transition cursor-pointer"
                    >
                      <img
                        src={getImageUrl(result.image_url)}
                        alt={result.plant_name}
                        className="w-16 h-16 rounded-xl object-cover ring-1 ring-gray-200"
                      />
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {result.plant_name}
                        </h3>
                        <p className="text-sm text-emerald-800/90">{result.plant_type}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{result.description}</p>
                      </div>
                      <span className="ml-auto text-gray-400 group-hover:text-emerald-600 transition">↗</span>
                    </div>
                  ) : (
                    <div
                      key={index}
                      onClick={() => handleResultClick(result.id, "article")}
                      className="group p-4 mb-3 rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200
                                 hover:shadow-md hover:ring-gray-300 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase
                                         bg-gray-50 text-gray-700 ring-1 ring-gray-200">
                          {result.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{result.content}</p>
                    </div>
                  )
                )
              ) : (
                <p className="text-center text-gray-600 py-10">No results found. Try another keyword.</p>
              )}
            </div>
          ) : (
            <div className="text-center pt-16">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 grid place-items-center mb-4">
                <FiSearch className="text-emerald-600" size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Start Searching</h2>
              <p className="text-sm text-gray-600">
                Search through your plants, articles, and care resources
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

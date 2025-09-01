import { useState, useEffect } from "react";
import { AppLayout } from "../../layout/AppLayout";
import { getAllArticles } from "../../lib/articleService";
import { getPlants } from "../../lib/plantService";
import { FiSearch } from "react-icons/fi";

const baseUrl = "http://localhost:5000";

export default function SearchPage() {
  const [plants, setPlants] = useState([]);
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

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

  return (
    <AppLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          {/* Search Input */}
          <div className="mb-6 flex items-center">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search plants, species, care tips"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-600"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "all" ? "bg-green-300 text-[#074221]" : "bg-gray-600"
              }`}
              onClick={() => setFilter("all")}
            >
              All ({matchedPlants.length + matchedArticles.length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg mx-2 ${
                filter === "plants" ? "bg-green-300 text-[#074221]" : "bg-gray-600"
              }`}
              onClick={() => setFilter("plants")}
            >
              Plants ({matchedPlants.length})
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filter === "articles" ? "bg-green-300 text-[#074221]" : "bg-gray-600"
              }`}
              onClick={() => setFilter("articles")}
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
                      className="flex items-center p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200"
                    >
                      <img
                        src={`${baseUrl}${result.image_url}`}
                        alt={result.plant_name}
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {result.plant_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.plant_type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result.description.split(" ").slice(0, 4).join(" ")}...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200"
                    >
                      <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-600">
                        {result.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {result.content.split(" ").slice(0, 4).join(" ")}...
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="text-center text-gray-600">No results found.</p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">Start Searching</h2>
              <p className="text-sm text-gray-600">
                Search through all your plants, articles, and care resources
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

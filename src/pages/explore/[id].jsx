import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AppLayout } from "@/layout/AppLayout";
import axios from "@/lib/axios";

const STATIC_BASE = "http://localhost:5000";

const toApiStatic = (raw = "") => {
  if (!raw) return "";
  let p = String(raw).trim().replace(/^https?:\/\/[^/]+\/?/, ""); 
  p = p.replace(/^\/+/g, "");     
  p = p.replace(/^api\/+/g, "");  
  if (!/^uploads\//i.test(p)) p = `uploads/${p}`;
  return `${STATIC_BASE}/${p}`; 
};

const categoryTranslations = {
  All: "Tous",
  Rare: "Rare",
  favoris: "Favoris",
  Troubleshooting: "Dépannage",
  Indoors: "Intérieur",
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
          setError("Article introuvable");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'article :", err);
        setError("Échec du chargement de l'article");
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
      <AppLayout title="Chargement...">
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Chargement de l'article...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Erreur">
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-red-500">{error}</p>
        </div>
      </AppLayout>
    );
  }

  if (!article) {
    return (
      <AppLayout title="Introuvable">
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Article introuvable</p>
        </div>
      </AppLayout>
    );
  }

  const imageUrl = toApiStatic(article.image);

  return (
    <AppLayout title={article.title.split(" ").slice(0, 3).join(" ") + (article.title.split(" ").length > 3 ? "..." : "")}>
      <div className="min-h-screen bg-gradient-to-b from-[#F2F7F4] to-[#F7FAF9] -mt-6">
        {/* HERO IMAGE + OVERLAY */}
        <section className="relative">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-[38vh] sm:h-[48vh] object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Header content */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-4">
            <div className="max-w-3xl">
              <span
                className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full ring-1 ring-black/5 uppercase
                ${getBadgeColor(article.category)} backdrop-blur bg-white/80`}
              >
                {categoryTranslations[article.category] || article.category}
              </span>

              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight text-white drop-shadow">
                {article.title}
                
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/90">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-white/20 backdrop-blur ring-1 ring-white/25">
                    {/* Small avatar placeholder */}
                    <span className="text-[11px] font-bold">
                      {article.author?.[0]?.toUpperCase() || "A"}
                    </span>
                  </span>
                  <span className="opacity-95">Par {article.author}</span>
                </span>
                <span className="opacity-70">•</span>
                <span className="opacity-95">
                  {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* BODY */}
        <main className="px-4 sm:px-6">
          <div className="mx-auto max-w-3xl -mt-6 sm:-mt-10">
            {/* CONTENT CARD */}
            <article className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-sm p-5 sm:p-7 mt-10">
              <div className="prose prose-sm sm:prose-base max-w-none prose-headings:scroll-mt-24">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {article.content}
                </p>
              </div>
            </article>

            {/* DETAILS */}
            <section className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Détails de l'article
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-gray-200 p-4">
                  <p className="text-xs text-gray-500">Catégorie</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {categoryTranslations[article.category] || article.category}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-gray-200 p-4">
                  <p className="text-xs text-gray-500">Publié</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {new Date(article.createdAt).toLocaleString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 backdrop-blur ring-1 ring-gray-200 p-4">
                  <p className="text-xs text-gray-500">Dernière mise à jour</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {new Date(article.updatedAt || article.createdAt).toLocaleString(
                      "fr-FR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* SPACER BOTTOM */}
            <div className="h-24" />
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
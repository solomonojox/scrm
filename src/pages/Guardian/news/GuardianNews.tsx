import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import imageAssets from "../../../assets/imageAssets";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { fetchNewsFailure, fetchNewsStart, fetchNewsSuccess } from "../../../Store/newsSlice";
import { newsService } from "../../../Services/News";

export default function GuardianNews() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // number of cards per page

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const fetchedRecord = useSelector((state: RootState) => state.getNews.listRecords) || [];
  const fetchedLoading = useSelector((state: RootState) => state.getNews.loading);
  const error = useSelector((state: RootState) => state.getNews.error);

  useEffect(() => {
    if (!fetchedLoading) {
      fetchNews();
    }
  }, [dispatch]);

  const fetchNews = async () => {
    dispatch(fetchNewsStart());
    try {
      const data = await newsService.getAllRegisteredNews();
      dispatch(fetchNewsSuccess(data));
    } catch (err) {
      dispatch(fetchNewsFailure((err as Error).message));
    }
  };

  const categories = ["All", "Events", "Academics", "General", "Fees", "Examination", "Sports"];

  // Filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fetchedRecord.filter((c: any) => {
      const matchesQuery = q === "" ? true : c.title?.toLowerCase().includes(q);
      const matchesCategory = category === "All" ? true : c.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [fetchedRecord, query, category]);

  // Pagination logic
  const totalRecords = filtered.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleLike = useCallback((id: string) => {
    setLikes((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  function formatDateTime(isoString: any) {
    const d = new Date(isoString);
    const pad = (n: any) => n.toString().padStart(2, "0");

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="bg-[#EDEDED] px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-gray-900 font-bold text-xl">News Feed</h2>
        </div>
      </div>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <section>
          {/* Categories */}
          <nav className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mb-6 border-b border-gray-200 pb-2">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat}>
                <button
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-1 ${
                    category === cat
                      ? "font-semibold text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  aria-pressed={category === cat}
                >
                  {cat}
                </button>
                {idx !== categories.length - 1 && <span className="text-gray-400">||</span>}
              </React.Fragment>
            ))}
          </nav>

          {/* News Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedRecords.map((card: any) => (
              <article
                key={card.id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col"
              >
                <img
                  alt={card.title}
                  className="rounded-lg mb-3 object-cover w-full h-[180px]"
                  src={card.image || imageAssets.girl}
                  loading="lazy"
                  width={300}
                  height={180}
                />

                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-green-600 mb-3">Category: {card.category || "Events"}</p>

                <button
                  type="button"
                  onClick={() => navigate(`/newsfeed/${card.newsId}`, { state: { article: card } })}
                  className="bg-orange-600 text-white text-xs rounded px-3 py-1 mb-3 w-max hover:bg-orange-700 transition"
                >
                  Read Now
                </button>

                <p className="text-xs text-gray-500 mb-3">Date Posted: {formatDateTime(card.publishedDate)}</p>

                <div className="mt-auto flex items-center justify-end">
                  <button
                    type="button"
                    aria-label={likes[card.id] ? "Unlike" : "Like"}
                    aria-pressed={!!likes[card.id]}
                    onClick={() => toggleLike(card.id)}
                    className={`ml-auto text-gray-400 hover:text-red-600 ${
                      likes[card.id] ? "text-red-600" : ""
                    }`}
                  >
                    <FaThumbsUp />
                  </button>
                </div>
              </article>
            ))}

            {paginatedRecords.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-6">
                No posts match your search or category.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalRecords > 0 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 text-sm text-gray-600">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-6 py-2 border rounded ${
                  currentPage === 1
                    ? "bg-white text-black border-gray-600 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
                {query && ` (${totalRecords} results)`}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-6 py-2 border rounded ${
                  currentPage === totalPages
                    ? "bg-white text-black border-gray-600 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

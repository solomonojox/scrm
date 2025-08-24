import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import imageAssets from "../../../assets/imageAssets";

const sampleCard = (id) => ({
  id: String(id),
  title: "PTA Meeting Scheduled for August 15.",
  category: "Events",
  datePosted: "12 August, 2025",
  image: imageAssets.girl,
});

export default function GuardianNews() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [likes, setLikes] = useState({});

  const navigate = useNavigate();

  const cards = useMemo(
    () => Array.from({ length: 9 }, (_, i) => sampleCard(i + 1)),
    []
  );

  const categories = ["All", "Events", "Academics", "General", "Fees", "Examination", "Sports"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      const matchesQuery = q === "" ? true : c.title.toLowerCase().includes(q);
      const matchesCategory = category === "All" ? true : c.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [cards, query, category]);

  const toggleLike = useCallback((id) => {
    setLikes((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="bg-[#EDEDED] px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-gray-900 font-bold text-xl">News Feed</h2>
        </div>
      </div>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <section>
          
          <nav className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mb-6 border-b border-gray-200 pb-2">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat}>
                <button
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-1 ${category === cat ? "font-semibold text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                  aria-pressed={category === cat}
                >
                  {cat}
                </button>
                {idx !== categories.length - 1 && <span className="text-gray-400">||</span>}
              </React.Fragment>
            ))}
          </nav>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((card) => (
              <article key={card.id} className="border border-gray-200 rounded-lg p-4 flex flex-col">
                <img
                  alt={card.title}
                  className="rounded-lg mb-3 object-cover w-full h-[180px]"
                  src={card.image}
                  loading="lazy"
                  width={300}
                  height={180}
                />

                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{card.title}</h3>
                <p className="text-xs text-green-600 mb-3">Category: {card.category}</p>

                <button
                  type="button"
                  onClick={() => navigate(`/newsfeed/${card.id}`, { state: { article: card } })}
                  className="bg-orange-600 text-white text-xs rounded px-3 py-1 mb-3 w-max hover:bg-orange-700 transition"
                >
                  Read Now
                </button>

                <p className="text-xs text-gray-500 mb-3">Date Posted: {card.datePosted}</p>

                <div className="mt-auto flex items-center justify-end">
                  <button
                    type="button"
                    aria-label={likes[card.id] ? "Unlike" : "Like"}
                    aria-pressed={!!likes[card.id]}
                    onClick={() => toggleLike(card.id)}
                    className={`ml-auto text-gray-400 hover:text-red-600 ${likes[card.id] ? "text-red-600" : ""}`}
                  >
                    <FaThumbsUp />
                  </button>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-6">No posts match your search or category.</div>
            )}
          </div>

          <nav className="flex justify-center items-center mt-6 text-xs text-gray-500 space-x-1 select-none">
            <span>Page 1 of 0</span>
            <span className="text-orange-600">♦</span>
          </nav>
        </section>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import imageAssets from "../../assets/imageAssets";

const NewsCard = ({
  imgSrc,
  title,
  category,
  time,
  datePosted,
  liked,
  onToggleLike,
  index,
  id,
}) => {
  return (
    <article className="bg-white rounded-lg border border-gray-300 p-3 flex flex-col">
      <img alt={title} className="rounded-lg mb-3" src={imgSrc} />
      <h2 className="font-bold text-sm mb-1 leading-tight">{title}</h2>
      <p className="text-xs text-[#45B20A] mb-1">Category: {category}</p>
      <p className="text-xs mb-3">{time}</p>

   <Link
  to={`/newsfeed/${id}`}
  state={{
    article: { imgSrc, title, category, time, datePosted, liked, id }
  }}
  className="bg-[#EE7306] text-white text-xs rounded px-4 py-1 w-max mb-3"
>
  Read Now
</Link>



      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>Date Posted: {datePosted}</span>
        <button onClick={() => onToggleLike(index)} className="focus:outline-none">
          <i
            className={`fas fa-thumbs-up cursor-pointer ${
              liked ? "text-red-600" : "text-gray-400"
            }`}
          ></i>
        </button>
      </div>
    </article>
  );
};

const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      imgSrc: imageAssets.girl,
      title: "PTA Meeting Scheduled for August 15.",
      category: "Events",
      time: "12:20pm",
      datePosted: "12 August, 2025",
      liked: false,
    },
    {
      id: 2,
      imgSrc: imageAssets.girl,
      title: "Annual Sports Day Announcement",
      category: "Sports",
      time: "2:00pm",
      datePosted: "11 August, 2025",
      liked: true,
    },
    {
      id: 3,
      imgSrc: imageAssets.girl,
      title: "Exam Timetable Released",
      category: "Examination",
      time: "10:00am",
      datePosted: "10 August, 2025",
      liked: false,
    },
    {
      id: 4,
      imgSrc: imageAssets.girl,
      title: "National World Day",
      category: "General",
      time: "2:00pm",
      datePosted: "18 August, 2025",
      liked: true,
    },
    {
      id: 5,
      imgSrc: imageAssets.girl,
      title: "Exam Timetable Released",
      category: "Fees",
      time: "10:00am",
      datePosted: "10 August, 2025",
      liked: false,
    },
    {
      id: 6,
      imgSrc: imageAssets.girl,
      title: "Rough Behaviour Information",
      category: "Academics",
      time: "10:00am",
      datePosted: "10 August, 2025",
      liked: true,
    },
  ]);

  const toggleLike = (index) => {
    setNewsItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, liked: !item.liked } : item
      )
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowFilter(false);
  };

  const filteredNews =
    selectedCategory === "All"
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-gray-100 font-sans min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-300 p-4 hidden md:block">
        <h2 className="font-bold mb-4 text-gray-700">Menu</h2>
        <nav className="space-y-2 text-sm text-gray-700">
          <a href="#" className="block hover:text-orange-600">
            Dashboard
          </a>
          <a href="#" className="block hover:text-orange-600">
            News Feed
          </a>
          <a href="#" className="block hover:text-orange-600">
            Events
          </a>
          <a href="#" className="block hover:text-orange-600">
            Academics
          </a>
          <a href="#" className="block hover:text-orange-600">
            Sports
          </a>
          <a href="#" className="block hover:text-orange-600">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4 relative mt-20">
          <h1 className="font-bold text-base">News Feed</h1>
          <button
            aria-label="Filter"
            onClick={() => setShowFilter((prev) => !prev)}
            className="text-gray-700 text-lg hover:text-gray-900 relative"
          >
            <i className="fas fa-filter"></i>
          </button>

          {showFilter && (
            <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded shadow-md text-sm z-10">
              {[
                "All",
                "Events",
                "Academics",
                "General",
                "Fees",
                "Examination",
                "Sports",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    selectedCategory === cat ? "bg-gray-200 font-semibold" : ""
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-300 rounded-t-md px-4 py-2">
          <nav className="text-xs text-gray-700 space-x-2">
            <span>All</span>
            <span>||</span>
            <span>Events</span>
            <span>||</span>
            <span>Academics</span>
            <span>||</span>
            <span>General</span>
            <span>||</span>
            <span>Fees</span>
            <span>||</span>
            <span>Examination</span>
            <span>||</span>
            <span>Sports</span>
          </nav>
        </div>

        <div className="bg-white border border-t-0 border-gray-300 rounded-b-md p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((item, index) => (
            <NewsCard
              key={item.id}
              index={index}
              {...item}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;

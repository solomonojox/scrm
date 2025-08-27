import React, { useState, useRef, useEffect } from "react";
import {
  Filter,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Added
import imageAssets from "../../assets/imageAssets";
import Sidebar from "../../pages/Admin/guardian/Sidebar";

// ---------------- Subcomponents ----------------
function EventCard({ image, dateTime, title, description, alt }) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg"> {/* ✅ Added shadow */}
      <img
        src={image}
        alt={alt}
        className="w-full h-[180px] object-cover" // ✅ Bigger image height
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-2">
        <div className="mb-1">{dateTime}</div>
        <div className="font-semibold text-xs leading-tight mb-1">{title}</div>
        <div className="text-[8px] leading-tight">{description}</div>
      </div>
    </div>
  );
}

// ---------------- Data ----------------
const filterOptions = ["All Events", "Upcoming", "Recent", "Past"];

const upcoming = [
  {
    image: imageAssets.claap,
    alt: "Group of students raising hands in classroom",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
  {
    image: imageAssets.claap,
    alt: "Teacher with tripod camera in class",
    dateTime: "25-02-2025 | 12:25pm",
    title: "Parent Engagement & Academic Support",
    description: "Helping Your Child Succeed: Building Good Study Habits at Home.",
  },
];

const recent = [
  {
    image: imageAssets.claap,
    alt: "Audience clapping",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
  {
    image: imageAssets.claap,
    alt: "Kids listening to teacher",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
];

const allEvents = [
  {
    image: imageAssets.student,
    alt: "Audience clapping",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
  {
    image: imageAssets.student,
    alt: "Audience clapping",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
];

const months = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025",
  "August 2025",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025",
];

// ---------------- Main Component ----------------
export default function EventsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [notifySubscribed, setNotifySubscribed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Sidebar toggle state

  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll for recent events
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl text-black min-h-screen flex">
      {/* Main Content */}
      <main className="flex-1  sm:px-6 lg:px-8 pt-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-2xl font-semibold">Events</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((prev) => !prev)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 rounded-md px-2 py-1 text-xs"
              >
                <Filter className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg text-xs z-50">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        console.log(`Selected filter: ${option}`);
                        setFilterOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/guardian/event/photo")}
              className="bg-[#FF6F00] text-white text-xs font-semibold px-3 py-1 rounded-md"
            >
              Photo Gallery
            </button>
          </div>
        </header>

        {/* Upcoming Events */}
        <section
          className="rounded-lg overflow-hidden mb-12 shadow-lg"
          style={{ background: "linear-gradient(90deg, #FF6F00 0%, #FFB300 100%)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 p-6 md:p-8">
            <div className="md:flex-1 mb-6 md:mb-0">
              <h2 className="text-white font-extrabold text-3xl leading-tight mb-2">
                Upcoming<br />Events
              </h2>
              <p className="text-white text-xs mb-4 max-w-[220px]">
                Don't Miss These Exciting School Moments!
              </p>
              <button
                type="button"
                onClick={() => setNotifySubscribed(true)}
                className={`${notifySubscribed
                  ? "bg-green-500 text-white"
                  : "bg-white text-[#FF6F00]"
                  } text-xs font-semibold rounded-full px-3 py-1 inline-flex items-center gap-1 transition`}
              >
                <span>
                  {notifySubscribed
                    ? "You’re all set to be notified!"
                    : "Tap to receive a notification"}
                </span>
                {!notifySubscribed && <Bell className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex gap-4 md:flex-1 md:justify-end">
              {upcoming.map((ev, i) => (
                <div key={i} className="w-[180px] md:w-[220px]">
                  <EventCard {...ev} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Events */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-semibold text-2xl leading-tight mb-1">Recent Events</h3>
              <p className="text-xs mb-4">Here's What We've Been Up To!</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollBy({ left: -220, behavior: "smooth" });
                    }
                  }}
                  aria-label="Previous"
                  className="text-gray-400 border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center hover:border-[#FF6F00] hover:text-[#FF6F00]"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-xs text-[#FF6F00] font-semibold">1/5</span>
                <button
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
                    }
                  }}
                  aria-label="Next"
                  className="text-[#FF6F00] border border-[#FF6F00] rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#FF6F00] hover:text-white"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
            >
              {recent.map((ev, i) => (
                <div key={i} className="snap-start shrink-0 w-[220px]">
                  <EventCard {...ev} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Events */}
        <section className="mb-12">
          <h3 className="font-semibold text-xl mb-1 underline underline-offset-4 decoration-2 decoration-black">
            All Events
          </h3>
          <p className="text-xs mb-6 max-w-[220px]">
            From Classrooms to Celebrations, Every Event, Right Here!
          </p>
          <div className="flex items-start gap-6">
            {/* Months */}
            <div className="border-t border-gray-300 pt-4 text-xs text-gray-500 font-bold space-y-2 w-[160px] shrink-0">
              {months.map((m) => (
                <div key={m}>
                  {m}
                  {m === "December 2025" && (
                    <div className="mt-7 text-center">
                      <p className="text-gray-700 text-sm mb-2">
                        Re-occurring events will appear here
                      </p>
                      <div className="inline-block rounded-lg shadow-md overflow-hidden">
                        <img
                          alt="Orange desktop calendar"
                          className="w-[200px]"
                          src={imageAssets.fif}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* All Events Grid */}
            <div className="grid grid-cols-2 gap-4 ml-40 flex-1">
              {allEvents.map((ev, i) => (
                <div key={i} className="max-w-[250px]">
                  <EventCard {...ev} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

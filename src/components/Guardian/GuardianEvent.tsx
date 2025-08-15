import React, { useState, useRef, useEffect } from "react";
import {
  Filter,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  Image,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import imageAssets from "../../assets/imageAssets";
// ---------------- Subcomponents ----------------
function EventCard({ image, dateTime, title, description, alt }) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <img src={image} alt={alt} className="w-full h-auto object-cover" />
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
    image: "https://placehold.co/200x160/png?text=Students+Raising+Hands",
    alt: "Group of students raising hands in classroom, diverse students smiling and participating",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
  {
    image: "https://placehold.co/200x160/png?text=Teacher+with+Students+and+Camera",
    alt: "Teacher standing in front of students with camera on tripod, classroom setting",
    dateTime: "25-02-2025 | 12:25pm",
    title: "Parent Engagement & Academic Support",
    description: "Helping Your Child Succeed: Building Good Study Habits at Home.",
  },
];

const recent = [
  {
    image: imageAssets.fif,
    alt: "Audience clapping at event, diverse group of people in auditorium",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
  {
    image: "https://placehold.co/200x160/png?text=Kids+Listening+to+Story",
    alt: "Kids listening to story with teacher, group of children sitting and paying attention",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
   {
    image: "https://placehold.co/200x160/png?text=Audience+Clapping+at+Event",
    alt: "Audience clapping at event, diverse group of people in auditorium",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
  {
    image: "https://placehold.co/200x160/png?text=Kids+Listening+to+Story",
    alt: "Kids listening to story with teacher, group of children sitting and paying attention",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
];

const allEvents = [
  {
    image: "https://placehold.co/200x160/png?text=Audience+Clapping+at+Event",
    alt: "Audience clapping at event, diverse group of people in auditorium",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
   {
    image: "https://placehold.co/200x160/png?text=Audience+Clapping+at+Event",
    alt: "Audience clapping at event, diverse group of people in auditorium",
    dateTime: "22-02-2025 | 12:25pm",
    title: "Digital Literacy for Students",
    description: "Safe and Smart: Teaching Kids Responsible Internet Use.",
  },
];

const months = [
  "January 2025", "February 2025", "March 2025", "April 2025",
  "May 2025", "June 2025", "July 2025", "August 2025",
  "September 2025", "October 2025", "November 2025", "December 2025",
];

// ---------------- Main Component ----------------
export default function EventsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [notifySubscribed, setNotifySubscribed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef(null);

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
    <div className="bg-white text-black min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-56 bg-gray-50 border-r border-gray-200 p-4 flex-col">
        <h2 className="font-bold text-lg mb-6">Menu</h2>
        <nav className="flex flex-col gap-3 text-sm">
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6F00]"><Home size={16} /> Dashboard</a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6F00]"><Calendar size={16} /> Events</a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6F00]"><Image size={16} /> Gallery</a>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-200 text-xs text-gray-500">
          © 2025 School Events
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-56 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex flex-col gap-3 text-sm">
              <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6F00]"><Home size={16} /> Dashboard</a>
              <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6F00]"><Calendar size={16} /> Events</a>
              <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-[#FF6F00]"><Image size={16} /> Gallery</a>
            </nav>
            <div className="mt-auto pt-6 border-t border-gray-200 text-xs text-gray-500">
              © 2025 School Events
            </div>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button className="md:hidden text-gray-700" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-normal">Events</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div >
              <button
                type="button"
                onClick={() => setFilterOpen((prev) => !prev)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900  rounded-md px-2 py-1 text-xs"
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
            <button className="bg-[#FF6F00] text-white text-xs font-semibold px-3 py-1 rounded-md">
              Photo Gallery
            </button>
          </div>
        </header>

        {/* Upcoming Events */}
        <section
          className="rounded-lg overflow-hidden mb-12"
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
                className={`${
                  notifySubscribed ? "bg-green-500 text-white" : "bg-white text-[#FF6F00]"
                } text-xs font-semibold rounded-full px-3 py-1 inline-flex items-center gap-1 transition`}
              >
                <span>
                  {notifySubscribed
                    ? "You’re all set to be notified about our upcoming events!"
                    : "Want a heads-up? Tap to receive a notification"}
                </span>
                {!notifySubscribed && <Bell className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex gap-4 md:flex-1 md:justify-end">
              {upcoming.map((ev, i) => (
                <div key={i} className="w-[160px] sm:w-[180px] md:w-[200px]">
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
              <h3 className="font-extrabold text-2xl leading-tight mb-1">Recent Events</h3>
              <p className="text-xs mb-4">Here's What We've Been Up To!</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => scrollRef.current.scrollBy({ left: -220, behavior: "smooth" })}
                  aria-label="Previous"
                  className="text-gray-400 border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center hover:border-[#FF6F00] hover:text-[#FF6F00]"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-xs text-[#FF6F00] font-semibold">1/5</span>
                <button
                  onClick={() => scrollRef.current.scrollBy({ left: 220, behavior: "smooth" })}
                  aria-label="Next"
                  className="text-[#FF6F00] border border-[#FF6F00] rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#FF6F00] hover:text-white"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
              {recent.map((ev, i) => (
                <div key={i} className="snap-start shrink-0 w-[200px]">
                  <EventCard {...ev} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Events */}
        <section className="mb-12">
          <h3 className="font-extrabold text-xl mb-1 underline underline-offset-4 decoration-2 decoration-black">
            All Events
          </h3>
          <p className="text-xs mb-6 max-w-[220px]">
            From Classrooms to Celebrations, Every Event, Right Here!
          </p>
          <div className="flex items-start gap-6">
            {/* Months */}
            <div className="border-t border-gray-300 pt-4  text-xs text-gray-500 space-y-2  w-[160px] shrink-0">
              {months.map((m) => (
                <div key={m}>
                  {m}
                  {m === "December 2025" && (
                    <div className="mt-4 text-center">
                      <p className="text-gray-700 text-sm mb-2">
                        Re-occurring events will appear here
                      </p>
                      <div className="inline-block rounded-lg shadow-md overflow-hidden">
                        <img
                          alt="Orange desktop calendar with number 15"
                          className="w-[200px]"
                          src= {imageAssets.fif}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* All Events Grid */}
            <div className="grid grid-cols-2 gap-2 ml-40 flex-1">
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

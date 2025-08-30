import React, { useState, useRef, useEffect } from "react";
import { Filter, Bell, ChevronLeft, ChevronRight, Menu, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import imageAssets from "../../../assets/imageAssets";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { fetchEventFailure, fetchEventStart, fetchEventSuccess } from "../../../Store/eventSlice";
import { eventsService } from "../../../Services/Events";
import { event } from "../../../Types/Admin/eventType";

// ---------------- Types ----------------
interface EventCardProps {
  event?: event;
  image: string;
  dateTime: string;
  title: string;
  description: string;
  alt: string;
}

interface MonthData {
  name: string;
  isCurrent: boolean;
  isLastMonth: boolean;
}

// ---------------- Subcomponents ----------------
function EventCard({
  image,
  dateTime,
  title,
  description,
  alt,
}: EventCardProps): React.JSX.Element {
  return (
    <div className="group relative rounded-xl cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="w-full h-[200px] object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70"></div>

        {/* Date badge */}
        <div className="flex items-center gap-2 absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
          <div className="text-[10px] font-semibold text-gray-700 text-center">
            {dateTime.split("|")[0]?.trim() || "TBD"}
          </div>
          <div className="text-[8px] text-gray-500 text-center">
            {dateTime.split("|")[1]?.trim() || ""}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="text-white">
          {/* Title */}
          <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-orange-200 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[11px] leading-relaxed text-gray-200 line-clamp-2 mb-3">
            {description}
          </p>

          {/* Action section */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-[9px] text-orange-200 font-medium">Live Event</span>
            </div>

            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-semibold px-3 py-1.5 rounded-full hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}

// ---------------- Data ----------------
const filterOptions = ["All Events", "Upcoming", "Recent", "Past"];

const upcoming: EventCardProps[] = [
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

const recent: EventCardProps[] = [
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

// ---------------- Dynamic Months Generation Function ----------------
const generateDynamicMonths = (): MonthData[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const months: MonthData[] = [];

  // Generate 12 months starting from current month
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentMonth + i, 1);
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    months.push({
      name: `${monthName} ${year}`,
      isCurrent: i === 0,
      isLastMonth: i === 11,
    });
  }

  return months;
};

// ---------------- Main Component ----------------
export default function GuardianEvent() {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [notifySubscribed, setNotifySubscribed] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [months, setMonths] = useState<MonthData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventsPerPage] = useState<number>(8);

  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getEvents.listRecords) || [];
  const fetchedLoading = useSelector((state: RootState) => state.getEvents.loading);
  const error = useSelector((state: RootState) => state.getEvents.error);
  console.log(fetchedRecord);

  // fetch
  //  fetch events
  useEffect(() => {
    if (!fetchedLoading) {
      fetchEvents();
    }
  }, [dispatch]);

  const fetchEvents = async () => {
    dispatch(fetchEventStart());
    try {
      const data = await eventsService.getAllEvents();
      dispatch(fetchEventSuccess(data));
    } catch (err) {
      dispatch(fetchEventFailure((err as Error).message));
    }
  };

  // Initialize months on component mount and update periodically
  useEffect(() => {
    const updateMonths = () => {
      setMonths(generateDynamicMonths());
    };
    // Initial load
    updateMonths();
    // Update every minute to catch month changes
    const interval = setInterval(updateMonths, 60000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll for recent events
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = fetchedRecord.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(fetchedRecord.length / eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-2xl text-black min-h-screen flex">
      {/* Main Content */}
      <main className="flex-1 sm:px-6 lg:px-8 pt-4">
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button className="md:hidden text-gray-700" onClick={() => setSidebarOpen(true)}>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 md:p-8">
            <div className="md:flex-1 mb-6 md:mb-0">
              <h2 className="text-white font-extrabold text-3xl leading-tight mb-2">
                Upcoming
                <br />
                Events
              </h2>
              <p className="text-white text-xs mb-4 max-w-[120px]">
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
                    ? "You're all set to be notified!"
                    : "Tap to receive a notification"}
                </span>
                {!notifySubscribed && <Bell className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex gap-4 md:flex-1 md:justify-end">
              {upcoming.map((ev, i) => (
                <div key={i} className="w-[180px] md:w-[100%]">
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
                <div key={i} className="snap-start shrink-0 w-[220px] md:w-[45%]">
                  <EventCard {...ev} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Events Section */}
        <section className="mb-12">
          <div className="flex gap-8">
            {/* Sidebar with Dynamic Months */}
            <div className="w-64 flex-shrink-0">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-black mb-2">All Events</h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  From Classrooms to Celebrations,
                  <br />
                  Every Event, Right Here!
                </p>
              </div>

              {/* Dynamic Months List */}
              <div className="space-y-3">
                {months.map((month, index) => (
                  <div key={`${month.name}-${index}`}>
                    <div
                      className={`text-sm font-medium cursor-pointer transition-all duration-200 ${
                        month.isCurrent
                          ? "text-[#FF6F00] bg-orange-50 px-3 py-2 rounded-lg border-l-4 border-[#FF6F00] font-semibold"
                          : "text-gray-500 hover:text-gray-700 px-3 py-2"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{month.name}</span>
                        {month.isCurrent && (
                          <span className="text-xs bg-[#FF6F00] text-white px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Show calendar image after last month */}
                    {month.isLastMonth && (
                      <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm mb-4">
                          Re-occurring events will appear here
                        </p>
                        <div className="inline-block rounded-lg shadow-md overflow-hidden bg-white">
                          <div className="relative">
                            <img
                              alt="Orange desktop calendar"
                              className="w-48 h-36 object-cover"
                              src={imageAssets.fif}
                             
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Events Grid with Pagination */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {currentEvents.map((event, i) => (
                  <div key={i} className="w-full max-w-sm group cursor-pointer">
                    <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-100">
                      {/* Image Container */}
                      <div className="relative overflow-hidden">
                        <img
                          src={imageAssets.student}
                          alt={"image"}
                          className="w-full h-[200px] object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70"></div>

                        {/* Date badge */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                          <div className="text-[10px] font-semibold text-gray-700 text-center">
                            {event?.eventDate?.split("|")[0]?.trim() || "TBD"}
                          </div>
                          <div className="text-[8px] text-gray-500 text-center">
                            {event?.eventDate?.split("|")[1]?.trim() || ""}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="text-white">
                          {/* Title */}
                          <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-orange-200 transition-colors">
                            {event?.eventTitle}
                          </h3>

                          {/* Description */}
                          <p className="text-[11px] leading-relaxed text-gray-200 line-clamp-2 mb-3">
                            {event?.eventDescription}
                          </p>

                          {/* Action button */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                              <span className="text-[9px] text-orange-200 font-medium">
                                Live Event
                              </span>
                            </div>

                            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-semibold px-3 py-1.5 rounded-full hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {fetchedRecord.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 text-sm text-gray-600">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
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
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

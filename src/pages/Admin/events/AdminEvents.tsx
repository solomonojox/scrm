import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { eventsService } from "../../../Services/Events";
import {
  fetchEventFailure,
  fetchEventStart,
  fetchEventSuccess,
} from "../../../Store/eventSlice";
import EventTable from "./EventTable";
import EventForm from "./EventForm";

type ReligionFilter = "all" | "christian" | "muslim";

const AdminEvents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getEvents.listRecords) || [];
  const fetchedLoading = useSelector((state: RootState) => state.getEvents.loading);
  const error = useSelector((state: RootState) => state.getEvents.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] =
    useState<ReligionFilter>("all");

  const recordsPerPage = 5;

  //  filter logic
  const filteredRecords = useMemo(() => {
    const validFetched = Array.isArray(fetchedRecord) ? fetchedRecord : [];
    let filtered = validFetched;

    // if you later have religion/other filter field
    if (religionFilter !== "all") {
      filtered = filtered.filter(
        (event) => event?.eventType?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.eventTitle?.toLowerCase().includes(query) ||
          event.eventDescription?.toLowerCase().includes(query) ||
          event.eventVenue?.toLowerCase().includes(query) ||
          event.eventType?.toLowerCase().includes(query) ||
          event.eventDate?.toLowerCase().includes(query) ||
          event.eventTime?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, religionFilter]);

  // pagination
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

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

  // pagination control
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  // selection
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((e) => e.eventId));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const handleHeaderSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHeaderSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  // delete event
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventsService.deleteEvent(id);
      await fetchEvents();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <EventTable
          records={currentRecords}
          totalRecords={filteredRecords.length}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          headerSearchQuery={headerSearchQuery}
          religionFilter={religionFilter}
          selectedIds={selectedIds}
          selectAll={selectAll}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onHeaderSearchChange={handleHeaderSearchChange}
          onReligionFilterChange={setReligionFilter}
          onToggleSelectAll={toggleSelectAll}
          onToggleCheckbox={toggleCheckbox}
          onDelete={handleDelete}
          onAddEvent={() => setIsModalOpen(true)} 
          onRefresh={fetchEvents}
        />

        {isModalOpen && (
          <EventForm
            onClose={() => setIsModalOpen(false)}
            onEventAdded={fetchEvents} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminEvents;

import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import SessionTable from "./SessionTable";
import SessionForm from "./SessionForm";
import { Session } from "../../../Types/sessionType";
import { sessionService } from "../../../Services/Session";
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from "../../../Store/sessionSlice";

type ReligionFilter = 'all' | 'christian' | 'muslim';

const AdminSession: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getSession.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getSession.loading);
  const error = useSelector((state: RootState) => state.getSession.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>('all');

  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    if (religionFilter !== 'all') {
      filtered = filtered.filter((session: Session) =>
        session.sessionId?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((session: Session) =>
        session.id?.toLowerCase().includes(query) ||
        session.schoolId?.toLowerCase().includes(query) ||
        session.sessionId?.toLowerCase().includes(query) ||
        session.sessionName?.toLowerCase().includes(query) ||
        session.startDate?.toLowerCase().includes(query) ||
        session.endDate?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, religionFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  useEffect(() => {
    if (!fetchedLoading) {
      fetchSession();
    }
  }, [dispatch]);

  const fetchSession = async () => {
    dispatch(fetchSessionStart());
    try {
      const data = await sessionService.getAllRegisteredSessions();
      dispatch(fetchSessionSuccess(data));
    } catch (err) {
      dispatch(fetchSessionFailure((err as Error).message));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((g) => g.sessionId));
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const handleHeaderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await sessionService.delete(id);
      await fetchSession();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <SessionTable
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
          onAddSession={() => setIsModalOpen(true)}
          onRefresh={fetchSession}
        />

        {isModalOpen && (
          <SessionForm
            onClose={() => setIsModalOpen(false)}
            onSessionAdded={fetchSession}
          />
        )}
      </div>
    </div>
  );
};

export default AdminSession;
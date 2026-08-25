import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from "../../../Store/sessionSlice";
import { sessionTermService } from "../../../Services/SessionTerm";
import SessionTermTable from "./SessionTermTable";
import SessionTermForm from "./SessionTermForm";
import { SessionTerm } from "../../../Types/sessionTermType";
import { fetchSessionTermFailure, fetchSessionTermStart, fetchSessionTermSuccess } from "../../../Store/sessionTermSlice";

type ReligionFilter = 'all' | 'christian' | 'muslim';

const AdminSessionTerm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getSessionTerm.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getSessionTerm.loading);
  const error = useSelector((state: RootState) => state.getSessionTerm.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>('all');
  const [editData, setEditData] = useState<SessionTerm | null>(null);
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null);

  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    if (religionFilter !== 'all') {
      filtered = filtered.filter((term: SessionTerm) =>
        term.sessionTermId?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((term: SessionTerm) =>
        term.sessionTermId?.toLowerCase().includes(query) ||
        term.sessionId?.toLowerCase().includes(query) ||
        term.termName?.toLowerCase().includes(query) ||
        term.startDate?.toLowerCase().includes(query) ||
        term.endDate?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, religionFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const fetchSession = useCallback(async () => {
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) {
      toast.error("School ID not found");
      return;
    }

    dispatch(fetchSessionTermStart());
    try {
      const data = await sessionTermService.getAllRegisteredSessionTerm(schoolId);
      dispatch(fetchSessionTermSuccess(data));
    } catch (err) {
      dispatch(fetchSessionTermFailure((err as Error).message));
      toast.error("Failed to fetch sessions");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((g) => g.sessionTermId));
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
      await sessionTermService.delete(id);
      await fetchSession();
      toast.success("Deleted successfully!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleSetCurrentTerm = async (sessionTermId: string) => {
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) {
      toast.error("School ID not found");
      return;
    }

    setLoadingRowId(sessionTermId);
    try {
      await sessionTermService.setCurrentTerm(schoolId, sessionTermId);
      toast.success("Current term set successfully!");
      await fetchSession();
    } catch (error) {
      toast.error("Failed to set current term");
      console.error("Error setting current term:", error);
    } finally {
      setLoadingRowId(null);
    }
  };

  const handleAddSession = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEditSession = (data: SessionTerm) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-full mx-auto">
        <SessionTermTable
          records={currentRecords}
          totalRecords={filteredRecords.length}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          headerSearchQuery={headerSearchQuery}
          religionFilter={religionFilter}
          selectedIds={selectedIds}
          selectAll={selectAll}
          loadingRowId={loadingRowId}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onHeaderSearchChange={handleHeaderSearchChange}
          onReligionFilterChange={setReligionFilter}
          onToggleSelectAll={toggleSelectAll}
          onToggleCheckbox={toggleCheckbox}
          onDelete={handleDelete}
          onAddSession={handleAddSession}
          onRefresh={fetchSession}
          onEditSession={handleEditSession}
          onSetCurrentTerm={handleSetCurrentTerm}
        />

        {isModalOpen && (
          <SessionTermForm
            onClose={handleCloseModal}
            onSessionAdded={fetchSession}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminSessionTerm;

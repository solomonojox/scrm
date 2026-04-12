import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import {
  fetchGuardiansFailure,
  fetchGuardiansStart,
  fetchGuardiansSuccess,
} from "../../../Store/Guardian/guardianSlice";
import { guardianService } from "../../../Services/Guardian/guardian";
import GuardianTable from "./GuardianTable";
import GuardianForm from "./GuardianForm";;   // ← new import
import { Guardian } from "../../../Types/Guardian/guardianTypes";
import AdminGuardianDetails from "./AdminGuardianDetails";

type ReligionFilter = 'all' | 'christian' | 'muslim';

const AdminGuardian: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getGuardian.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getGuardian.loading);
  const error = useSelector((state: RootState) => state.getGuardian.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>('all');
  const [editData, setEditData] = useState<Guardian | null>(null);
  const [viewData, setViewData] = useState<Guardian | null>(null);  // ← new

  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;
    if (religionFilter !== 'all') {
      filtered = filtered.filter((g: Guardian) =>
        g.religion?.toLowerCase() === religionFilter
      );
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((g: Guardian) =>
        g.firstname?.toLowerCase().includes(query) ||
        g.lastname?.toLowerCase().includes(query) ||
        g.phone?.toLowerCase().includes(query) ||
        g.email?.toLowerCase().includes(query) ||
        g.nationality?.toLowerCase().includes(query) ||
        g.stateOfOrigin?.toLowerCase().includes(query) ||
        g.religion?.toLowerCase().includes(query) ||
        g.homeAddress?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [fetchedRecord, searchQuery, religionFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  useEffect(() => {
    if (!fetchedLoading) fetchGuardian();
  }, [dispatch]);

  const fetchGuardian = async () => {
    dispatch(fetchGuardiansStart());
    try {
      const data = await guardianService.getAll(localStorage.getItem('schoolId'));
      dispatch(fetchGuardiansSuccess(data));
    } catch (err) {
      dispatch(fetchGuardiansFailure((err as Error).message));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectAll) setSelectedIds([]);
    else setSelectedIds(currentRecords.map((g) => g.guardianId));
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
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
    if (!window.confirm("Are you sure you want to delete this guardian?")) return;
    try {
      await guardianService.delete(id);
      await fetchGuardian();
      toast.success("Deleted!");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ← open edit from details view
  const handleEditFromDetails = (guardian: Guardian) => {
    setEditData(guardian);
    setViewData(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:py-6 md:py-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">

        {/* ← show details panel when a guardian is selected for viewing */}
        {viewData ? (
          <AdminGuardianDetails
            guardian={viewData}
            onBack={() => setViewData(null)}
            onEdit={handleEditFromDetails}
            onDelete={async (id: any) => {
              await handleDelete(id);
              setViewData(null);
            }}
          />
        ) : (
          <GuardianTable
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
            onAddGuardian={() => setIsModalOpen(true)}
            onRefresh={fetchGuardian}
            setEditData={setEditData}
            onViewGuardian={setViewData}   // ← pass down to table
          />
        )}

        {isModalOpen && (
          <GuardianForm
            onClose={() => { setIsModalOpen(false); setEditData(null); }}
            onGuardianAdded={fetchGuardian}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminGuardian;
import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import {
  fetchGuardiansFailure,
  fetchGuardiansStart,
  fetchGuardiansSuccess,
} from "../../../Store/Guardian/guardianSlice";
import { guardianService } from "../../../Services/Guardian/guardian";
import GuardianTable from "./GuardianTable";
import GuardianForm from "./GuardianForm";
import { Guardian } from "../../../Types/Guardian/guardianTypes";

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
  
  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    if (religionFilter !== 'all') {
      filtered = filtered.filter((guardian: Guardian) =>
        guardian.religion?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((guardian: Guardian) =>
        guardian.firstname?.toLowerCase().includes(query) ||
        guardian.lastname?.toLowerCase().includes(query) ||
        guardian.phone?.toLowerCase().includes(query) ||
        guardian.email?.toLowerCase().includes(query) ||
        guardian.nationality?.toLowerCase().includes(query) ||
        guardian.stateOfOrigin?.toLowerCase().includes(query) ||
        guardian.religion?.toLowerCase().includes(query) ||
        guardian.homeAddress?.toLowerCase().includes(query)
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
      fetchGuardian();
    }
  }, [dispatch]);

  const fetchGuardian = async () => {
    dispatch(fetchGuardiansStart());
    try {
      const data = await guardianService.getAll();
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
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((g) => g.guardianId));
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
    if (!window.confirm("Are you sure you want to delete this guardian?")) return;
    try {
      await guardianService.delete(id);
      await fetchGuardian();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
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
        />

        {isModalOpen && (
          <GuardianForm
            onClose={() => setIsModalOpen(false)}
            onGuardianAdded={fetchGuardian}
          />
        )}
      </div>
    </div>
  );
};

export default AdminGuardian;
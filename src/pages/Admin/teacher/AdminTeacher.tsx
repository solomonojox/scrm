import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { guardianService } from "../../../Services/Guardian/guardian";
import TeacherForm from "./TeacherForm";
import TeacherTable from "./TeacherTable";
import { TeacherType } from "../../../Types/Teacher/teacherType";
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from "../../../Store/Teachers/teacherSlice";
import { teacherService } from "../../../Services/Teachers/TeacherService";

type ReligionFilter = 'all' | 'christian' | 'muslim';

const AdminTeacher: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getTeacher.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getTeacher.loading);
  const error = useSelector((state: RootState) => state.getTeacher.error);
  
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
      filtered = filtered.filter((guardian: TeacherType) =>
        guardian.religion?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((guardian: TeacherType) =>
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
      fetchTeacher();
    }
  }, [dispatch]);

  const fetchTeacher = async () => {
    dispatch(fetchTeacherStart());
    try {
      const data = await teacherService.getAll();
      dispatch(fetchTeacherSuccess(data));
    } catch (err) {
      dispatch(fetchTeacherFailure((err as Error).message));
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
      setSelectedIds(currentRecords.map((g) => g.teacherId));
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
    if (!window.confirm("Are you sure you want to delete this Teacher?")) return;
    try {
      await teacherService.delete(id);
      await fetchTeacher();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:py-6 md:py-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <TeacherTable
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
          onRefresh={fetchTeacher}
        />

        {isModalOpen && (
          <TeacherForm
            onClose={() => setIsModalOpen(false)}
            onGuardianAdded={fetchTeacher}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTeacher;
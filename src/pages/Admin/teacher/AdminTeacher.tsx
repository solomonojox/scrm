import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from "../../../Store/Teachers/teacherSlice";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import TeacherForm from "./TeacherForm";
import TeacherTable from "./TeacherTable";
import { TeacherType } from "../../../Types/Teacher/teacherType";
import AdminTeacherDetails from "./AdminTeacherDetails";

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
  const [editData, setEditData] = useState<TeacherType | null>(null);
  const [viewData, setViewData] = useState<TeacherType | null>(null);  // ← new

  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    if (religionFilter !== 'all') {
      filtered = filtered.filter((t: TeacherType) =>
        t.religion?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t: TeacherType) =>
        t.firstname?.toLowerCase().includes(query) ||
        t.lastname?.toLowerCase().includes(query) ||
        t.phone?.toLowerCase().includes(query) ||
        t.email?.toLowerCase().includes(query) ||
        t.nationality?.toLowerCase().includes(query) ||
        t.stateOfOrigin?.toLowerCase().includes(query) ||
        t.religion?.toLowerCase().includes(query) ||
        t.homeAddress?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, religionFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  useEffect(() => {
    if (!fetchedLoading) fetchTeacher();
  }, [dispatch]);

  const fetchTeacher = async () => {
    dispatch(fetchTeacherStart());
    try {
      const data = await teacherService.getAll(localStorage.getItem('schoolId'));
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
    if (selectAll) setSelectedIds([]);
    else setSelectedIds(currentRecords.map((t: TeacherType) => t.teacherId?? ""));
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
    if (!window.confirm("Are you sure you want to delete this Teacher?")) return;
    try {
      await teacherService.delete(id);
      await fetchTeacher();
      toast.success("Deleted!");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEditFromDetails = (teacher: TeacherType) => {
    setEditData(teacher);
    setViewData(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:py-6 md:py-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">

        {viewData ? (
          <AdminTeacherDetails
            teacher={viewData}
            onBack={() => setViewData(null)}
            onEdit={handleEditFromDetails}
            onDelete={async (id) => {
              await handleDelete(id);
              setViewData(null);
            }}
          />
        ) : (
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
            setEditData={setEditData}
            onAddStudent={() => setIsModalOpen(true)}
            onViewTeacher={setViewData}   // ← pass down to table
          />
        )}

        {isModalOpen && (
          <TeacherForm
            onClose={() => { setIsModalOpen(false); setEditData(null); }}
            onSubmitSuccess={() => { fetchTeacher(); setIsModalOpen(false); setEditData(null); }}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTeacher;
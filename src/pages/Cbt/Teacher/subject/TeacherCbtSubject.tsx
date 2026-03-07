import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import CbtSubjectTable from "./CbtSubjectTable";
import CbtSubjectForm from "./CbtSubjectForm";
import { AppDispatch, RootState } from "../../../../Store/store";
import { CbtSubjectType } from "../../../../Types/Cbt/cbtTypes";
import { teacherSubjectService } from "../../../../Services/Teachers/subject/TeacherSubjectService";
import { fetchCbtSubjectStart , fetchCbtSubjectFailure, fetchCbtSubjectSuccess} from "../../../../Store/cbt/cbtSlice";


type ReligionFilter = 'all' | 'christian' | 'muslim';

const TeacherCbtSubject: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getCbtSubject.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getCbtSubject.loading);
  const error = useSelector((state: RootState) => state.getCbtSubject.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>('all');
  const [editData, setEditData] = useState<any>(null);

  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    if (religionFilter !== 'all') {
      filtered = filtered.filter((cbtSubject: CbtSubjectType) =>
        cbtSubject.subjectId?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((cbtSubject: CbtSubjectType) =>
        cbtSubject.subjectName.toLowerCase().includes(query) ||
        cbtSubject.description.toLowerCase().includes(query)
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
      fetchCbtSubject();
    }
  }, [dispatch]);

  const fetchCbtSubject = async () => {
    dispatch(fetchCbtSubjectStart());
    try {
      const data = await teacherSubjectService.getAll();
      dispatch(fetchCbtSubjectSuccess(data));
    } catch (err) {
      dispatch(fetchCbtSubjectFailure((err as Error).message));
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
      setSelectedIds(currentRecords.map((g: CbtSubjectType) => g.subjectId));
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
    try {
      await teacherSubjectService.delete(id);
      await fetchCbtSubject();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <CbtSubjectTable
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
          onRefresh={fetchCbtSubject}
          setEditData={setEditData}
        />

        {isModalOpen && (
          <CbtSubjectForm
            onClose={() => {
              setIsModalOpen(false);
              setEditData(null);
            }}
            onSessionAdded={fetchCbtSubject}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherCbtSubject;
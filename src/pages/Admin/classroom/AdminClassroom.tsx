import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { guardianService } from "../../../Services/Guardian/guardian";
import ClassroomTable from "./ClassroomTable";
import ClassroomForm from "./ClassroomForm";
import { classrooms } from "../../../Types/classroomTypes";
import { classroomService } from "../../../Services/Classroom";
import ViewClassroomModal from "../../../components/Admin/classroom/ViewClassroomModal";
import { fetchClassroomsFailure, fetchClassroomsStart, fetchClassroomsSuccess } from "../../../Store/Admin/classroomSlice";

type ReligionFilter = 'all' | 'christian' | 'muslim';

const AdminClassroom: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getClassrooms.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getClassrooms.loading);
  const error = useSelector((state: RootState) => state.getClassrooms.error);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openViewDetailModal, setOpenViewDetailModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>('all');
  const [classroomDetails, setClassroomDetails]= useState<classrooms>()
  
  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    if (religionFilter !== 'all') {
      filtered = filtered.filter((classroom: classrooms) =>
        classroom.name?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((classroom: classrooms) =>
        classroom.name?.toLowerCase().includes(query) ||
        classroom.capacity ||
        classroom.classroomId?.toLowerCase().includes(query) ||
        classroom.teacherId?.toLowerCase().includes(query)

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
      fetchClassroom();
    }
  }, [dispatch]);

  const fetchClassroom = async () => {
    dispatch(fetchClassroomsStart());
    try {
      const data = await classroomService.getAllClassrooms();
      dispatch(fetchClassroomsSuccess(data));
    } catch (err) {
      dispatch(fetchClassroomsFailure((err as Error).message));
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
      setSelectedIds(currentRecords.map((c) => c.classroomId));
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
      await fetchClassroom();
      toast.success("Deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleViewDetails = (classroom: classrooms)=> {
    console.log(classroom)
    setClassroomDetails(classroom)
    setOpenViewDetailModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        <ClassroomTable
          allRecords={fetchedRecord}
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
          onRefresh={fetchClassroom}
          viewDetails={handleViewDetails}
        />

        {isModalOpen && (
          <ClassroomForm
            onClose={() => setIsModalOpen(false)}
            onGuardianAdded={fetchClassroom}
          />
        )}

        {
          openViewDetailModal && (
            <ViewClassroomModal 
              closeViewModal={()=> setOpenViewDetailModal(false)}
              classroomDetails={classroomDetails}
            />
          )
        }
      </div>
    </div>
  );
};

export default AdminClassroom;
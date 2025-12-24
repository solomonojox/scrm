// src/pages/Student/Student.tsx
import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../Context/Auth/useAuth";
import ResultTable from "./ResultTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { fetchGuardiansStudentFailure, fetchGuardiansStudentStart, fetchGuardiansStudentSuccess } from "../../../Store/Guardian/guardianStudentSlice";
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from "../../../Store/sessionSlice";
import { guardianStudentService } from "../../../Services/Guardian/guardianStudent";
import { sessionService } from "../../../Services/Session";

const GuardianResult: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const students: any = useSelector((state: RootState) => state.getGuardianStudents.listRecords);
  const sessions: any = useSelector((state: RootState) => state.getSession.listRecords);
  const loading = useSelector((state: RootState) => state.getGuardianStudents.loading);
  const error = useSelector((state: RootState) => state.getGuardianStudents.error);

  const fetchedRecord = [
    {
      id: 1,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Examination",
      TeachersName: "Mabel Billy",
      Action: "view", // Assuming the eye icon represents a view action
    },
    {
      id: 2,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Mid Term Test",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
    {
      id: 3,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Examination",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
    {
      id: 4,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Mid Term Test",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
    {
      id: 5,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Examination",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
    {
      id: 6,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Mid Term Test",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
    {
      id: 7,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Examination",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
    {
      id: 8,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Mid Term Test",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
    {
      id: 9,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Examination",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
    {
      id: 10,
      SN: 10001,
      StudentID: 234567,
      Class: "Jss1",
      Term: "First Term",
      Session: "2024/2025",
      Assessment: "Mid Term Test",
      TeachersName: "Mabel Billy",
      Action: "view",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<"all" | string>("all");
  const [editData, setEditData] = useState<any>(null);
  const recordsPerPage = 5;

  // Filter students based on search and class filter
  const filteredRecords = useMemo(() => {
    let filtered = students;

    // Apply class filter
    if (classFilter !== "all") {
      filtered = filtered.filter((student: any) => student.enteredClass === classFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student: any) =>
          student.firstname?.toLowerCase().includes(query) ||
          student.lastname?.toLowerCase().includes(query) ||
          student.homeAddress?.toLowerCase().includes(query) ||
          student.guardianId?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, classFilter]);

  // Pagination logic
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // // Fetch students
  useEffect(() => {
    fetchPupils();
  }, [dispatch, user]);

  const fetchPupils = async () => {
    dispatch(fetchGuardiansStudentStart());
    dispatch(fetchSessionStart());
    try {
      if (user?.id) {
        const response = await guardianStudentService.getAll(user?.id);
        // console.log(response)
        const session = await sessionService.getAllRegisteredSessions(localStorage.getItem('schoolId'));
        dispatch(fetchGuardiansStudentSuccess(response));
        dispatch(fetchSessionSuccess(session));
      }
    } catch (error) {
      console.error('Error fetching pupils:', error);
      dispatch(fetchGuardiansStudentFailure((error as Error).message));
      dispatch(fetchSessionFailure((error as Error).message));
    }
  };

  return (
    <div className="">
      <ToastContainer />
      <div className="">
        {/* Table Component */}
        <ResultTable
          resultRecord={currentRecords}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          searchQuery={searchQuery}
          classFilter={classFilter}
          onClassFilterChange={setClassFilter}
          setEditData={setEditData}
        />
      </div>
    </div>
  );
};

export default GuardianResult;

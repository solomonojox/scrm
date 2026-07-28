// StudentPromotion.tsx (Main Component - Clean and Concise)
import React, { useCallback, useEffect, useState } from "react";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { STUDENTS_BY_CLASS } from "./student-promotion/student-promotion";
import { StudentPromotionType } from "./student-promotion/student-promotion-type";
import {
  StatsCard,
  ClassSelector,
  StudentList,
  PromotionActions,
  ClassOverview,
  EmptyState,
} from "./student-promotion/StudentPromotionUI";
import { ConfirmModal, SuccessBanner } from "./student-promotion/Modals";
import { AppDispatch, RootState } from "../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomsFailure, fetchClassroomsStart, fetchClassroomsSuccess } from "../../../Store/Admin/classroomSlice";
import { classroomService } from "../../../Services/Classroom";
import { fetchClassroomStudentsStart, fetchClassroomStudentsSuccess, fetchClassroomStudentsFailure } from "../../../Store/Admin/classroomStudentsSlice";
import { promoteService } from "../../../Services/promote";
import { useAuth } from "../../../Context/Auth/useAuth";

const StudentPromotion: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const fetchedLoading = useSelector((state: RootState) => state.getClassrooms.loading);
  const studentss = useSelector((state: RootState) => state.getStudentsByClassId.listRecords);
  const classes = useSelector((state: RootState) => state.getClassrooms.listRecords);
  const [classData, setClassData] = useState<Record<string, StudentPromotionType[]>>(STUDENTS_BY_CLASS);
  const [fromClassId, setFromClassId] = useState<string>("");
  // console.log(classes)
  // console.log(fromClassId)
  const [toClassId, setToClassId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // console.log(selectedIds)
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fromClass = classes.find((c) => c.classroomId === fromClassId);
  const toClass = classes.find((c) => c.classroomId === toClassId);
  const students = fromClassId ? (classData[fromClassId] ?? []) : [];
  const filtered = studentss.filter((s) => s?.firstname?.toLowerCase().includes(search.toLowerCase()));

  const allSelected = filtered.length > 0 && filtered.every((s) => selectedIds.has(s.studentId));
  const validTarget = toClassId && toClassId !== fromClassId;
  const canPromote = selectedIds.size > 0 && validTarget;

  useEffect(() => {
    if (!fetchedLoading) {
      fetchClassroom();
    }
  }, [dispatch]);

  const fetchClassroom = async () => {
    dispatch(fetchClassroomsStart());
    try {
      const data = await classroomService.getClassroomBySchoolId(localStorage.getItem("schoolId"));
      dispatch(fetchClassroomsSuccess(data));
    } catch (err) {
      dispatch(fetchClassroomsFailure((err as Error).message));
    }
  };

  const fetchClassroomStudents = useCallback(async () => {
    if (!fromClassId) return;

    dispatch(fetchClassroomStudentsStart());
    try {
      const data = await classroomService.getStudentsByClassroomId(fromClassId);

      dispatch(fetchClassroomStudentsSuccess(data));
    } catch (err) {
      dispatch(fetchClassroomStudentsFailure((err as Error).message));
    }
  }, [fromClassId, dispatch]);

  // Fetch on mount only
  useEffect(() => {
    fetchClassroomStudents();
  }, [fromClassId]);

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allSelected) filtered.forEach((s) => next.delete(s.studentId));
    else filtered.forEach((s) => next.add(s.studentId));
    setSelectedIds(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const confirmPromote = async () => {
    try {
      await promoteService.promoteStudents({
        sessionId: user?.sessionId ?? "",
        targetClassroomId: toClassId,
        studentIds: Array.from(selectedIds)
      });
    } catch (error) {
      console.error("PromoteStudents error:", error);
    }
    const promoted = students.filter((s) => selectedIds.has(s.id));
    setClassData((prev) => ({
      ...prev,
      [fromClassId]: (prev[fromClassId] ?? []).filter((s) => !selectedIds.has(s.id)),
      [toClassId]: [...(prev[toClassId] ?? []), ...promoted],
    }));
    setSuccessMsg(`Students promoted successfully`);
    setSelectedIds(new Set());
    setFromClassId("");
    setToClassId("");
    setSearch("");
    setShowConfirm(false);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  return (
    <div className="w-full min-h-screen p-4 sm:py-6 md:py-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        {/* <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard label="Total Classes" value={classes.length} icon={BookOpen} color="text-blue-600 bg-blue-50" />
          <StatsCard label="Total Students" value={Object.values(classData).flat().length} icon={Users} color="text-emerald-600 bg-emerald-50" />
          <StatsCard label="Selected for Promotion" value={selectedIds.size} icon={GraduationCap} color="text-amber-600 bg-amber-50" />
        </div> */}

        {/* Promotion Panel */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4.5 h-4.5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Bulk Class Promotion</h2>
            </div>
            {selectedIds.size > 0 && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                {selectedIds.size} student{selectedIds.size !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          <ClassSelector
            fromClassId={fromClassId}
            toClassId={toClassId}
            classes={classes}
            classData={classData}
            onFromChange={(id) => { setFromClassId(id); setSelectedIds(new Set()); setSearch(""); }}
            onToChange={setToClassId}
            canPromote={canPromote}
          />

          {fromClassId ? (
            <>
              <StudentList
                filteredStudents={filtered}
                selectedIds={selectedIds}
                search={search}
                onSearchChange={setSearch}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
              />
              <PromotionActions
                selectedIds={selectedIds}
                toClassName={toClass?.name}
                canPromote={canPromote}
                onClear={() => setSelectedIds(new Set())}
                onPromote={() => setShowConfirm(true)}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* <ClassOverview classes={CLASSES} classData={classData} fromClassId={fromClassId} toClassId={toClassId} /> */}
      </div>

      <ConfirmModal
        open={showConfirm}
        fromClass={fromClass?.name ?? ""}
        toClass={toClass?.name ?? ""}
        count={selectedIds.size}
        onConfirm={confirmPromote}
        onCancel={() => setShowConfirm(false)}
      />
      {successMsg && <SuccessBanner message={successMsg} onDismiss={() => setSuccessMsg("")} />}
    </div>
  );
};

export default StudentPromotion;

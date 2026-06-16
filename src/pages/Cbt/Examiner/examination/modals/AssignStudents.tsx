import React from "react";
import { Badge, Btn, ConfirmDialog, Modal } from "../../../../../components/ui/CbtSharedComponents";
import { Examination, Student } from "../AdminCbtExaminationsPage";

interface Props {
  assignModal: boolean;
  assigning: boolean;
  fetchingStudents: boolean;
  setAssignModal: (assignModal: boolean) => void;
  toggleSelection: (id: string) => void;
  assignTarget: Examination | null;
  students: Student[];
  selectedStudents: string[];
  saveAssignment: () => void
}

const AssignStudents: React.FC<Props> = ({
  assignModal,
  setAssignModal,
  assigning,
  toggleSelection,
  assignTarget, fetchingStudents,
  students,
  selectedStudents,
  saveAssignment
}) => {
  return (
    <Modal
      open={assignModal}
      onClose={() => !assigning && setAssignModal(false)}
      title={`Assign Students — ${assignTarget?.title ?? ""}`}
    >
      <div className="space-y-4">
        {fetchingStudents ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="text-sm text-gray-400">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No students found for this school.
          </p>
        ) : (
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {students.map((student) => {
              const isAlreadyAssigned = assignTarget?.assignedStudents?.some(s => s.studentId === student.studentId) || false;
              const selected = selectedStudents.includes(student.studentId);
              const initials = student.firstname
                ?.split(" ")
                ?.map((n) => n[0])
                ?.slice(0, 2)
                ?.join("");
              const hue =
                student?.firstname?.split("")?.reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
              return (
                <button
                  key={student.studentId}
                  onClick={() => !isAlreadyAssigned && toggleSelection(student.studentId)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${selected
                    ? "border-orange-300 bg-orange-50 ring-2 ring-orange-200"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    } ${isAlreadyAssigned ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                    style={{ background: `hsl(${hue},65%,52%)` }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{student.firstname} {student.lastname}</p>
                    <p className="text-xs text-gray-400">{student.gender}</p>
                    {isAlreadyAssigned && (
                      <p className="text-xs text-orange-500 mt-0.5">Already assigned</p>
                    )}
                  </div>
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selected ? "border-orange-500 bg-orange-500" : "border-gray-300"
                      }`}
                  >
                    {selected && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedStudents.length > 0 && (
          <p className="text-xs font-medium text-orange-600">
            {selectedStudents.length} student{selectedStudents.length > 1 ? "s" : ""} selected
          </p>
        )}

        <div className="h-px bg-gray-100" />
        <div className="flex gap-3">
          <Btn
            variant="outline"
            onClick={() => setAssignModal(false)}
            disabled={assigning}
            className="flex-1"
          >
            Cancel
          </Btn>
          <Btn
            onClick={saveAssignment}
            disabled={assigning || selectedStudents.length === 0}
            loading={assigning}
            className="flex-1"
          >
            {assigning ? "Assigning…" : `Assign ${selectedStudents.length > 0 ? selectedStudents.length : ""} Student${selectedStudents.length !== 1 ? "s" : ""}`}
          </Btn>
        </div>
      </div>
    </Modal>
  )
}

export default AssignStudents

// AssignClassroom.tsx
import React, { useCallback, useEffect, useState } from "react";
import { School, UserCheck, GraduationCap } from "lucide-react";
import { AppDispatch, RootState } from "../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} from "../../../Store/Admin/classroomSlice";
import { classroomService } from "../../../Services/Classroom";
import { useAuth } from "../../../Context/Auth/useAuth";
import { toast } from "react-toastify";

interface AssignClassroomProps {
  onClose: () => void;
  studentId: string;
}

const AssignClassroom: React.FC<AssignClassroomProps> = ({
  onClose,
  studentId,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const fetchedLoading = useSelector(
    (state: RootState) => state.getClassrooms.loading
  );
  const classes = useSelector(
    (state: RootState) => state.getClassrooms.listRecords
  );

  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const selectedClassroom = classes.find(
    (c) => c.classroomId === selectedClassroomId
  );

  // Fetch classrooms on mount
  useEffect(() => {
    if (!fetchedLoading) {
      fetchClassroom();
    }
  }, [dispatch]);

  const fetchClassroom = async () => {
    dispatch(fetchClassroomsStart());
    try {
      const data = await classroomService.getClassroomBySchoolId(
        localStorage.getItem("schoolId") || user?.schoolId || ""
      );
      dispatch(fetchClassroomsSuccess(data));
    } catch (err) {
      dispatch(fetchClassroomsFailure((err as Error).message));
    }
  };

  // Filter classrooms by search
  const filteredClasses = classes.filter((c) =>
    c?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = useCallback(async () => {
    if (!selectedClassroomId) {
      setApiError("Please select a classroom");
      return;
    }

    if (!studentId) {
      setApiError("Student information is missing");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      await classroomService.assignStudent(selectedClassroomId, studentId);

      toast.success("Student assigned to classroom successfully");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setApiError(errorMessage);
      toast.error("Failed to assign student to classroom");
    } finally {
      setIsLoading(false);
    }
  }, [selectedClassroomId, studentId, onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-gray-800">
              Assign Classroom
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* API Error Display */}
        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        {/* Student Info Display */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Student ID</p>
              <p className="text-sm text-blue-800 font-mono">{studentId}</p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-6 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Classroom
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by classroom name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Classroom List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {fetchedLoading ? (
            <div className="flex items-center justify-center py-8">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="ml-2 text-sm text-gray-500">
                Loading classrooms...
              </span>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-8">
              <School className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {search
                  ? "No classrooms match your search"
                  : "No classrooms available"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClasses.map((classroom) => {
                const isSelected =
                  selectedClassroomId === classroom.classroomId;
                return (
                  <button
                    key={classroom.classroomId}
                    type="button"
                    onClick={() =>
                      setSelectedClassroomId(classroom.classroomId)
                    }
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <School className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {classroom.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Capacity: {classroom.capacity}
                          {classroom.teacher && (
                            <span className="ml-2">
                              • Teacher: {classroom.teacher.firstname}{" "}
                              {classroom.teacher.lastname}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Classroom Info */}
        {selectedClassroom && (
          <div className="px-6 pb-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md">
              <p className="text-xs text-emerald-600 font-medium">
                Selected Classroom
              </p>
              <p className="text-sm text-emerald-800 font-semibold">
                {selectedClassroom.name}
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={isLoading || !selectedClassroomId}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 rounded-md transition-colors flex items-center justify-center min-w-30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Assigning...
              </>
            ) : (
              "Assign Classroom"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignClassroom;

import React, { useEffect, useState } from "react";
import ContactList from "./ContactList";
import ChatInterface from "./ChatInterface";
import VideoCallInterface from "../../../components/Guardian/messages/modal/VideoCallInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { useAuth } from "../../../Context/Auth/useAuth";
import {
  fetchGuardiansStudentFailure,
  fetchGuardiansStudentStart,
  fetchGuardiansStudentSuccess,
} from "../../../Store/Guardian/guardianStudentSlice";
import { guardianStudentService } from "../../../Services/Guardian/guardianStudent";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import {
  fetchTeacherFailure,
  fetchTeacherStart,
  fetchTeacherSuccess,
} from "../../../Store/Teachers/teacherSlice";
import { TeacherType } from "../../../Types/Teacher/teacherType";
import {
  fetchAdminFailure,
  fetchAdminStart,
  fetchAdminSuccess,
} from "../../../Store/Admin/adminSlice";
import { adminService } from "../../../Services/Admin/adminService";
import { AdminType } from "../../../Types/Admin/adminType";

const GuardianMessages: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherType | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminType | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const studentsTeachers = useSelector((state: RootState) => state.getTeacher.listRecords) || [];
  const admin = useSelector((state: RootState) => state.getAdmin.listRecords) || [];
  const loading = useSelector((state: RootState) => state.getGuardianStudents.loading);
  const error = useSelector((state: RootState) => state.getGuardianStudents.error);

  // ✅ Select teacher
  const handleSelectTeacher = (teacher: TeacherType) => {
    setSelectedTeacher(teacher);
    setSelectedAdmin(null);
  };

  // ✅ Select admin
  const handleSelectAdmin = (admin: AdminType) => {
    setSelectedAdmin(admin);
    setSelectedTeacher(null);
  };

  // Video call handlers
  const handleStartCall = () => setIsCalling(true);
  const handleEndCall = () => setIsCalling(false);
  const handleToggleMute = () => setIsMuted((p) => !p);
  const handleToggleVideo = () => setIsVideoOff((p) => !p);

  // Back button (reset selection)
  const handleBack = () => {
    setSelectedTeacher(null);
    setSelectedAdmin(null);
  };

  // Recording placeholder
  const handleStartRecording = () => {
    console.log("Recording started...");
    // TODO: Implement MediaRecorder API
  };

  // ✅ Fetch pupils & related data
  useEffect(() => {
    if (user) {
      fetchPupils();
    }
  }, [dispatch, user]);

  const fetchPupils = async () => {
    dispatch(fetchGuardiansStudentStart());
    dispatch(fetchTeacherStart());
    dispatch(fetchAdminStart());

    try {
      if (user?.id) {
        // Step 1: Fetch guardian students
        const students = await guardianStudentService.getAll(user.id);

        // Step 2: Convert into the shape TeacherService expects
        const teacherIdsWrapped = students.map((s: any) => ({
          teacher: { teacherId: s.teacherId },
        }));

        // Step 3: Fetch teachers
        const teachers = await teacherService.getArrayOfTeachersById(teacherIdsWrapped);

        // Step 4: Fetch admins by school
        const admins = await adminService.getAdminBySchoolId(user.schoolId);

        // Step 5: Dispatch to Redux
        dispatch(fetchGuardiansStudentSuccess(students));
        dispatch(fetchTeacherSuccess(teachers));
        dispatch(fetchAdminSuccess(admins));
      }
    } catch (err) {
      const message = (err as Error).message || "Something went wrong";
      console.error("Error fetching pupils:", message);

      dispatch(fetchGuardiansStudentFailure(message));
      dispatch(fetchTeacherFailure(message));
      dispatch(fetchAdminFailure(message));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[450px] px-2 md:px-4 lg:px-0">
      {/* Contact list */}
      <div
        className={`${
          selectedTeacher || selectedAdmin ? "hidden lg:flex" : "flex"
        } flex-1 lg:max-w-xs`}
      >
        <ContactList
          teachers={studentsTeachers}
          selectedTeacher={selectedTeacher}
          onSelectTeacher={handleSelectTeacher}
          admin={admin}
          selectedAdmin={selectedAdmin}
          onSelectAdmin={handleSelectAdmin} // ✅ fixed
        />
      </div>

      {/* Chat / Placeholder (desktop) */}
      <div className="flex-1 hidden lg:flex">
        {selectedTeacher || selectedAdmin ? (
          <ChatInterface
            selectedTeacher={selectedTeacher}
            selectedAdmin={selectedAdmin}
            onStartCall={handleStartCall}
            onBack={handleBack}
            onStartRecording={handleStartRecording}
          />
        ) : (
          <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-base">Select a teacher or admin to start chatting</p>
          </div>
        )}
      </div>

      {/* Chat (mobile) */}
      <div className={`${selectedTeacher || selectedAdmin ? "flex lg:hidden" : "hidden"} flex-1`}>
        <ChatInterface
          selectedTeacher={selectedTeacher}
          selectedAdmin={selectedAdmin}
          onStartCall={handleStartCall}
          onBack={handleBack}
          onStartRecording={handleStartRecording}
        />
      </div>

      {/* Video Call Modal */}
      {isCalling && (selectedTeacher || selectedAdmin) && (
        <VideoCallInterface
          selectedTeacher={selectedTeacher}
          selectedAdmin={selectedAdmin}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMute={handleToggleMute}
          onToggleVideo={handleToggleVideo}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
};

export default GuardianMessages;

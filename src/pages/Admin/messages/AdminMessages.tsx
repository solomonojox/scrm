import React, { useEffect, useState } from "react";
import ContactList from "./ContactList";
import ChatInterface from "./ChatInterface";
import VideoCallInterface from "../../../components/Admin/messages/modal/VideoCallInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { useAuth } from "../../../Context/Auth/useAuth";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import {
  fetchTeacherFailure,
  fetchTeacherStart,
  fetchTeacherSuccess,
} from "../../../Store/Teachers/teacherSlice";
import { TeacherType } from "../../../Types/Teacher/teacherType";
import { Guardian } from "../../../Types/Guardian/guardianTypes";
import { guardianService } from "../../../Services/Guardian/guardian";
import {
  fetchGuardiansFailure,
  fetchGuardiansStart,
  fetchGuardiansSuccess,
} from "../../../Store/Guardian/guardianSlice";

const AdminMessages: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherType | null>(null);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const recordedTeachers = useSelector((state: RootState) => state.getTeacher.listRecords) || [];
  const recordedGuardians = useSelector((state: RootState) => state.getGuardian.listRecords) || [];
  const loading = useSelector((state: RootState) => state.getGuardianStudents.loading);
  const error = useSelector((state: RootState) => state.getGuardianStudents.error);

  // ✅ Select teacher
  const handleSelectTeacher = (teacher: TeacherType) => {
    setSelectedTeacher(teacher);
    setSelectedGuardian(null);
  };

  // // ✅ Select guardian
  const handleSelectGuardian = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
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
    setSelectedGuardian(null);
  };

  // Recording placeholder
  const handleStartRecording = () => {
    console.log("Recording started...");
    // TODO: Implement MediaRecorder API
  };

  // ✅ Fetch pupils & related data
  useEffect(() => {
    if (user || !loading) {
      fetchContact();
    }
  }, [dispatch, user]);

  const fetchContact = async () => {
    dispatch(fetchTeacherStart());
    dispatch(fetchGuardiansStart());

    try {
      if (user) {
        const teachers = await teacherService.getAllBySchoolId(user.schoolId);
        const guardians = await guardianService.getGuardianBySchoolId(user?.schoolId);
        dispatch(fetchTeacherSuccess(teachers));
        dispatch(fetchGuardiansSuccess(guardians));
      }
    } catch (err) {
      const message = (err as Error).message || "Something went wrong";
      console.error("Error fetching pupils:", message);

      dispatch(fetchTeacherFailure(message));
      dispatch(fetchGuardiansFailure(message));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[450px] px-2 md:px-4 lg:px-0">
      {/* Contact list */}
      <div
        className={`${
          selectedTeacher || selectedGuardian ? "hidden lg:flex" : "flex"
        } flex-1 lg:max-w-xs`}
      >
        <ContactList
          teachers={recordedTeachers}
          selectedTeacher={selectedTeacher}
          onSelectTeacher={handleSelectTeacher}
          guardian={recordedGuardians}
          selectedGuardian={selectedGuardian}
          onSelectGuardian={handleSelectGuardian} // ✅ fixed
        />
      </div>

      {/* Chat / Placeholder (desktop) */}
      <div className="flex-1 hidden lg:flex">
        {selectedTeacher || selectedGuardian ? (
          <ChatInterface
            selectedTeacher={selectedTeacher}
            selectedGuardian={selectedGuardian}
            onStartCall={handleStartCall}
            onBack={handleBack}
            onStartRecording={handleStartRecording}
          />
        ) : (
          <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-base">
              Select a teacher or Guardian to start chatting
            </p>
          </div>
        )}
      </div>

      {/* Chat (mobile) */}
      <div
        className={`${selectedTeacher || selectedGuardian ? "flex lg:hidden" : "hidden"} flex-1`}
      >
        <ChatInterface
          selectedTeacher={selectedTeacher}
          selectedGuardian={selectedGuardian}
          onStartCall={handleStartCall}
          onBack={handleBack}
          onStartRecording={handleStartRecording}
        />
      </div>

      {/* Video Call Modal */}
      {isCalling && (selectedTeacher || selectedGuardian) && (
        <VideoCallInterface
          selectedTeacher={selectedTeacher}
          selectedGuardian={selectedGuardian}
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

export default AdminMessages;

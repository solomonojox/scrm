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

const GuardianMessages: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherType | any>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const studentsTeacherId: any = useSelector((state: RootState) => state.getGuardianStudents.listRecords) || [];
  const studentsTeachers: any = useSelector((state: RootState) => state.getTeacher.listRecords) || [];
  const loading = useSelector((state: RootState) => state.getGuardianStudents.loading);
  const error = useSelector((state: RootState) => state.getGuardianStudents.error);

  const handleSelectTeacher = (teacher: TeacherType) => {
    setSelectedTeacher(teacher);
  };

  const handleStartCall = () => setIsCalling(true);
  const handleEndCall = () => setIsCalling(false);
  const handleToggleMute = () => setIsMuted((p) => !p);
  const handleToggleVideo = () => setIsVideoOff((p) => !p);
  const handleBack = () => setSelectedTeacher(null);
  const handleStartRecording = () => {
    console.log("Recording started...");
    // later you can implement MediaRecorder API here
  };

  useEffect(() => {
    if (!loading || user) {
      fetchPupils();
    }
  }, [dispatch, user]);

  const fetchPupils = async () => {
    dispatch(fetchGuardiansStudentStart());
    dispatch(fetchTeacherStart());
    try {
      if (user?.id) {
        const response = await guardianStudentService.getAll(user?.id);
        const getTeachersResponse = await teacherService.getArrayOfTeachersById(
          studentsTeacherId
        );

        dispatch(fetchGuardiansStudentSuccess(response));
        dispatch(fetchTeacherSuccess(getTeachersResponse));
      }
    } catch (error) {
      console.error("Error fetching pupils:", error);
      dispatch(fetchGuardiansStudentFailure((error as Error).message));
      dispatch(fetchTeacherFailure((error as Error).message));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[450px] px-2 md:px-4 lg:px-0">
      {/* Contact list (always visible on desktop, conditional on mobile) */}
      <div className={`${selectedTeacher ? "hidden lg:flex" : "flex"} flex-1 lg:max-w-xs`}>
        <ContactList
          teachers={studentsTeachers}
          selectedTeacher={selectedTeacher}
          onSelectTeacher={handleSelectTeacher}
        />
      </div>

      {/* Chat / Placeholder (desktop only) */}
      <div className="flex-1 hidden lg:flex">
        {selectedTeacher ? (
          <ChatInterface
            selectedTeacher={selectedTeacher}
            onStartCall={handleStartCall}
            onBack={handleBack}
            onStartRecording={handleStartRecording}
          />
        ) : (
          <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-base">Select a teacher to start chatting</p>
          </div>
        )}
      </div>

      {/* Chat (mobile only when teacher selected) */}
      <div className={`${selectedTeacher ? "flex lg:hidden" : "hidden"} flex-1`}>
        <ChatInterface
          selectedTeacher={selectedTeacher}
          onStartCall={handleStartCall}
          onBack={handleBack}
          onStartRecording={handleStartRecording}
        />
      </div>

      {/* Video Call Modal */}
      {isCalling && selectedTeacher && (
        <VideoCallInterface
          selectedTeacher={selectedTeacher}
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

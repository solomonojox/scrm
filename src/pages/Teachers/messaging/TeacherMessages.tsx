import React, { useEffect, useState } from "react";
import ContactList from "./ContactList";
import ChatInterface from "./ChatInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { useAuth } from "../../../Context/Auth/useAuth";
import {fetchAdminFailure,fetchAdminStart,fetchAdminSuccess,} from "../../../Store/Admin/adminSlice";
import { adminService } from "../../../Services/Admin/adminService";
import { AdminType } from "../../../Types/Admin/adminType";
import { fetchGuardiansFailure, fetchGuardiansStart, fetchGuardiansSuccess } from "../../../Store/Guardian/guardianSlice";
import { guardianService } from "../../../Services/Guardian/guardian";
import { Guardian } from "../../../Types/Guardian/guardianTypes";
import VideoCallInterface from "../../../components/Teachers/modal/VideoCallInterface";

const TeacherMessages: React.FC = () => {
    const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminType | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const recordedGuardians = useSelector((state: RootState) => state.getGuardian.listRecords) || [];
  const admin = useSelector((state: RootState) => state.getAdmin.listRecords) || [];
  const loading = useSelector((state: RootState) => state.getGuardianStudents.loading);
  const error = useSelector((state: RootState) => state.getGuardianStudents.error);

  // Select teacher
   const handleSelectGuardian = (guardian: Guardian) => {
     setSelectedGuardian(guardian);
     setSelectedAdmin(null);
   };
  // Select admin
  const handleSelectAdmin = (admin: AdminType) => {
    setSelectedAdmin(admin);
    setSelectedGuardian(null);
  };

  // Video call handlers
  const handleStartCall = () => setIsCalling(true);
  const handleEndCall = () => setIsCalling(false);
  const handleToggleMute = () => setIsMuted((p) => !p);
  const handleToggleVideo = () => setIsVideoOff((p) => !p);

  // Back button (reset selection)
  const handleBack = () => {
    setSelectedGuardian(null);
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
    dispatch(fetchGuardiansStart());
    dispatch(fetchAdminStart());

    try {
      if (user?.id) {
        // Step 1: Fetch guardian students

        const guardians = await guardianService.getGuardianBySchoolId(user?.schoolId);

        // Step 4: Fetch admins by school
        const admins = await adminService.getAdminBySchoolId(user.schoolId);

        // Step 5: Dispatch to Redux
        dispatch(fetchGuardiansSuccess(guardians));
        dispatch(fetchAdminSuccess(admins));
      }
    } catch (err) {
      const message = (err as Error).message || "Something went wrong";
      console.error("Error fetching pupils:", message);

      dispatch(fetchGuardiansFailure(message));
      dispatch(fetchAdminFailure(message));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[450px] px-2 md:px-4 lg:px-0">
      {/* Contact list */}
      <div
        className={`${
          selectedGuardian || selectedAdmin ? "hidden lg:flex" : "flex"
        } flex-1 lg:max-w-xs`}
      >
        <ContactList
          guardian={recordedGuardians}
          selectedGuardian={selectedGuardian}
          onSelectGuardian={handleSelectGuardian} // ✅ fixed
          admin={admin}
          selectedAdmin={selectedAdmin}
          onSelectAdmin={handleSelectAdmin} // ✅ fixed
        />
      </div>

      {/* Chat / Placeholder (desktop) */}
      <div className="flex-1 hidden lg:flex">
        {selectedGuardian || selectedAdmin ? (
          <ChatInterface
            selectedGuardian={selectedGuardian}
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
      <div className={`${selectedGuardian || selectedAdmin ? "flex lg:hidden" : "hidden"} flex-1`}>
        <ChatInterface
          selectedGuardian={selectedGuardian}
          selectedAdmin={selectedAdmin}
          onStartCall={handleStartCall}
          onBack={handleBack}
          onStartRecording={handleStartRecording}
        />
      </div>

      {/* Video Call Modal */}
      {isCalling && (selectedGuardian || selectedAdmin) && (
        <VideoCallInterface
          selectedGuardian={selectedGuardian}
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

export default TeacherMessages;

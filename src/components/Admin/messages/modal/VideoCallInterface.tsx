import React from "react";
import { Phone, Camera, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { TeacherType } from "../../../../Types/Teacher/teacherType";
import { Guardian } from "../../../../Types/Guardian/guardianTypes";

interface Props {
  selectedTeacher: TeacherType | null;
  selectedGuardian: Guardian | null;
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

const VideoCallInterface: React.FC<Props> = ({
  selectedGuardian,
  selectedTeacher,
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndCall,
}) => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video feeds */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedTeacher?.firstname}`}
            alt={selectedTeacher?.firstname}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
        <div className="absolute bottom-4 right-4 w-40 h-32 bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-white">
            {isVideoOff ? "Video Off" : "Your Video"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-6">
        <button
          onClick={onToggleMute}
          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>
        <button
          onClick={onToggleVideo}
          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          {isVideoOff ? <VideoOff /> : <Video />}
        </button>
        <button
          onClick={onEndCall}
          className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
        >
          <Phone />
        </button>
        <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <Camera />
        </button>
      </div>
    </div>
  );
};

export default VideoCallInterface;

import React from "react";
import { Square, Check } from "lucide-react";

interface Props {
  isRecording: boolean;
  onStop: () => void;
}

const VoiceRecordingInterface: React.FC<Props> = ({ isRecording, onStop }) => {
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center gap-3 z-40">
      {isRecording ? (
        <>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Recording...</span>
          <button
            onClick={onStop}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <Square className="w-4 h-4" />
          </button>
        </>
      ) : (
        <button
          onClick={onStop}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default VoiceRecordingInterface;

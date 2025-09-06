import React from "react";
import { Camera, X } from "lucide-react";

interface Props {
  onClose: () => void;
  onCapture: () => void;
}

const CameraInterface: React.FC<Props> = ({ onClose, onCapture }) => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white">
          Camera View
        </div>
      </div>
      <div className="p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-6">
        <button
          onClick={onCapture}
          className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
        >
          <Camera className="w-8 h-8" />
        </button>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default CameraInterface;

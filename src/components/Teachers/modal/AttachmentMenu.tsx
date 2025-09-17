import React from "react";
import { Camera, Image, FileText, MapPin } from "lucide-react";

interface Props {
  onSelect: (option: string) => void;
}

const AttachmentMenu: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="absolute bottom-20 bg-white rounded-xl shadow-lg p-2 w-48 z-40">
      <div className="flex flex-col">
        <button
          onClick={() => onSelect("camera")}
          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
        >
          <Camera className="w-5 h-5 text-orange-500" />
          <span className="text-sm">Camera</span>
        </button>
        <button
          onClick={() => onSelect("gallery")}
          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
        >
          <Image className="w-5 h-5 text-orange-500" />
          <span className="text-sm">Gallery</span>
        </button>
        <button
          onClick={() => onSelect("document")}
          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
        >
          <FileText className="w-5 h-5 text-orange-500" />
          <span className="text-sm">Document</span>
        </button>
        <button
          onClick={() => onSelect("location")}
          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
        >
          <MapPin className="w-5 h-5 text-orange-500" />
          <span className="text-sm">Location</span>
        </button>
      </div>
    </div>
  );
};

export default AttachmentMenu;

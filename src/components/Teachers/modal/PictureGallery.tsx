import React from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

const PictureGallery: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${i}/300/300`}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
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

export default PictureGallery;

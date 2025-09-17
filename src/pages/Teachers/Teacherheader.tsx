import { Menu } from "lucide-react";
import imageAssets from "../../assets/imageAssets";

const Teacherheader = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-30 bg-white shadow-md">
      <header className="flex items-center justify-between px-6 h-[70px] border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img src={imageAssets.logo} alt="EduCat logo" className="h-[45px]" />
        </div>

        <div className="rounded-lg py-2 px-3 flex items-center justify-center gap-4 border shadow">
          <p className="text-xs">
            Term: <span>First (2024/2025)</span>
          </p>
        </div>

        <button className="lg:hidden border p-2 rounded-md" onClick={onMenuClick}>
          <Menu size={30} />
        </button>
      </header>
    </div>
  );
};

export default Teacherheader;

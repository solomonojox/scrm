import React from "react";
import logo from "../../assets/imageAssets";
import { useAuth } from "../../Context/Auth/useAuth";
import { IoIosCopy } from "react-icons/io";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

const Adminheader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  // Function to handle copy
  const handleCopy = (text: any) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full z-30 bg-white shadow-md">
      <header className="flex items-center justify-between px-6 h-[70px] border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img src={logo.logo} alt="EduCat logo" className="h-[45px]" />
        </div>

        <div className="rounded-lg py-2 px-3 flex items-center justify-center gap-4 border shadow">
          <p className="text-xs">Active Term: {user?.currentTerm} - {user?.sessionId}</p>
          {/* School Reg Number */}
          <div className="flex items-center gap-1 lg:gap-2 text-xs">
            <p><span className="hidden lg-block">School</span> Reg. No - </p>
            <div
              className="rounded-lg py-1 px-2 border shadow-md border-gray-400 flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCopy(user?.schoolReg)}
            >
              <IoIosCopy className="w-4 h-4 text-gray-400" />
              <p className="text-[10px]">copy</p>
            </div>
          </div>

          {/* School ID */}
          <div className="flex items-center gap-1 lg:gap-2 text-xs">
            <p><span className="hidden lg-block">School</span> ID - </p>
            <div
              className="rounded-lg py-1 px-2 border shadow-md border-gray-400 flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCopy(user?.id)}
            >
              <IoIosCopy className="w-3 h-3 text-gray-400" />
              <p className="text-[10px]">copy</p>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden ml-2">
          <Menu onClick={onToggleSidebar} className="size-10 border p-1 rounded-md" />
        </div>
      </header>
    </div>
  );
};

export default Adminheader;

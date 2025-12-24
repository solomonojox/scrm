import React, { useEffect } from "react";
import { useAuth } from "../../Context/Auth/useAuth";
import { BiBell, BiMessage } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import imageAssets from "../../assets/imageAssets";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { Menu } from "lucide-react";
import {
  fetchGuardiansFailure,
  fetchGuardiansStart,
  fetchGuardiansSuccess,
} from "../../Store/Guardian/guardianSlice";
import { guardianService } from "../../Services/Guardian/guardian";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import { useNavigate } from "react-router-dom";

interface GuardianHeaderProps {
  onToggleSidebar?: () => void;
}

const GuardianHeader: React.FC<GuardianHeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord: any = useSelector((state: RootState) => state.getGuardian.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getGuardian.loading);
  const error = useSelector((state: RootState) => state.getGuardian.error);
  // console.log(fetchedRecord)

  if (user && fetchedRecord.accountStatus === 0) {
    navigate('/guardian/account-setup')
  }

  const icons = {
    message: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 1H12.9994" stroke="#575757" strokeLinecap="round" />
        <path
          d="M15 3C15 2.46957 14.7893 1.96086 14.4142 1.58579C14.0391 1.21072 13.5304 1 13 1"
          stroke="#575757"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 3C1 2.46957 1.21072 1.96086 1.58579 1.58579C1.96086 1.21072 2.46957 1 3 1"
          stroke="#575757"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 10C1 10.2626 1.05174 10.5227 1.15224 10.7654C1.25275 11.008 1.40007 11.2285 1.58579 11.4142C1.77151 11.5999 1.99198 11.7472 2.23463 11.8478C2.47729 11.9483 2.73736 12 3 12"
          stroke="#575757"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 10C15 10.5304 14.7893 11.0391 14.4142 11.4142C14.0391 11.7893 13.5304 12 13 12"
          stroke="#575757"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M1 3V9.99999" stroke="#575757" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 3V9.99999" stroke="#575757" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M3 12H5L7.99999 15L11 12H13"
          stroke="#575757"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    notificationBell: (
      <svg
        width="18"
        height="22"
        viewBox="0 0 18 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 18V9C3 7.4087 3.63214 5.88258 4.75736 4.75736C5.88258 3.63214 7.4087 3 9 3C10.5913 3 12.1174 3.63214 13.2426 4.75736C14.3679 5.88258 15 7.4087 15 9V18M3 18H15M3 18H1M15 18H17M8 21H10"
          stroke="#575757"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 3C9.55228 3 10 2.55228 10 2C10 1.44772 9.55228 1 9 1C8.44772 1 8 1.44772 8 2C8 2.55228 8.44772 3 9 3Z"
          stroke="#575757"
        />
      </svg>
    ),
  };

  useEffect(() => {
    if (user?.id && !fetchedLoading) {
      fetchGuardian();
    }
  }, [user, dispatch]);

  const fetchGuardian = async () => {
    dispatch(fetchGuardiansStart());
    try {
      const data = await guardianService.getGuardianById(user?.id);

      dispatch(fetchGuardiansSuccess(data));
    } catch (err) {
      dispatch(fetchGuardiansFailure((err as Error).message));
    }
  };

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
    <div
      className="
      fixed top-0 z-50 h-[70px] 
      w-full lg:w-[calc(100%-14.5rem)]   /* subtract sidebar width (48 = 12rem) */ 
      transition-all duration-300
    "
    >
      <header className="bg-white lg:rounded-t-[20px] shadow-md h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Search */}
        <div className="flex gap-2 bg-gray-200 items-center px-4 py-1.5 rounded-full bg-grey-300 flex-1 max-w-xs">
          <FiSearch className="text-gray-400" />
          <input
            type="search"
            className="outline-none bg-transparent flex-1 text-sm"
            placeholder="Search..."
          />
        </div>

        {/* Desktop nav items */}
        <div className="hidden lg:flex items-center gap-6 ml-auto">
          <div className="flex items-center gap-3">
            <p className="cursor-pointer">{icons.notificationBell}</p>
            <p className="cursor-pointer">{icons.message}</p>
          </div>

          <div className="flex items-center gap-2 cursor-pointer">
            <img
              className="w-8 h-8 rounded-full border-2 border-gray-300"
              src={
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${fetchedRecord?.firstname}` ||
                imageAssets.profile
              }
              alt="profile"
            />
            <div className="text-center">
              <b className="text-[13px]">
              {fetchedRecord?.firstname} {fetchedRecord?.lastname}
              </b>
              <p className="text-[12px]">Guardian</p>
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

export default GuardianHeader;

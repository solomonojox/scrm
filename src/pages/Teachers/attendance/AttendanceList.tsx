import React from "react";
import AllAttendance from "./AllAttendance";
import AllFolders from "./AllFolders";

const AttendanceList = (): React.JSX.Element => {
  const icons = {
    folder: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.99982 20.2H2.81009M21.7995 9V5.8C21.7995 5.37565 21.631 4.96869 21.3309 4.66863C21.0309 4.36857 20.6239 4.2 20.1996 4.2H8.99982V2.6C8.99982 2.17565 8.83125 1.76869 8.5312 1.46863C8.23115 1.16857 7.82419 1 7.39985 1H2.59996C2.17563 1 1.76867 1.16857 1.46862 1.46863C1.16857 1.76869 1 2.17565 1 2.6V18.3867C1.00602 18.8224 1.16872 19.2413 1.45832 19.5669C1.74792 19.8924 2.14506 20.1028 2.57707 20.1595C3.00908 20.2162 3.44706 20.1155 3.81089 19.8757C4.17471 19.636 4.44004 19.2732 4.55832 18.8539L7.06599 10.1563C7.16226 9.82278 7.36435 9.52964 7.6418 9.32107C7.91925 9.11249 8.25699 8.99981 8.60409 9H23.3995C23.6447 8.99992 23.8867 9.05622 24.1068 9.16455C24.3268 9.27288 24.519 9.43035 24.6685 9.62479C24.8179 9.81922 24.9207 10.0454 24.9689 10.2859C25.017 10.5264 25.0092 10.7747 24.9461 11.0117"
          stroke="#D9D9D9"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5991 15.3992V21.7992M15.3991 18.5992H21.799M12.1992 18.5992C12.1992 20.2966 12.8735 21.9245 14.0737 23.1247C15.2739 24.3249 16.9017 24.9992 18.5991 24.9992C20.2964 24.9992 21.9242 24.3249 23.1245 23.1247C24.3247 21.9245 24.9989 20.2966 24.9989 18.5992C24.9989 16.9018 24.3247 15.274 23.1245 14.0737C21.9242 12.8735 20.2964 12.1992 18.5991 12.1992C16.9017 12.1992 15.2739 12.8735 14.0737 14.0737C12.8735 15.274 12.1992 16.9018 12.1992 18.5992Z"
          stroke="#D9D9D9"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    file: (
      <svg
        width="19"
        height="21"
        viewBox="0 0 19 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 0H2C0.9 0 0 0.9 0 2V18C0 18.41 0.12 18.8 0.34 19.12C0.41 19.23 0.5 19.33 0.59 19.41C0.95 19.78 1.45 20 2 20H9.53C9 19.42 8.61 18.75 8.35 18H2V2H9V7H14V10C14.7 10 15.37 10.12 16 10.34V6L10 0ZM14 21L19 16.5L16 13.8L14 12V15H10V18H14V21Z"
          fill="#D9D9D9"
          fillOpacity="0.5"
        />
      </svg>
    ),
  };
  const [activeTab, setActiveTab] = React.useState<string | React.JSX.Element>("All Attendance");
  const tabs = [
    { id: 1, label: "All Attendance" },
    { id: 2, label: "All Folders" },
    // { id: 3, label: icons.folder },
    // { id: 4, label: icons.file },
  ];

  return (
    <>
      <section>
        <div className="">
          <div className="">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-4 sm:px-0 pb-6">
              <h2 className="text-lg font-medium">Attendance List</h2>
              <div className="flex-shrink-0">
                <select
                  name="class"
                  id=""
                  className="bg-[#EE7306] text-white rounded-full px-3 py-2 focus:outline-none focus:ring focus:ring-[#EE7306]"
                >
                  <option value="class1">Class 1</option>
                  <option value="class2">Class 2</option>
                  <option value="class3">Class 3</option>
                </select>
              </div>
            </div>

            <div className="w-full py-3 px-2 md:px-8 bg-[#EE7306] rounded-md">
              <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.label)}
                    className={`px-4 py-1 rounded-full text-xs md:text-[14px] whitespace-nowrap ${
                      activeTab === tab.label
                        ? "bg-white text-[#EE7306] font-semibold"
                        : "text-white/50 hover:bg-white/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {activeTab === "All Attendance" && <AllAttendance />}
            {activeTab === "All Folders" && <AllFolders />}
          </div>
        </div>
      </section>
    </>
  );
};

export default AttendanceList;

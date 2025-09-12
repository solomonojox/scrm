import { Eye, PhoneCallIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const fetchedRecord = [
  {
    id: 1,
    naration: "Savings",
    amountPaid: "1,000",
    date: "2023-01-01",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: 2,
    naration: "Loan Repayment",
    amountPaid: "50,000",
    date: "2023-01-01",
    time: "10:00 AM",
    status: "Successful",
  },
  {
    id: 3,
    naration: "School Fee",
    amountPaid: "100,000",
    date: "2023-01-01",
    time: "10:00 AM",
    status: "Failed",
  },
  {
    id: 4,
    naration: "Savings",
    amountPaid: "10,000",
    date: "2023-01-01",
    time: "10:00 AM",
    status: "Successful",
  },
  {
    id: 5,
    naration: "Loan Repayment",
    amountPaid: "1,000",
    date: "2023-01-01",
    time: "10:00 AM",
    status: "Pending",
  },
];

const TransactionHistory = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="py-6 md:py-2">
      <div className="flex items-center justify-between">
        <h1 className="m-4 text-[18px] font-semibold text-gray-700">Transaction History</h1>

        <button
          onClick={() => navigate("/guardian/transactions")}
          className="m-4 md:m-2 text-[14px] font-semibold text-white bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-md"
        >
          View all
        </button>
      </div>
      <div className=" overflow-x-auto parent-scrollbar font-[inter]">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-3 min-w-[30px]">
                <input
                  type="checkbox"
                  //   checked={selectAll}
                  //   onChange={onToggleSelectAll}
                  className="cursor-pointer w-4 h-4"
                />
              </th>
              <th className="p-3 min-w-[50px]">SN</th>
              <th className="p-3 min-w-[100px]">Narration</th>
              <th className="p-3 min-w-[50px]">Amount Paid</th>
              <th className="p-3 min-w-[100px]">Date</th>
              <th className="p-3 min-w-[100px]">Time</th>
              <th className="p-3 min-w-[100px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {fetchedRecord.length === 0 ? (
              <tr>
                {/* <td colSpan={10} className="p-8 text-center text-gray-500">
                  {searchQuery
                    ? "No classrooms found matching your search"
                    : "No classrooms available"}
                </td> */}
              </tr>
            ) : (
              fetchedRecord.map((t, index) => (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      //   checked={selectedIds.includes(c.classroomId)}
                      //   onChange={() => onToggleCheckbox(c.classroomId)}
                      className="cursor-pointer w-4 h-4"
                    />
                  </td>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{t?.naration}</td>
                  <td className="p-3">₦ {t?.amountPaid}</td>
                  <td className="p-3">{t?.date}</td>
                  <td className="p-3">{t?.time}</td>
                  <td className="py-3 px-4">
                    {t?.status === "Processing" && (
                      <span className=" bg-[#E3F2FD]/50 text-[#1E88E5]/80 text-[12px] font-medium px-2 py-1 rounded-full">
                        🔄 Processing
                      </span>
                    )}
                    {t?.status === "Pending" && (
                      <span className=" bg-[#FFF4E5]/50 text-[#FB8C00]/80 text-[12px] font-medium px-2 py-1 rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                    {t?.status === "Failed" && (
                      <span className=" bg-[#FDECEA]/50 text-[#EA4335]/80 text-[12px] font-medium px-2 py-1 rounded-full">
                        ❌ Failed
                      </span>
                    )}
                    {t?.status === "Successful" && (
                      <span className=" bg-[#E6F4EA]/50 text-[#34A853]/80 text-[12px] font-medium px-2 py-1 rounded-full">
                        ✅ Successful
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;

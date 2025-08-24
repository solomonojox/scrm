import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaBell,
  FaCommentAlt,
  FaChevronDown,
  FaArrowLeft,
  FaEye,
  FaCommentDots,
  FaEllipsisH,
  FaSort,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import GuardianSidebar from "../GuardianSidebar";
import Footer from "../../Footer"; // ✅ import footer
import { useNavigate } from "react-router-dom";

const sampleData = Array.from({ length: 20 }).map((_, i) => ({
  sn: 10001 + i,
  name: "David Ethan",
  guardianId: "104567",
  phone: "17034578999",
  purpose: "School Fees",
  amount: "N115,000",
  date: "23-08-2025",
  status: "Approved",
}));

export default function AllLoanRequests() {
  const [query, setQuery] = useState("");
  const [page] = useState(1);

  const filtered = useMemo(() => {
    if (!query) return sampleData;
    const q = query.toLowerCase();
    return sampleData.filter(
      (r) =>
        String(r.sn).includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.guardianId.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q)
    );
  }, [query]);

  const navigate = useNavigate();

  return (
    <div className="bg-[#EDEDED]  min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Main content + footer */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <div className=" py-6">
            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-2 bg-[#EDEDED] ">
                <h1 className="text-sm font-semibold text-gray-900">All Loan Requests</h1>
                <button
                  aria-label="Export options"
                  className="text-xs text-gray-600 hover:text-gray-900 font-semibold flex items-center space-x-1"
                >
                  <span>Export</span>
                  <FaChevronDown className="text-[10px]" />
                </button>
              </div>

              <div className="px-6 py-1  bg-[#EDEDED]  ">
                <button className="flex items-center text-gray-600 text-xs font-semibold space-x-1">
                  <FaArrowLeft className="text-[10px]" />
                </button>
              </div>

              <div className="overflow-x-auto p-4 flex-1">
                <table className="min-w-full border-separate" style={{ borderSpacing: "0 10px" }}>
                  <thead>
                    <tr className="text-[10px] font-semibold text-gray-600 text-left">
                      <th className="pl-6 py-3 cursor-pointer">SN <FaSort className="inline ml-1 text-gray-400" /></th>
                      <th className="py-3 cursor-pointer">Name <FaSort className="inline ml-1 text-gray-400" /></th>
                      <th className="py-3 cursor-pointer">Guardian ID <FaSort className="inline ml-1 text-gray-400" /></th>
                      <th className="py-3 cursor-pointer">Phone Number <FaSort className="inline ml-1 text-gray-400" /></th>
                      <th className="py-3 cursor-pointer">Loan Purpose <FaSort className="inline ml-1 text-gray-400" /></th>
                      <th className="py-3 cursor-pointer">Amount Requested <FaSort className="inline ml-1 text-gray-400" /></th>
                      <th className="py-3 cursor-pointer">Request Date <FaSort className="inline ml-1 text-gray-400" /></th>
                      <th className="py-3 cursor-pointer">Status <FaSort className="inline ml-1 text-gray-400" /></th>
                      <th className="pr-6 py-3 cursor-pointer text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.sn} className="bg-white border shadow-md border-gray-200 rounded-lg text-[10px] text-gray-700">
                        <td className="pl-6 py-3">{row.sn}</td>
                        <td className="py-3">{row.name}</td>
                        <td className="py-3">{row.guardianId}</td>
                        <td className="py-3">{row.phone}</td>
                        <td className="py-3">{row.purpose}</td>
                        <td className="py-3">{row.amount}</td>
                        <td className="py-3">{row.date}</td>
                        <td className={`py-3 font-semibold ${row.status === "Approved" ? "text-green-600" : "text-gray-700"}`}>
                          {row.status}
                        </td>
                        <td className="pr-6 py-3 text-center space-x-2">
                          <button className="text-blue-500 hover:text-blue-700 text-xs"><FaEye /></button>
                          <button className="text-red-500 hover:text-red-700 text-xs"><FaCommentDots /></button>
                          <button className="text-purple-500 hover:text-purple-700 text-xs"><FaEllipsisH /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center py-3 border-t border-gray-200 text-[10px] text-orange-600 font-semibold space-x-1">
                <FaAngleLeft />
                <span>Page {page} of {Math.max(1, Math.ceil(filtered.length / 10))}</span>
                <FaAngleRight />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

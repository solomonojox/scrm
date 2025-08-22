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
    <div className="bg-gray-100 min-h-screen flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 hidden md:block ">
        <div className="sticky top-0">
          <GuardianSidebar />
        </div>
      </aside>

      {/* Main content + footer */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <div className="max-w-[1100px] mx-auto px-6 py-6">
            {/* Search + profile card */}
            <div className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-[200px] sm:w-[280px] md:w-[320px] lg:w-[360px] xl:w-[400px] h-9 pl-10 pr-3 rounded-full bg-[#F0F0F0] text-gray-500 text-sm placeholder-gray-400 focus:outline-none"
                        placeholder="Search"
                        type="text"
                        aria-label="Search loan requests"
                      />
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <button aria-label="Notifications" className="text-gray-400 hover:text-gray-600 text-lg">
                      <FaBell />
                    </button>
                    <button aria-label="Messages" className="text-gray-400 hover:text-gray-600 text-lg">
                      <FaCommentAlt />
                    </button>
                    <div className="flex items-center space-x-3">
                      <img
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                        height={32}
                        width={32}
                        src="https://storage.googleapis.com/a1aa/image/657f5ec8-f567-499f-4260-acf290d5ef25.jpg"
                      />
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-700 leading-4">David Ethan</p>
                        <p className="text-[9px] text-gray-400 leading-3">Guardian</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-100">
                <h1 className="text-sm font-semibold text-gray-900">All Loan Requests</h1>
                <button
                  aria-label="Export options"
                  className="text-xs text-gray-600 hover:text-gray-900 font-semibold flex items-center space-x-1"
                >
                  <span>Export</span>
                  <FaChevronDown className="text-[10px]" />
                </button>
              </div>

              <div className="px-6 py-3 border-b bg-gray-100 border-gray-100">
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

        {/* ✅ Footer added here */}
        <Footer />
      </div>
    </div>
  );
}

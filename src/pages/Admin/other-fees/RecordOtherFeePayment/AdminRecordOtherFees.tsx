import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaSync, FaPlus, FaMoneyBillWave, FaReceipt, FaTags } from "react-icons/fa";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { formatDateTime, formatNaira } from "../../../../utils/formatters";
import { otherFeeService } from "../../../../Services/Admin/otherFee";
import { OtherFee, OtherFeePayment } from "../../../../Types/Admin/otherFee";
import RecordPaymentModal from "./RecordOtherFeePaymentModal";

const recordsPerPage = 15;

const AdminRecordOtherFees: React.FC = () => {
  const { user } = useAuth();
  const schoolId = localStorage.getItem("schoolId") || user?.schoolId || "";

  const [fees, setFees] = useState<OtherFee[]>([]);
  const [payments, setPayments] = useState<OtherFeePayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [feeFilter, setFeeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  // Load active fees + all payments together
  useEffect(() => {
    if (!schoolId) return;
    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");
      const [feesRes, paymentsRes] = await Promise.allSettled([
        otherFeeService.getFees(schoolId, true),
        otherFeeService.getPayments(schoolId),
      ]);
      if (ignore) return;

      const errors: string[] = [];

      if (feesRes.status === "fulfilled") {
        setFees(feesRes.value.filter((f:any) => f.isActive !== false));
      } else {
        setFees([]);
        errors.push(`Fees: ${getErrorMessage(feesRes.reason)}`);
      }

      if (paymentsRes.status === "fulfilled") {
        setPayments(
          [...paymentsRes.value].sort(
            (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
          ),
        );
      } else {
        setPayments([]);
        errors.push(`Payments: ${getErrorMessage(paymentsRes.reason)}`);
      }

      setError(errors.join(" · "));
      setCurrentPage(1);
      setLoading(false);
    };

    load();
    return () => {
      ignore = true;
    };
  }, [schoolId, refreshKey]);

  // Fee filter options come from the payments themselves (covers inactive fees too)
  const feeFilterOptions = useMemo(() => {
    const map = new Map<string, string>();
    payments.forEach((p) => map.set(p.otherFeeId, p.feeName));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return payments.filter((p) => {
      if (feeFilter !== "all" && p.otherFeeId !== feeFilter) return false;
      if (q) {
        const haystack = `${p.studentName} ${p.transactionReference} ${p.feeName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [payments, feeFilter, searchQuery]);

  const totalCollected = useMemo(
    () => filteredPayments.reduce((sum, p) => sum + (p.amount ?? 0), 0),
    [filteredPayments],
  );

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / recordsPerPage));
  const currentRecords = filteredPayments.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  const resetPage = () => setCurrentPage(1);
  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Other Fees</h1>
            <p className="text-sm text-gray-600">
              Home <span className="text-orange-500 font-semibold">: Other Fee Payments</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 border bg-white px-3 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <FaSync className={`text-orange-500 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setModalOpen(true)}
              disabled={loading || fees.length === 0}
              title={fees.length === 0 ? "No active fees available" : undefined}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-orange-600 disabled:opacity-50"
            >
              <FaPlus />
              Record Payment
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<FaMoneyBillWave />}
            label="Total Collected"
            value={formatNaira(totalCollected)}
            tone="bg-green-100 text-green-600"
          />
          <StatCard
            icon={<FaReceipt />}
            label="Payments"
            value={filteredPayments.length}
            tone="bg-orange-100 text-orange-600"
          />
          <StatCard
            icon={<FaTags />}
            label="Active Fees"
            value={fees.length}
            tone="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fee</label>
            <select
              value={feeFilter}
              onChange={(e) => {
                setFeeFilter(e.target.value);
                resetPage();
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">All fees</option>
              {feeFilterOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Student, fee or reference"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  resetPage();
                }}
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Student</th>
                <th className="p-3">Fee</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Reference</th>
                <th className="p-3">Date</th>
                <th className="p-3">Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Loading payments…
                  </td>
                </tr>
              ) : currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    {searchQuery || feeFilter !== "all"
                      ? "No payments match your filters"
                      : "No payments recorded yet"}
                  </td>
                </tr>
              ) : (
                currentRecords.map((p, index) => (
                  <tr
                    key={p.otherFeePaymentId}
                    className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="p-3 text-gray-500">
                      {(currentPage - 1) * recordsPerPage + index + 1}
                    </td>
                    <td className="p-3 font-medium text-gray-800">{p.studentName}</td>
                    <td className="p-3">{p.feeName}</td>
                    <td className="p-3 font-semibold text-green-700">{formatNaira(p.amount)}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{p.transactionReference || "—"}</td>
                    <td className="p-3">{formatDateTime(p.paymentDate)}</td>
                    <td className="p-3">{p.recordedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 text-sm text-gray-600">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className={`px-6 py-2 border rounded ${
                currentPage === 1
                  ? "bg-white text-black border-gray-600 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages} ({filteredPayments.length} payments)
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className={`px-6 py-2 border rounded ${
                currentPage === totalPages
                  ? "bg-white text-black border-gray-600 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <RecordPaymentModal
          schoolId={schoolId}
          fees={fees}
          onClose={() => setModalOpen(false)}
          onRecorded={refresh}
        />
      )}
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone: string;
}> = ({ icon, label, value, tone }) => (
  <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${tone}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default AdminRecordOtherFees;
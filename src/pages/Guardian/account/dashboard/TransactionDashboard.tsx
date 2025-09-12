import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import TransactionCards from "./TransactionCards";
import TransactionHistoryTable from "./TransactionHistoryTable";
import { useNavigate } from "react-router-dom";
import {
  fetchGuardiansTransactionFailure,
  fetchGuardiansTransactionStart,
  fetchGuardiansTransactionSuccess,
} from "../../../../Store/Guardian/transactionSlice";
import { transactionService } from "../../../../Services/Guardian/transaction";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { TransactionType } from "../../../../Types/Guardian/transactionType";

type StatusFilter = "all" | "pending" | "success" | "declined";

const TransactionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const fetchedRecord = useSelector(
    (state: RootState) => state.getGuardianTransaction.listRecords
  );
  const fetchedLoading = useSelector(
    (state: RootState) => state.getGuardianTransaction.loading
  );
  const error = useSelector(
    (state: RootState) => state.getGuardianTransaction.error
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openViewDetailModal, setOpenViewDetailModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionType>();

  const recordsPerPage = 5;

  // ✅ Filter logic with query + status
  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord || [];

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (t: TransactionType) => t.status?.toLowerCase() === statusFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((transaction: TransactionType) => {
        return (
          transaction.amount?.toString().toLowerCase().includes(query) ||
          transaction.description?.toLowerCase().includes(query) ||
          transaction.transactionId?.toLowerCase().includes(query) ||
          transaction.status?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [fetchedRecord, searchQuery, statusFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords: TransactionType[] = filteredRecords.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  //  Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [dispatch]);

  const fetchTransactions = async () => {
    dispatch(fetchGuardiansTransactionStart());
    try {
      const data = await transactionService.getClassroomBySchoolId(
        localStorage.getItem("schoolId")
      );
      dispatch(fetchGuardiansTransactionSuccess(data));
    } catch (err) {
      dispatch(fetchGuardiansTransactionFailure((err as Error).message));
    }
  };

  //  Reset page when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((c) => c.transactionId));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const handleHeaderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-full flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 leading-tight">
              Keep Your Account Ready for Smooth Transactions
            </h1>
          </div>

          {/* Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-red-700 text-xs sm:text-sm">
              <span className="font-semibold">Please Note:</span> Kindly call
              this number to confirm your transaction -{" "}
              <span className="font-semibold break-all sm:break-normal">
                07277777767
              </span>
            </p>
          </div>
        </div>

        {/* Transaction Cards */}
        <TransactionCards />

        {/* Transaction Table History */}
        <TransactionHistoryTable
          transactions={fetchedRecord}
          records={currentRecords}
          totalRecords={filteredRecords.length}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          headerSearchQuery={headerSearchQuery}
          statusFilter={statusFilter}
          selectedIds={selectedIds}
          selectAll={selectAll}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onHeaderSearchChange={handleHeaderSearchChange}
          onStatusFilterChange={setStatusFilter}
          onToggleSelectAll={toggleSelectAll}
          onToggleCheckbox={toggleCheckbox}
          refresh={fetchTransactions}
        />
      </div>
    </div>
  );
};

export default TransactionDashboard;

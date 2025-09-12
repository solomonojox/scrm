import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import TransactionCards from "./TransactionCards";
import TransactionHistoryTable from "./TransactionHistoryTable";
import { useNavigate } from "react-router-dom";

const TransactionDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
              <span className="font-semibold">Please Note:</span> Kindly call this number to confirm
              your transaction -{" "}
              <span className="font-semibold break-all sm:break-normal">07277777767</span>
            </p>
          </div>
        </div>

        {/* Transaction Cards */}
        <TransactionCards />

        {/* Transaction Table History */}
        <TransactionHistoryTable />
      </div>
    </div>
  );
};

export default TransactionDashboard;

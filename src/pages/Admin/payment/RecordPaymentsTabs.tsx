// src/Pages/Admin/Payments/RecordPaymentsTabs.tsx
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFileInvoiceDollar, FaMoneyBillWave } from "react-icons/fa";
import AdminRecordOtherFees from "../other-fees/RecordOtherFeePayment/AdminRecordOtherFees";
import InvoiceRecordsPage from "../schoolFee/InvoiceRecordsPage";


type TabKey = "schoolFees" | "otherFees";

interface TabConfig {
  key: TabKey;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  {
    key: "schoolFees",
    label: "School Fee Payments",
    description: "Record and manage student school fee payments & invoices",
    icon: <FaFileInvoiceDollar />,
  },
  {
    key: "otherFees",
    label: "Other Fee Payments",
    description: "Record payments for other fees like uniforms, books, etc.",
    icon: <FaMoneyBillWave />,
  },
];

const RecordPaymentsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("schoolFees");

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />

      {/* Page Header + Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 pt-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Record Payments</h1>
            <p className="text-sm text-gray-600 mt-1">
              Home{" "}
              <span className="text-orange-500 font-semibold">
                : Record Payments
              </span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:border-b sm:border-gray-200">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    group flex items-start gap-3 px-4 py-3 text-left
                    rounded-lg sm:rounded-none sm:border-b-2 transition-all
                    ${
                      isActive
                        ? "bg-orange-50 sm:bg-transparent border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 sm:hover:bg-transparent"
                    }
                  `}
                >
                  <span
                    className={`
                      flex items-center justify-center w-9 h-9 rounded-full shrink-0
                      ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }
                    `}
                  >
                    {tab.icon}
                  </span>
                  <span className="flex flex-col">
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? "text-orange-600" : "text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {tab.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/*
        Both panels stay mounted so each tab keeps its own state
        (search query, filters, pagination, open modals, etc.).
        The inactive one is hidden with `hidden` (display: none).
      */}
      <div className={activeTab === "schoolFees" ? "block" : "hidden"}>
        <InvoiceRecordsPage />
      </div>

      <div className={activeTab === "otherFees" ? "block" : "hidden"}>
        <AdminRecordOtherFees />
      </div>
    </div>
  );
};

export default RecordPaymentsTabs;
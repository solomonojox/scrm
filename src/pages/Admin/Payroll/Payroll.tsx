// PayrollDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  Download,
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  X,
  HelpCircle,
  Coins,
} from "lucide-react";
import BulkPaymentPageStatic from "../../../components/Admin/payroll/BulkPaymentPageStatic";
import BulkPaymentModal from "../../../components/Admin/payroll/BulkPaymentModal";
import DeleteModal from "../../../components/Admin/payroll/DeleteModal";
import PaymentSlipModal from "../../../components/Admin/payroll/PaymentSlipModal";
import PayrollModal from "../../../components/Admin/payroll/PayrollModal";
import AllPayrollTable from "../../../components/Admin/payroll/AllPayrollTable";
import { payrollService } from "../../../Services/Admin/payroll";
import { useAuth } from "../../../Context/Auth/useAuth";
import { toast } from "react-toastify";
import { AppContext } from "../../../Context/AppContext";
import PaymentHistory from "../../../components/Admin/payroll/PaymentHistory";
const PayrollDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuth()

  // const [allPayrollData, setAllPayrollData] = useState([
  //   {
  //     id: 1,
  //     staffId: "4496951",
  //     name: "Ojone Martins",
  //     role: "Secretary",
  //     department: "Admin",
  //     basicSalary: "100000",
  //     allowance: "20000",
  //     deductions: "2000",
  //     date: "2023-02-22",
  //     status: "Pending",
  //   },
  //   {
  //     id: 2,
  //     staffId: "4496952",
  //     name: "Ada Lovelace",
  //     role: "Teacher",
  //     department: "Academics",
  //     basicSalary: "120000",
  //     allowance: "25000",
  //     deductions: "5000",
  //     date: "2023-02-22",
  //     status: "Pending",
  //   },
  // ]);

  const [allPayrollData, setAllPayrollData] = useState<any[]>([])
  const [refetch, setRefetch] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showOverlay, hideOverlay, notifySuccess, notifyError } = useContext(AppContext)

  useEffect(() => {
    const getAllPayroll = async () => {
      showOverlay()
      try {
        const res = await payrollService.getAllPayrollBySchoolId(user?.schoolId)
        // console.log("payroll:", res);
        setAllPayrollData(res);
      } catch (error: any) {
        console.error(error?.response?.data?.message || error.message || error);
        throw error;
      } finally {
        hideOverlay()
      }
    }

    if (user) {
      getAllPayroll()
    }
  }, [user, refetch]);

  const [paymentHistoryData, setPaymentHistoryData] = useState([
    {
      id: 1,
      staffId: "TXN-2023-1",
      name: "Peter Johnson 1",
      role: "Teacher",
      netPay: "₦150,000",
      department: "Finance",
      date: "2023-03-05",
      status: "Completed",
    },
  ]);

  // modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [selectedData, setSelectedData] = useState<any | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState("record");

  const [showSlipModal, setShowSlipModal] = useState(false);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showBulkPage, setShowBulkPage] = useState(false); // show the static bulk page

  /* ---------- Handlers ---------- */
  const handleAdd = () => {
    setModalMode("add");
    setSelectedData(null);
    setShowFormModal(true);
  };

  const handleEdit = (row: any) => {
    setModalMode("edit");
    setSelectedData(row);
    setShowFormModal(true);
  };

  const handleView = (row: any) => {
    setModalMode("view");
    setSelectedData(row);
    setShowFormModal(true);
  };

  const handleDelete = (row: any, target = "record") => {
    setSelectedData(row);
    setDeleteTarget(target);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === "record") {
      setAllPayrollData((prev: any) => prev.filter((i: any) => i.id !== selectedData!.id));
    } else {
      setPaymentHistoryData((prev: any) => prev.filter((i: any) => i.id !== selectedData!.id));
    }
    setShowDeleteModal(false);
  };

  const handleSubmitForm = async (data: any) => {
    setLoading(true);
    try {
      const res = await payrollService.generatePayrollForTeacher(data)
      notifySuccess('Payroll generated successfully')
      setRefetch(!refetch)
      setShowFormModal(false)

    } catch (err: any) {
      console.log(err.response)
      notifyError(err.response.data.message || 'Error generating payroll')
    } finally {
      setLoading(false)
    }
  };

  const openSlipFromHistory = (row: any) => {
    setSelectedData(row);
    setShowSlipModal(true);
  };

  // Generate payroll for a single row and add to history
  const handleGeneratePayroll = (row: any) => {
    const net =
      (parseFloat(row.basicSalary || 0) || 0) +
      (parseFloat(row.allowance || 0) || 0) -
      (parseFloat(row.deductions || 0) || 0);
    const newHistory = {
      id: paymentHistoryData.length ? paymentHistoryData[paymentHistoryData.length - 1].id + 1 : 1,
      staffId: `TXN-${new Date().getFullYear()}-${paymentHistoryData.length + 1}`,
      name: row.name,
      role: row.role,
      netPay: `₦${Number(net).toLocaleString()}`,
      department: row.department || "Finance",
      date: new Date().toLocaleDateString(),
      status: "Completed",
    };
    setPaymentHistoryData((prev) => [...prev, newHistory]);
    // mark row Paid
    setAllPayrollData((prev: any) => prev.map((p: any) => (p.id === row.id ? { ...p, status: "Paid" } : p)));
  };

  /* Bulk proceed: show bulk page */
  const handleBulkProceedToPage = () => {
    setShowBulkModal(false);
    setShowBulkPage(true);
  };

  /* back from bulk page */
  const backFromBulkPage = () => {
    setShowBulkPage(false);
  };

  /* If bulk page showing, render it full-screen */
  if (showBulkPage) {
    return <BulkPaymentPageStatic onBack={backFromBulkPage} />;
  }

  /* ---------- Table config ---------- */
  const tableConfig =
    activeTab === "all"
      ? {
        headers: [
          "SN",
          "Staff ID",
          "Name",
          "Role",
          "Basic Salary",
          "Allowances",
          "Deductions",
          "Date",
          "Status",
          "Actions",
        ],
        data: allPayrollData,
      }
      : {
        headers: [
          "SN",
          "Staff ID",
          "Name",
          "Role",
          "Net Pay",
          "Department",
          "Date",
          "Status",
          "Actions",
        ],
        data: paymentHistoryData,
      };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Home / <span className="text-orange-500">Payroll</span>
        </h2>

        <div className="flex gap-2">
          <button className="flex items-center px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-100">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>

          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Bulk Payment
          </button>

          <button
            onClick={handleAdd}
            className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Payroll
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-500">Total Payroll</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              ₦{allPayrollData.reduce((s: any, r: any) => s + (parseFloat(r.baseSalary) || 0), 0).toLocaleString()}
            </p>
          </div>
          <Coins className="w-8 h-8 text-green-600" />
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-500">Paid Staff</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">{allPayrollData.filter((r: any) => r.isPaid).length}</p>
          </div>
          <Users className="w-8 h-8 text-blue-600" />
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-500">Pending Payments</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">{allPayrollData.filter((r: any) => !r.isPaid).length}</p>
          </div>
          <CreditCard className="w-8 h-8 text-yellow-600" />
        </div>

        {/* <div className="bg-orange-50 p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-500">This Month's Total</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">₦820,000</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-600" />
        </div> */}
      </div>

      {/* Tabs */}
      <div className="flex mb-4 space-x-4 border-b border-gray-200">
        {[
          { key: "all", label: "All Payroll" },
          { key: "history", label: "Payment History" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 px-4 text-sm font-medium ${activeTab === tab.key
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-orange-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {activeTab === "all" && (
        <AllPayrollTable
          activeTab={activeTab}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleGeneratePayroll={handleGeneratePayroll}
          data={tableConfig.data}
        />
      )}
      {activeTab === "history" && (
        <PaymentHistory
          activeTab={activeTab}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleGeneratePayroll={handleGeneratePayroll}
          data={tableConfig.data}
        />
      )}


      {/* Modals */}
      <PayrollModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        mode={modalMode}
        data={selectedData}
        onSubmit={handleSubmitForm}
        loading={loading}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        label={deleteTarget === "history" ? "payment record" : "payroll record"}
      />

      <PaymentSlipModal
        isOpen={showSlipModal}
        onClose={() => setShowSlipModal(false)}
        data={selectedData}
      />

      <BulkPaymentModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onProceed={handleBulkProceedToPage}
      />
    </div>
  );
};

export default PayrollDashboard;

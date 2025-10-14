import React, { useState } from "react";
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
  Save,
} from "lucide-react";

// ✅ Reusable Payroll Modal (Add/Edit/View)
const PayrollModal = ({ isOpen, onClose, mode, data, onSubmit }) => {
  const isView = mode === "view";
  const [formData, setFormData] = useState(
    data || {
      staffId: "",
      name: "",
      role: "",
      basicSalary: "",
      allowance: "",
      deductions: "",
      date: "",
    }
  );

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <div className="bg-orange-500 text-white text-center py-3 rounded-t-xl -mt-6 -mx-6 mb-6">
          <h2 className="text-lg font-semibold capitalize">
            {mode === "add"
              ? "Add Payroll"
              : mode === "edit"
              ? "Edit Payroll"
              : "View Payroll"}
          </h2>
        </div>

        <button
          className="absolute top-3 right-4 text-white text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {[
            { label: "Staff ID", name: "staffId", type: "text" },
            { label: "Name", name: "name", type: "text" },
            { label: "Role", name: "role", type: "text" },
            { label: "Basic Salary (₦)", name: "basicSalary", type: "number" },
            { label: "Allowance (₦)", name: "allowance", type: "number" },
            { label: "Deductions (₦)", name: "deductions", type: "number" },
            { label: "Date", name: "date", type: "date" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder="Enter Here"
                disabled={isView}
                className={`w-full border border-orange-400 rounded-md p-2 focus:outline-none ${
                  isView
                    ? "bg-gray-100 cursor-not-allowed"
                    : "focus:ring-2 focus:ring-orange-500"
                }`}
                required
              />
            </div>
          ))}

          {!isView && (
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
              >
                {mode === "edit" ? "Update Payroll" : "Save Payroll"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// ✅ Delete Confirmation Popup
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[340px] text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Confirm Delete
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Are you sure you want to delete this record? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Main Payroll Dashboard
const PayrollDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [allPayrollData, setAllPayrollData] = useState(
    Array(5)
      .fill(null)
      .map((_, idx) => ({
        id: idx + 1,
        staffId: `449695${idx + 1}`,
        name: "Ojone Martins",
        role: "Secretary",
        basicSalary: "100000",
        allowance: "20000",
        deductions: "2000",
        date: "2023-02-22",
        status: "Paid",
      }))
  );

  const [paymentHistoryData, setPaymentHistoryData] = useState(
    Array(5)
      .fill(null)
      .map((_, idx) => ({
        id: idx + 1,
        staffId: `TXN-2023-${idx + 1}`,
        name: "Peter Johnson",
        role: "₦150,000",
        netPay: "Bank Transfer",
        department: "Finance",
        date: "05-03-2023",
        status: "Completed",
      }))
  );

  const handleAdd = () => {
    setModalMode("add");
    setSelectedData(null);
    setShowModal(true);
  };

  const handleEdit = (row) => {
    setModalMode("edit");
    setSelectedData(row);
    setShowModal(true);
  };

  const handleView = (row) => {
    setModalMode("view");
    setSelectedData(row);
    setShowModal(true);
  };

  const handleDelete = (row) => {
    setSelectedData(row);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (activeTab === "all") {
      setAllPayrollData((prev) =>
        prev.filter((item) => item.id !== selectedData.id)
      );
    } else {
      setPaymentHistoryData((prev) =>
        prev.filter((item) => item.id !== selectedData.id)
      );
    }
    setDeleteModal(false);
  };

  const handleSubmit = (data) => {
    if (modalMode === "add") {
      setAllPayrollData((prev) => [...prev, { ...data, id: prev.length + 1 }]);
    } else if (modalMode === "edit") {
      if (activeTab === "all") {
        setAllPayrollData((prev) =>
          prev.map((item) =>
            item.id === data.id ? { ...data, id: item.id } : item
          )
        );
      } else {
        setPaymentHistoryData((prev) =>
          prev.map((item) =>
            item.id === data.id ? { ...data, id: item.id } : item
          )
        );
      }
    }
  };

  const infoCards = [
    {
      title: "Total Payroll",
      value: "₦500,000",
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Paid Staff",
      value: "48",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      title: "Pending Payments",
      value: "7",
      icon: <CreditCard className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-50",
    },
    {
      title: "This Month's Total",
      value: "₦820,000",
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-50",
    },
  ];

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
            "StaffId",
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
            onClick={handleAdd}
            className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Payroll
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 justify-items-center">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between items-start p-6 h-[160px] w-full max-w-[230px] rounded-2xl shadow-md ${card.color} transition hover:shadow-lg`}
          >
            <div>
              <h3 className="text-sm text-gray-500">{card.title}</h3>
              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {card.value}
              </p>
            </div>
            <div className="self-end p-3 rounded-full bg-white shadow">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex mb-3 border-b-2 border-orange-500 bg-orange-500 rounded-t-md">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
            activeTab === "all"
              ? "bg-orange-500 text-white"
              : "bg-transparent text-gray-200 hover:bg-white hover:text-orange-500"
          }`}
        >
          All Payroll
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
            activeTab === "history"
              ? "bg-orange-500 text-white"
              : "bg-transparent text-gray-200 hover:bg-white hover:text-orange-500"
          }`}
        >
          Payment History
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg transition-all">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left text-gray-600">
              {tableConfig.headers.map((header) => (
                <th key={header} className="py-3 px-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableConfig.data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {activeTab === "all" ? (
                  <>
                    <td className="py-2 px-4">{row.id}</td>
                    <td className="py-2 px-4">{row.staffId}</td>
                    <td className="py-2 px-4">{row.name}</td>
                    <td className="py-2 px-4">{row.role}</td>
                    <td className="py-2 px-4">₦{row.basicSalary}</td>
                    <td className="py-2 px-4">₦{row.allowance}</td>
                    <td className="py-2 px-4">₦{row.deductions}</td>
                    <td className="py-2 px-4">{row.date}</td>
                    <td className="py-2 px-4 text-green-600">{row.status}</td>
                 <td className="py-2 px-4 flex gap-2">
  <button
    onClick={() => handleView(row)}
    className="text-blue-600 hover:text-blue-800"
  >
    <Eye className="w-4 h-4" />
  </button>

  <button
    onClick={() => handleEdit(row)}
    className="text-green-600 hover:text-green-800"
  >
    <Edit className="w-4 h-4" />
  </button>

  <button
    onClick={() => handleDownload(row)}
    className="text-orange-600 hover:text-orange-800"
  >
    <Save className="w-4 h-4" />
  </button>

  <button
    onClick={() => handleDelete(row)}
    className="text-red-500 hover:text-red-700"
  >
    <Trash2 className="w-4 h-4" />
  </button>
</td>

                  </>
                ) : (
                  <>
                    <td className="py-2 px-4">{row.id}</td>
                    <td className="py-2 px-4">{row.staffId}</td>
                    <td className="py-2 px-4">{row.name}</td>
                    <td className="py-2 px-4">{row.role}</td>
                    <td className="py-2 px-4">{row.netPay}</td>
                    <td className="py-2 px-4">{row.department}</td>
                    <td className="py-2 px-4">{row.date}</td>
                    <td className="py-2 px-4 text-blue-600">{row.status}</td>
                    <td className="py-2 px-4 flex gap-3">
                      <button
                        onClick={() => handleView(row)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center py-3 text-gray-500 text-sm">
          Page 1 of 1
        </div>
      </div>

      {/* Modals */}
      <PayrollModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        data={selectedData}
        onSubmit={handleSubmit}
      />
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PayrollDashboard;

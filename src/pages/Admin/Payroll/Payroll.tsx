import React, { useEffect, useState } from "react";
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
  X,
  HelpCircle,
} from "lucide-react";

/* ---------------------- Generate Payroll Modal ---------------------- */
const GeneratePayrollModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 relative">
        {/* Header */}
        <div className="bg-orange-500 text-white flex justify-between items-center py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4">
          <h2 className="text-lg font-semibold">Generate Payroll</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <p className="text-center text-gray-600 mb-6">
          Proceed with Salary payment for the selected user
        </p>

        {/* Academy Info */}
        <div className="text-center space-y-2 mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Graduation_cap_icon.svg/1024px-Graduation_cap_icon.svg.png"
            alt="Logo"
            className="w-16 h-16 mx-auto"
          />
          <h3 className="text-2xl font-bold text-blue-800">
            Gold International Academy
          </h3>
          <p className="text-sm text-gray-600">
            21, Woodgreen Road Lagos, Nigeria
          </p>
          <p className="text-xs text-gray-400">
            Generated from EduCat on 23-09-2025 12:45pm
          </p>
        </div>

        {/* Info Table */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-700">Staff ID</span>
            <span className="text-gray-900">{data?.staffId || "—"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium text-gray-700">Beneficiary</span>
            <span className="text-gray-900">{data?.name || "—"}</span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            onClick={() => {
              // example action: mark paid or call API (no-op here)
              alert(`Processed payment for ${data?.name || "selected user"}`);
              onClose();
            }}
          >
            Proceed with Payment
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Delete Modal ---------------------- */
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50">
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

/* ---------------------- Bulk Payment Modal (user provided UI) ---------------------- */
const BulkPaymentModal = ({ isOpen, onClose, onProceed }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-30">
      <div className="bg-white w-[340px] rounded-2xl shadow-xl p-6 flex flex-col items-center animate-fadeIn">
        <div className="bg-green-100 p-4 rounded-full mb-4 mt-4">
          <HelpCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
          Proceed with payment to selected users?
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Continue to payment
        </p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => {
              onProceed();
              onClose();
            }}
            className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition"
          >
            Proceed
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Payroll Modal (Add/Edit/View) ---------------------- */
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

  // keep form in sync when data changes (e.g. editing different row)
  useEffect(() => {
    setFormData(
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
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // preserve id if editing
    const payload = data?.id ? { ...formData, id: data.id } : formData;
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-transparent z-50">
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
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder="Enter Here"
                disabled={isView}
                className={`w-full border border-orange-400 rounded-md p-2 focus:outline-none ${
                  isView
                    ? "bg-gray-100 cursor-not-allowed"
                    : "focus:ring-2 focus:ring-orange-500"
                }`}
                required={!isView}
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

/* ---------------------- Main Dashboard ---------------------- */
const PayrollDashboard = () => {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'history'
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit | view
  const [selectedData, setSelectedData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const [allPayrollData, setAllPayrollData] = useState(
    Array(6)
      .fill(null)
      .map((_, idx) => ({
        id: idx + 1,
        staffId: `449695${idx + 1}`,
        name: `Ojone Martins ${idx + 1}`,
        role: "Secretary",
        basicSalary: "100000",
        allowance: "20000",
        deductions: "2000",
        date: "2023-02-22",
        status: idx % 2 === 0 ? "Paid" : "Pending",
      }))
  );

  const [paymentHistoryData, setPaymentHistoryData] = useState(
    Array(5)
      .fill(null)
      .map((_, idx) => ({
        id: idx + 1,
        staffId: `TXN-2023-${idx + 1}`,
        name: `Peter Johnson ${idx + 1}`,
        role: "Teacher",
        netPay: "₦150,000",
        department: "Finance",
        date: "2023-03-05",
        status: "Completed",
      }))
  );

  /* ---------- Handlers for open modals ---------- */
  const handleAdd = () => {
    setModalMode("add");
    setSelectedData(null);
    setShowFormModal(true);
  };

  const handleEdit = (row) => {
    setModalMode("edit");
    setSelectedData(row);
    setShowFormModal(true);
  };

  const handleView = (row) => {
    setModalMode("view");
    setSelectedData(row);
    setShowFormModal(true);
  };

  const handleDelete = (row) => {
    setSelectedData(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // remove from the appropriate data source (we only delete from allPayrollData)
    setAllPayrollData((prev) => prev.filter((item) => item.id !== selectedData.id));
    setShowDeleteModal(false);
    setSelectedData(null);
  };

  const handleSaveIconClick = (row) => {
    // per requirement: show Generate Payroll modal only
    setSelectedData(row);
    setShowGenerateModal(true);
  };

  const handleSubmitForm = (data) => {
    if (modalMode === "add") {
      // add new with id
      setAllPayrollData((prev) => [
        ...prev,
        { ...data, id: prev.length ? prev[prev.length - 1].id + 1 : 1, status: "Pending" },
      ]);
    } else if (modalMode === "edit") {
      setAllPayrollData((prev) => prev.map((item) => (item.id === data.id ? { ...data } : item)));
    }
  };

  const handleBulkProceed = () => {
    // placeholder: mark all pending as Paid (for example)
    setAllPayrollData((prev) => prev.map((p) => ({ ...p, status: "Paid" })));
    alert("Bulk payment processed for selected users (demo).");
  };

  /* ---------- Table config based on active tab ---------- */
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

          {/* Bulk Payment button opens BulkPaymentModal */}
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 justify-items-center">
        {[
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
        ].map((card, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between items-start p-6 h-[160px] w-full max-w-[230px] rounded-2xl shadow-md ${card.color} transition hover:shadow-lg`}
          >
            <div>
              <h3 className="text-sm text-gray-500">{card.title}</h3>
              <p className="text-2xl font-semibold text-gray-800 mt-2">{card.value}</p>
            </div>
            <div className="self-end p-3 rounded-full bg-white shadow">{card.icon}</div>
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
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEdit(row)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleSaveIconClick(row)}
                        className="text-orange-600 hover:text-orange-800"
                        title="Generate Payroll"
                      >
                        <Save className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(row)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
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
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
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

        <div className="flex justify-center py-3 text-gray-500 text-sm">Page 1 of 1</div>
      </div>

      {/* Modals */}
      <PayrollModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        mode={modalMode}
        data={selectedData}
        onSubmit={handleSubmitForm}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <GeneratePayrollModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        data={selectedData}
      />

      <BulkPaymentModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onProceed={handleBulkProceed}
      />
    </div>
  );
};

export default PayrollDashboard;

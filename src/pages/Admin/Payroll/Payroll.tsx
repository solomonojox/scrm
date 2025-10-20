// PayrollDashboard.jsx
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
  X,
  HelpCircle,
} from "lucide-react";

/* ---------------------- Small helper ---------------------- */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="text-gray-900">{value ?? "—"}</span>
  </div>
);

/* ---------------------- Payment Slip Modal ---------------------- */
const PaymentSlipModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 relative">
        <div className="bg-orange-500 text-white flex justify-between items-center py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4">
          <h2 className="text-lg font-semibold">Payment Slip</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-gray-600 mb-6">Payroll slip for the selected staff</p>

        <div className="text-center space-y-2 mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Graduation_cap_icon.svg/1024px-Graduation_cap_icon.svg.png"
            alt="Logo"
            className="w-16 h-16 mx-auto"
          />
          <h3 className="text-2xl font-bold text-blue-800">Gold International Academy</h3>
          <p className="text-sm text-gray-600">21, Woodgreen Road Lagos, Nigeria</p>
          <p className="text-xs text-gray-400">Generated on {new Date().toLocaleString()}</p>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <InfoRow label="Staff ID" value={data?.staffId} />
          <InfoRow label="Name" value={data?.name} />
          <InfoRow label="Role" value={data?.role} />
          <InfoRow label="Department" value={data?.department} />
          <InfoRow label="Net Pay" value={data?.netPay} />
          <InfoRow label="Date" value={data?.date} />
          <InfoRow label="Status" value={data?.status} />
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Delete Modal ---------------------- */
const DeleteModal = ({ isOpen, onClose, onConfirm, label = "record" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[340px] text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h2>
        <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete this {label}? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700">Delete</button>
          <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300">Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Payroll Modal (Add/Edit/View) ---------------------- */
const PayrollModal = ({ isOpen, onClose, mode, data, onSubmit }) => {
  const isView = mode === "view";
  const [formData, setFormData] = useState({
    id: null,
    staffId: "",
    name: "",
    role: "",
    department: "",
    basicSalary: "",
    allowance: "",
    deductions: "",
    date: "",
  });

  useEffect(() => {
    if (data) setFormData(data);
    else setFormData({
      id: null,
      staffId: "",
      name: "",
      role: "",
      department: "",
      basicSalary: "",
      allowance: "",
      deductions: "",
      date: "",
    });
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    if (isView) return;
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        <div className="bg-orange-500 text-white text-center py-3 rounded-t-xl -mt-6 -mx-6 mb-6">
          <h2 className="text-lg font-semibold capitalize">
            {mode === "add" ? "Add Payroll" : mode === "edit" ? "Edit Payroll" : "View Payroll"}
          </h2>
        </div>

        <button className="absolute top-3 right-4 text-gray-700 text-xl font-bold" onClick={onClose}>×</button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Staff ID", name: "staffId" },
            { label: "Name", name: "name" },
            { label: "Role", name: "role" },
            { label: "Department", name: "department" },
            { label: "Basic Salary (₦)", name: "basicSalary", type: "number" },
            { label: "Allowance (₦)", name: "allowance", type: "number" },
            { label: "Deductions (₦)", name: "deductions", type: "number" },
            { label: "Date", name: "date", type: "date" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-gray-700 font-medium mb-1">{f.label}</label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={formData[f.name] || ""}
                onChange={handleChange}
                disabled={isView}
                className={`w-full border border-orange-400 rounded-md p-2 focus:outline-none ${isView ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-orange-500"}`}
                required={!isView}
              />
            </div>
          ))}
          {!isView && (
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">
                {mode === "edit" ? "Update Payroll" : "Save Payroll"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

/* ---------------------- Bulk Payment Modal ---------------------- */
const BulkPaymentModal = ({ isOpen, onClose, onProceed }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-[340px] rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <div className="bg-green-100 p-4 rounded-full mb-4 mt-4">
          <HelpCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">Proceed with payment to selected users?</h2>
        <p className="text-gray-500 text-sm text-center mb-6">Continue to payment</p>

        <div className="flex flex-col w-full gap-3">
          <button onClick={() => { onProceed(); onClose(); }} className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition">Proceed</button>
          <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-300 transition">Close</button>
        </div>
      </div>
    </div>
  );
};
/* ---------------------- Bulk Payment Page (reduced bold version) ---------------------- */
const BulkPaymentPageStatic = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:underline text-sm"
        >
          &larr; Back
        </button>
      </div>

      <section className="border-0">
        <div className="bg-[#124A71] w-full text-white rounded-lg overflow-hidden shadow-md">
          <div className="flex justify-between p-4 items-center text-sm">
            <p>No 1111111</p>
            <div className="text-center">
              <p className="font-semibold text-xl">Gold International Academy</p>
              <p className="text-center text-xs">Lorem ipsum dolor sit amet</p>
            </div>
            <p className="text-red-400 text-xs -mt-3">
              Lorem ipsum dolor sit amet consectet
            </p>
          </div>

          <nav className="-ml-45 py-2">
            <h1 className="text-2xl text-center font-semibold">
              Total: N1,400,000.00
            </h1>
          </nav>

          <div className="flex justify-between p-4 text-xs">
            <div>Term: First Term</div>
            <div className="text-center">Date: 25th Oct, 2025</div>
            <div>Session: 2024/2025</div>
          </div>
        </div>

        <section className="flex flex-col lg:flex-row justify-between border-t-2 border-black mt-6 gap-6">
          {/* Staff ID column */}
          <div id="staff-id" className="w-full lg:w-1/4">
            <div className="bg-indigo-500 p-2 w-full text-center text-white rounded text-sm">
              Staff ID
            </div>
            <div className="flex flex-col items-center justify-center gap-2 mt-4 text-sm">
              {Array.from({ length: 11 }).map((_, i) => (
                <p key={i} className="w-full text-center py-2 text-gray-700">
                  fdgshkjl
                </p>
              ))}
            </div>
          </div>

          {/* Beneficiary column */}
          <div id="Beneficiary" className="w-full lg:w-1/3">
            <div className="bg-indigo-500 p-2 w-full text-center text-white rounded text-sm">
              Beneficiary
            </div>
            <div className="flex flex-col gap-2 mt-3">
              {Array.from({ length: 11 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  className="border rounded-sm text-center py-2 text-sm"
                  placeholder="open Math"
                />
              ))}
            </div>
          </div>

          {/* Amount column */}
          <div id="Amount" className="w-full lg:w-1/4">
            <div className="bg-indigo-500 p-2 w-full text-white rounded text-sm text-center">
              Amount
            </div>
            <div className="flex flex-col px-2 gap-2 mt-2">
              {Array.from({ length: 11 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder="N150,000"
                  className="border py-2 rounded-sm w-full text-sm text-center"
                />
              ))}
            </div>
          </div>
        </section>

        <p className="border-4 ml-18 border-indigo-700 mt-4"></p>

        <section className="flex flex-col lg:flex-row justify-between gap-6 mt-4">
          <div className="flex flex-col gap-2 w-full lg:w-1/3 text-sm">
            <p className="px-18 mt-3">Ojone</p>
            <p className="px-18 mt-3">Ojone</p>
            <p className="px-18 mt-3">Ojone</p>
          </div>

          <div className="flex flex-col gap-2 mt-3 w-full lg:w-1/3">
            <input
              type="text"
              className="border rounded-sm text-center py-2 text-sm"
              placeholder="open Math"
            />
            <input
              type="text"
              className="border rounded-sm text-center py-2 text-sm"
              placeholder="open Math"
            />
            <input
              type="text"
              className="border rounded-sm text-center py-2 text-sm"
              placeholder="open Math"
            />
          </div>

          <div className="flex flex-col px-2 gap-2 mt-2 w-full lg:w-1/3">
            <input
              type="text"
              placeholder="N150,000"
              className="border py-2 rounded-sm w-full text-sm text-center"
            />
            <input
              type="text"
              placeholder="N150,000"
              className="border py-2 rounded-sm w-full text-sm text-center"
            />
            <input
              type="text"
              placeholder="N150,000"
              className="border py-2 rounded-sm w-full text-sm text-center"
            />
          </div>
        </section>

        <p className="border-4 ml-18 border-indigo-700 mt-4 mb-4"></p>

        <section className="flex flex-col lg:flex-row justify-between gap-6 text-sm">
          <div className="flex flex-col gap-2 w-full lg:w-1/3">
            <p className="px-18 mt-3">Ojone</p>
            <p className="px-18 mt-3">Ojone</p>
            <p className="px-18 mt-3 text-yellow-600">Ojone</p>
          </div>

          <div className="flex flex-col gap-2 mt-3 w-full lg:w-1/3">
            <input
              type="text"
              className="border rounded-sm text-center py-2 text-sm"
              placeholder="open Math"
            />
            <input
              type="text"
              className="border rounded-sm text-center py-2 text-sm"
              placeholder="open Math"
            />
          </div>

          <div className="flex flex-col px-2 gap-2 mt-2 w-full lg:w-1/3">
            <input
              type="text"
              placeholder="N150,000"
              className="border py-2 rounded-sm w-full text-sm text-center"
            />
            <input
              type="text"
              placeholder="N150,000"
              className="border py-2 rounded-sm w-full text-sm text-center"
            />
            <input
              type="text"
              placeholder="N150,000"
              className="border py-2 rounded-sm w-full text-sm text-center text-yellow-600"
            />
          </div>
        </section>
      </section>

      <div className="flex space-x-4 p-4 justify-center mt-6">
        <button className="bg-orange-600 h-11 px-8 rounded text-white text-lg">
          Confirm Payment
        </button>
        <button
          onClick={onBack}
          className="bg-gray-400 h-11 px-8 rounded text-white text-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};


/* ---------------------- Main Dashboard (single file) ---------------------- */
const PayrollDashboard = () => {
  const [activeTab, setActiveTab] = useState("all");

  const [allPayrollData, setAllPayrollData] = useState([
    {
      id: 1,
      staffId: "4496951",
      name: "Ojone Martins",
      role: "Secretary",
      department: "Admin",
      basicSalary: "100000",
      allowance: "20000",
      deductions: "2000",
      date: "2023-02-22",
      status: "Pending",
    },
    {
      id: 2,
      staffId: "4496952",
      name: "Ada Lovelace",
      role: "Teacher",
      department: "Academics",
      basicSalary: "120000",
      allowance: "25000",
      deductions: "5000",
      date: "2023-02-22",
      status: "Pending",
    },
  ]);

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
  const [modalMode, setModalMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

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

  const handleDelete = (row, target = "record") => {
    setSelectedData(row);
    setDeleteTarget(target);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === "record") {
      setAllPayrollData((prev) => prev.filter((i) => i.id !== selectedData.id));
    } else {
      setPaymentHistoryData((prev) => prev.filter((i) => i.id !== selectedData.id));
    }
    setShowDeleteModal(false);
  };

  const handleSubmitForm = (data) => {
    if (modalMode === "add") {
      setAllPayrollData((prev) => [
        ...prev,
        { ...data, id: prev.length ? prev[prev.length - 1].id + 1 : 1, status: "Pending" },
      ]);
    } else {
      setAllPayrollData((prev) => prev.map((i) => (i.id === data.id ? data : i)));
    }
  };

  const openSlipFromHistory = (row) => {
    setSelectedData(row);
    setShowSlipModal(true);
  };

  // Generate payroll for a single row and add to history
  const handleGeneratePayroll = (row) => {
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
    setAllPayrollData((prev) => prev.map((p) => (p.id === row.id ? { ...p, status: "Paid" } : p)));
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-500">Total Payroll</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">
              ₦{allPayrollData.reduce((s, r) => s + (parseFloat(r.basicSalary) || 0), 0).toLocaleString()}
            </p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-500">Paid Staff</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">{allPayrollData.filter(r => r.status === "Paid").length}</p>
          </div>
          <Users className="w-8 h-8 text-blue-600" />
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-500">Pending Payments</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">{allPayrollData.filter(r => r.status !== "Paid").length}</p>
          </div>
          <CreditCard className="w-8 h-8 text-yellow-600" />
        </div>

        <div className="bg-orange-50 p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h3 className="text-sm text-gray-500">This Month's Total</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">₦820,000</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-600" />
        </div>
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
            className={`pb-2 px-4 text-sm font-medium ${
              activeTab === tab.key
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-orange-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-gray-600">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {tableConfig.headers.map((h) => (
                <th key={h} className="py-3 px-4 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableConfig.data.map((row, idx) => (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4">{row.staffId}</td>
                <td className="py-3 px-4">{row.name}</td>
                <td className="py-3 px-4">{row.role}</td>

                {activeTab === "all" ? (
                  <>
                    <td className="py-3 px-4">₦{Number(row.basicSalary).toLocaleString()}</td>
                    <td className="py-3 px-4">₦{Number(row.allowance).toLocaleString()}</td>
                    <td className="py-3 px-4">₦{Number(row.deductions).toLocaleString()}</td>
                    <td className="py-3 px-4">{row.date}</td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-4">{row.netPay}</td>
                    <td className="py-3 px-4">{row.department}</td>
                    <td className="py-3 px-4">{row.date}</td>
                  </>
                )}

                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${row.status === "Completed" || row.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {row.status}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {activeTab === "all" ? (
                      <>
                        <button onClick={() => handleView(row)} className="p-2 bg-green-100 text-green-600 rounded"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(row)} className="p-2 bg-blue-100 text-blue-600 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(row, "record")} className="p-2 bg-red-100 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                        <button onClick={() => handleGeneratePayroll(row)} className="p-2 bg-orange-100 text-orange-600 rounded"><DollarSign className="w-4 h-4" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openSlipFromHistory(row)} className="p-2 bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(row, "history")} className="p-2 bg-red-100 rounded"><Trash2 className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

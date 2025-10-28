import { DollarSign, Edit, Eye, Trash2 } from 'lucide-react'
import React from 'react'

interface PayrollTableProps {
    activeTab: string;
    handleView: (data: any) => void;
    handleEdit: (data: any) => void;
    handleDelete: (data: any) => void;
    handleGeneratePayroll: (data: any) => void;
    data: any;
}

const AllPayrollTable: React.FC<PayrollTableProps> = ({ activeTab, handleView, handleEdit, handleDelete, handleGeneratePayroll, data = [] }) => {

    const tableConfig = {
        headers: [
            // "SN",
            // "Staff ID",
            "Name",
            "Role",
            "Base Salary",
            "Allowances",
            "Deductions",
            "Date",
            "Status",
            "Actions",
        ]
    }
    return (
        <div>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full text-sm text-gray-600">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            {tableConfig.headers.map((h: any) => (
                                <th key={h} className="py-3 px-4 text-left font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((row: any, idx: number) => (
                            <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                                {/* <td className="py-3 px-4">{idx + 1}</td> */}
                                {/* <td className="py-3 px-4">{row.staffId}</td> */}
                                <td className="py-3 px-4 whitespace-nowrap">{row.teacher.firstname} {row.teacher.lastname}</td>
                                <td className="py-3 px-4">{row.teacher.role}</td>

                                {activeTab === "all" ? (
                                    <>
                                        <td className="py-3 px-4">₦{Number(row.baseSalary).toLocaleString()}</td>
                                        <td className="py-3 px-4">₦{Number(row.allowances).toLocaleString()}</td>
                                        <td className="py-3 px-4">₦{Number(row.deductions).toLocaleString()}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{row.createdAt.split("T")[0]}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-3 px-4">{row.netPay}</td>
                                        <td className="py-3 px-4">{row.department}</td>
                                        <td className="py-3 px-4">{row.date}</td>
                                    </>
                                )}

                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${row.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                        {row.isPaid ? "Paid" : "Pending"}
                                    </span>
                                </td>

                                <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                        <>
                                            <button onClick={() => handleView(row)} className="p-2 bg-green-100 text-green-600 rounded"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => handleEdit(row)} className="p-2 bg-blue-100 text-blue-600 rounded"><Edit className="w-4 h-4" /></button>
                                            {/* <button onClick={() => handleDelete(row, "record")} className="p-2 bg-red-100 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button> */}
                                            <button onClick={() => handleGeneratePayroll(row)} className="p-2 bg-orange-100 text-orange-600 rounded"><DollarSign className="w-4 h-4" /></button>
                                        </>
                                        {/* {activeTab === "all" ? (
                                        ) : (
                                            <>
                                                <button onClick={() => openSlipFromHistory(row)} className="p-2 bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(row, "history")} className="p-2 bg-red-100 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </>
                                        )} */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AllPayrollTable
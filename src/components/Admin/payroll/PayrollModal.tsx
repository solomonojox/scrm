import { useEffect, useState } from "react";
import { useAuth } from "../../../Context/Auth/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import Select from "react-select";

interface PayrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit" | "view";
    data?: any; // data for edit/view mode
    onSubmit: (data: any) => void; // function to handle form submission
    loading?: boolean;
}

interface PayrollForm {
    teacherId: string;
    schoolId: string | undefined;
    baseSalary: number;
    allowances: number;
    deductions: number;
    payPeriod: string;
}

interface OptionType {
    value: string;
    label: string;
}

const PayrollModal = ({ isOpen, onClose, mode, data, onSubmit, loading }: PayrollModalProps) => {
    const { user } = useAuth()
    const isView = mode === "view";
    const [formData, setFormData] = useState<PayrollForm>({
        teacherId: "",
        schoolId: user?.schoolId,
        baseSalary: 0,
        allowances: 0,
        deductions: 0,
        payPeriod: ""
    });

    const teachers = useSelector((state: RootState) => state.getTeacher.listRecords || []);

    const teacherOptions: OptionType[] = teachers.map((teacher) => ({
        value: String(teacher.teacherId),
        label: `${teacher.firstname} ${teacher.lastname} (${teacher.phone})`,
    }));

    const getSelectedOption = (value: string, options: OptionType[]) => {
        if (!value) return null;
        return options.find((option) => option.value === String(value)) || null;
    };

    useEffect(() => {
        if (data) {
            // Convert numeric fields to numbers and ensure proper formatting
            setFormData({
                teacherId: data.teacherId || "",
                schoolId: data.schoolId || user?.schoolId,
                baseSalary: Number(data.baseSalary) || 0,
                allowances: Number(data.allowances) || 0,
                deductions: Number(data.deductions) || 0,
                payPeriod: data.payPeriod ? new Date(data.payPeriod).toISOString().split('T')[0] : ""
            });
        } else {
            // Reset form for add mode
            setFormData({
                teacherId: "",
                schoolId: user?.schoolId,
                baseSalary: 0,
                allowances: 0,
                deductions: 0,
                payPeriod: ""
            });
        }
    }, [data, isOpen, user?.schoolId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isView) return;
        const name = e.target.name as keyof PayrollForm;
        let value: string | number = e.target.value;

        // Convert numeric fields to numbers
        if (name === 'baseSalary' || name === 'allowances' || name === 'deductions') {
            value = value === '' ? 0 : Number(value);
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (fieldName: keyof PayrollForm, selectedOption: OptionType | null) => {
        if (isView) return;
        setFormData(prev => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : ""
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prepare the payload in the required format
        const payload = {
            ...formData,
            // Ensure payPeriod is in ISO format if provided
            payPeriod: formData.payPeriod ? new Date(formData.payPeriod).toISOString() : new Date().toISOString()
        };
        
        onSubmit(payload);
    };

    // Calculate net salary
    const netSalary = formData.baseSalary + formData.allowances - formData.deductions;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
                <div className="bg-orange-500 text-white text-center py-3 rounded-t-xl -mt-6 -mx-6 mb-6">
                    <h2 className="text-lg font-semibold capitalize">
                        {mode === "add" ? "Add Payroll" : mode === "edit" ? "Edit Payroll" : "View Payroll"}
                    </h2>
                </div>

                <button 
                    className="absolute top-3 right-4 text-gray-700 text-xl font-bold hover:text-orange-500 transition" 
                    onClick={onClose}
                    type="button"
                >
                    ×
                </button>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Teacher Selection */}
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-1">Teacher *</label>
                        <Select
                            options={teacherOptions}
                            value={getSelectedOption(formData.teacherId, teacherOptions)}
                            onChange={(selected) => handleSelectChange("teacherId", selected)}
                            placeholder="Select Teacher"
                            className="text-sm"
                            isDisabled={isView}
                            isSearchable
                            required={!isView}
                        />
                    </div>

                    {/* Pay Period */}
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-1">Pay Period *</label>
                        <input
                            type="date"
                            name="payPeriod"
                            value={formData.payPeriod}
                            onChange={handleChange}
                            disabled={isView}
                            className={`w-full border border-orange-400 rounded-md p-2 focus:outline-none ${
                                isView ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-orange-500"
                            }`}
                            required={!isView}
                        />
                    </div>

                    {/* Base Salary */}
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-1">Base Salary *</label>
                        <input
                            type="number"
                            name="baseSalary"
                            value={formData.baseSalary || ""}
                            onChange={handleChange}
                            disabled={isView}
                            min="0"
                            step="0.01"
                            className={`w-full border border-orange-400 rounded-md p-2 focus:outline-none ${
                                isView ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-orange-500"
                            }`}
                            required={!isView}
                        />
                    </div>

                    {/* Allowances */}
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-1">Allowances</label>
                        <input
                            type="number"
                            name="allowances"
                            value={formData.allowances || ""}
                            onChange={handleChange}
                            disabled={isView}
                            min="0"
                            step="0.01"
                            className={`w-full border border-orange-400 rounded-md p-2 focus:outline-none ${
                                isView ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-orange-500"
                            }`}
                        />
                    </div>

                    {/* Deductions */}
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-1">Deductions</label>
                        <input
                            type="number"
                            name="deductions"
                            value={formData.deductions || ""}
                            onChange={handleChange}
                            disabled={isView}
                            min="0"
                            step="0.01"
                            className={`w-full border border-orange-400 rounded-md p-2 focus:outline-none ${
                                isView ? "bg-gray-100 cursor-not-allowed" : "focus:ring-2 focus:ring-orange-500"
                            }`}
                        />
                    </div>

                    {/* Net Salary (Read-only) */}
                    <div className="col-span-1">
                        <label className="block text-gray-700 font-medium mb-1">Net Salary</label>
                        <input
                            type="text"
                            value={`₦${netSalary.toLocaleString()}`}
                            disabled
                            className="w-full border border-orange-400 rounded-md p-2 bg-gray-100 cursor-not-allowed font-semibold text-green-600"
                            readOnly
                        />
                    </div>

                    {/* Action Buttons */}
                    {!isView && (
                        <div className="md:col-span-2 flex gap-3 mt-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : mode === "edit" ? "Update Payroll" : "Save Payroll"}
                            </button>
                        </div>
                    )}

                    {/* View Mode Close Button */}
                    {isView && (
                        <div className="md:col-span-2 mt-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PayrollModal;
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { studentService } from "../../../Services/Student/StudentService";
import Select from 'react-select';
import { RootState } from "../../../Store/store";
import { useSelector } from "react-redux";

interface StudentFormProps {
    onClose: () => void;
    onSubmitSuccess: () => void;
    editData: any;
}

interface OptionType {
    value: string;
    label: string;
}

const StudentForm: React.FC<StudentFormProps> = ({ onClose, onSubmitSuccess, editData }) => {
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        // enteredClass: 0,
        dateOfBirth: "",
        homeAddress: "",
        guardianId: "",
        teacherId: "",
        currentTerm: 0,
        sessionId: "",
        classroomId: ""
    });

    // Get data from Redux store
    const guardians = useSelector((state: RootState) => state.getGuardian.listRecords);
    const teachers = useSelector((state: RootState) => state.getTeacher.listRecords);
    const sessions = useSelector((state: RootState) => state.getSession.listRecords);
    const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);

    // Set initial form data when editData changes
    useEffect(() => {
        if (editData) {
            setFormData({
                firstname: editData.firstname || "",
                lastname: editData.lastname || "",
                // enteredClass: editData.enteredClass || 0,
                dateOfBirth: editData.dateOfBirth ? editData.dateOfBirth.split('T')[0] : "",
                homeAddress: editData.homeAddress || "",
                guardianId: editData.guardianId || "",
                teacherId: editData.teacherId || "",
                currentTerm: editData.currentTerm || 0,
                sessionId: editData.currentSession || "",
                classroomId: editData.classroomId || ""
            });
        }
    }, [editData]);

    // Prepare options for react-select
    const guardianOptions: OptionType[] = guardians.map(guardian => ({
        value: guardian.guardianId,
        label: `${guardian.firstname} ${guardian.lastname} (${guardian.phone})`
    }));

    const teacherOptions: OptionType[] = teachers.map(teacher => ({
        value: teacher.teacherId,
        label: `${teacher.firstname} ${teacher.lastname} (${teacher.phone})`
    }));

    const sessionOptions: OptionType[] = sessions.map(session => ({
        value: session.sessionId,
        label: session.sessionName
    }));

    const classroomOptions: OptionType[] = classrooms.map(classroom => ({
        value: classroom.classroomId,
        label: `${classroom.name} (Capacity: ${classroom.capacity})`
    }));

    const termOptions: any[] = [
        { value: 1, label: "First Term" },
        { value: 2, label: "Second Term" },
        { value: 3, label: "Third Term" }
    ];

    // Get the current selected options for the select fields
    const getSelectedOption = (value: string, options: OptionType[]) => {
        return options.find(option => option.value === value) || null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // [name]: name === 'enteredClass' ? parseInt(value) : value
        }));
    };

    const handleSelectChange = (name: string, selectedOption: OptionType | null) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption ? selectedOption.value : ""
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormError("");

        const payload = {
            schoolId: "d5bca6af-0658-4f9d-a6a4-08ddcc154429",
            firstname: formData.firstname,
            lastname: formData.lastname,
            // enteredClass: formData.enteredClass,
            dateOfBirth: formData.dateOfBirth,
            homeAddress: formData.homeAddress,
            guardianId: formData.guardianId,
            teacherId: formData.teacherId,
            currentTerm: parseInt(formData.currentTerm as unknown as string),
            sessionId: formData.sessionId,
            classroomId: formData.classroomId
        };

        try {
            if (editData) {
                await studentService.update(editData.studentId, payload);
                toast.success("Student updated successfully!");
            } else {
                const res = await studentService.create(payload);
                toast.success(res.responseMessage || "Student added successfully!");
            }

            onSubmitSuccess();
            if (!editData) {
                setFormData({
                    firstname: "",
                    lastname: "",
                    // enteredClass: 0,
                    dateOfBirth: "",
                    homeAddress: "",
                    guardianId: "",
                    teacherId: "",
                    currentTerm: 0,
                    sessionId: "",
                    classroomId: ""
                });
            }
            setImagePreview(null);
        } catch (err: any) {
            const msg = err.response?.data?.responseMessage ||
                (editData ? "Update failed" : "Submission failed");
            setFormError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div
                className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-orange-500 h-2 rounded-t-lg" />
                <div className="p-4 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4 text-center">
                        {editData ? "Edit Student" : "Add Student"}
                    </h2>
                    {formError && <p className="text-red-600 mb-4 text-center">{formError}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="relative col-span-2 w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 border-2 border-orange-400 overflow-hidden cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="flex items-center justify-center h-full text-orange-400 font-bold text-xl">
                                        +
                                    </span>
                                )}
                            </label>

                            {/* Regular input fields */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="First Name"
                                    required
                                    className="border px-3 py-2 rounded text-sm w-full"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Last Name"
                                    required
                                    className="border px-3 py-2 rounded text-sm w-full"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                            <input
                                type="number"
                                name="enteredClass"
                                placeholder="Class"
                                required
                                className="border px-3 py-2 rounded text-sm w-full"
                                value={formData.enteredClass}
                                onChange={handleInputChange}
                                readOnly={!!editData}
                            />
                        </div> */}

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    placeholder="Date of Birth"
                                    className="border px-3 py-2 rounded text-sm w-full"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                                <input
                                    type="text"
                                    name="homeAddress"
                                    placeholder="Home Address"
                                    className="border px-3 py-2 rounded text-sm w-full"
                                    value={formData.homeAddress}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Select fields */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian</label>
                                <Select
                                    options={guardianOptions}
                                    value={getSelectedOption(formData.guardianId, guardianOptions)}
                                    onChange={(selected) => handleSelectChange("guardianId", selected)}
                                    placeholder="Select Guardian"
                                    className="text-sm"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                                <Select
                                    options={teacherOptions}
                                    value={getSelectedOption(formData.teacherId, teacherOptions)}
                                    onChange={(selected) => handleSelectChange("teacherId", selected)}
                                    placeholder="Select Teacher"
                                    className="text-sm"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Term</label>
                                <Select
                                    options={termOptions}
                                    value={getSelectedOption(formData.currentTerm.toString(), termOptions)}
                                    onChange={(selected) => handleSelectChange("currentTerm", selected)}
                                    placeholder="Select Term"
                                    className="text-sm"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                                <Select
                                    options={sessionOptions}
                                    value={getSelectedOption(formData.sessionId, sessionOptions)}
                                    onChange={(selected) => handleSelectChange("sessionId", selected)}
                                    placeholder="Select Session"
                                    className="text-sm"
                                />
                            </div>
                        </div>


                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Classroom</label>
                            <Select
                                options={classroomOptions}
                                value={getSelectedOption(formData.classroomId, classroomOptions)}
                                onChange={(selected) => handleSelectChange("classroomId", selected)}
                                placeholder="Select Classroom"
                                className="text-sm"
                            />
                        </div>

                        <div className="col-span-2 flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
                            >
                                {loading ? (
                                    editData ? "Updating..." : "Saving..."
                                ) : (
                                    editData ? "Update" : "Submit"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentForm;
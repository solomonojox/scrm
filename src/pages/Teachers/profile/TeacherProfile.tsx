import React, { useEffect, useRef, useState } from "react";
import { FaCamera, FaEdit, FaSpinner } from "react-icons/fa";
import imageAssets from "../../../assets/imageAssets";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { useAuth } from "../../../Context/Auth/useAuth";
import {
  fetchATeacherStart,
  fetchTeacherFailure,
  fetchTeacherStart,
  fetchTeacherSuccess,
} from "../../../Store/Teachers/teacherSlice";

export default function TeacherProfile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getTeacher.selectedTeacher);
  const fetchedLoading = useSelector((state: RootState) => state.getTeacher.loading);
  const error = useSelector((state: RootState) => state.getTeacher.error);

  // 🔑 toggle editing state
  const [isEditing, setIsEditing] = useState(false);

  // 🔑 form state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    homeAddress: "",
    nationality: "",
    stateOfOrigin: "",
    role: "",
    religion: "",
    email: "",
    username: "",
  });

  // populate form when data fetched
  useEffect(() => {
    if (fetchedRecord) {
      setFormData({
        firstname: fetchedRecord?.firstname || "",
        lastname: fetchedRecord?.lastname || "",
        phone: fetchedRecord?.phone || "",
        homeAddress: fetchedRecord?.homeAddress || "",
        nationality: fetchedRecord?.nationality || "",
        stateOfOrigin: fetchedRecord?.stateOfOrigin || "",
        role: fetchedRecord?.role || "",
        religion: fetchedRecord?.religion || "",
        email: fetchedRecord?.email || "",
        username: fetchedRecord?.username || "",
      });
    }
  }, [fetchedRecord]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
    }
  };

  useEffect(() => {
    if (user?.id && !fetchedLoading) {
      fetchTeacher();
    }
  }, [user, dispatch]);

  const fetchTeacher = async () => {
    dispatch(fetchTeacherStart());

    try {
      const data = await teacherService.getById(user?.id);
      dispatch(fetchATeacherStart(data));
    } catch (err: any) {
      dispatch(fetchTeacherFailure(err.message));
    }
  };

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // call API to update
      await teacherService.update(user?.id, formData);

      // after success, re-fetch guardian to update redux state
      fetchTeacher();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating guardian:", error);
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="bg-white pt-2">
      <div>
        <h2 className="font-bold text-[16px] m-4">Personal Information</h2>
        <div className=" bg-white  shadow overflow-hidden">
          {/* Banner */}
          <div className="relative w-full">
            <img
              src={imageAssets.color}
              alt="Orange gradient banner"
              className="w-full h-[150px] object-cover bg-[#EE7306]"
            />
          </div>

          {/* Profile + Name + Actions */}
          <div className="flex items-center justify-between px-4 md:px-6 mt-[-50px]">
            {/* Picture + Info */}
            <div className="flex flex-col md:flex-row items-center space-x-4">
              <div className="w-[200px] h-[200px] md:w-[100px] md:h-[100px] rounded-full border-4 border-white overflow-hidden bg-[#d9b89a] relative">
                <img
                  src={imageAssets.man}
                  alt="Profile"
                  className="w-full h-full object-cover z-0"
                />
                <div
                  className="absolute bottom-6 md:bottom-2 right-6 md:right-2 z-10 bg-[#EE7306] rounded-full p-[8px] border-2 border-white cursor-pointer"
                  title="Change profile picture"
                  onClick={handleCameraClick}
                >
                  <FaCamera className="text-white text-sm" />
                </div>
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Name + Buttons */}
              <div className="mt-19">
                <p className="font-bold text-[15px] leading-none">
                  {fetchedRecord?.firstname} {fetchedRecord?.lastname}
                </p>
                <p className="text-[12px] text-gray-600 font-semibold mb-2">
                  {fetchedRecord?.role}
                </p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="bg-[#EE7306] text-white text-[12px] px-4 py-2 rounded-md font-bold"
                  >
                    Change Picture
                  </button>
                  <button
                    type="button"
                    disabled
                    className="bg-gray-300 text-white text-[12px] px-4 py-2 rounded-md font-bold cursor-not-allowed"
                  >
                    Delete Picture
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Profile Toggle */}
            <div
              className="text-[12px] md:text-[16px] text-[#EE7306] flex items-center cursor-pointer select-none"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <FaEdit className="mr-1" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </div>
          </div>

          {/* Form */}
          <div className="p-4 md:p-6">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-md gap-y-5"
            >
              {[
                { label: "First Name", id: "firstname", type: "text" },
                { label: "Last Name", id: "lastname", type: "text" },
                { label: "Phone Number", id: "phone", type: "text" },
                { label: "Home Address", id: "homeAddress", type: "text" },
                { label: "Nationality", id: "nationality", type: "text" },
                { label: "State of Origin", id: "stateOfOrigin", type: "text" },
                { label: "Role", id: "role", type: "text" },
                { label: "Religion", id: "religion", type: "text" },
                { label: "Email", id: "email", type: "email", disable: true },
                { label: "Username", id: "username", type: "text", },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-[12px] text-gray-700 mb-1 font-bold"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={(formData as any)[field.id] || ""}
                    onChange={handleChange}
                    readOnly={!isEditing || field.disable}
                    className={`w-full rounded px-3 py-2 text-[12px]  ${isEditing
                        ? `border focus:outline-none ${field.disable ? "text-gray-400" : "focus:ring-1 focus:ring-[#e67e22] border-[#EE7306]"}`
                        : "bg-gray-100 cursor-not-allowed border border-gray-300 outline-none"
                      }`}
                  />
                </div>
              ))}

              {/* Save Button */}
              {isEditing && (
                <div className="mt-6 col-span-2">
                  <button
                    type="submit"
                    className="bg-[#EE7306] text-white text-[12px] px-5 py-2 rounded font-bold"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </span>
                    ) : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

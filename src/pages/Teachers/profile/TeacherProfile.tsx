import React, { useEffect, useRef, useState } from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import imageAssets from "../../../assets/imageAssets";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import {
  fetchGuardiansFailure,
  fetchGuardiansStart,
  fetchGuardianStart,
} from "../../../Store/Guardian/guardianSlice";
import { guardianService } from "../../../Services/Guardian/guardian";
import { useAuth } from "../../../Context/Auth/useAuth";

export default function TeacherProfile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getGuardian.selectedGuardian);
  const fetchedLoading = useSelector((state: RootState) => state.getGuardian.loading);
  const error = useSelector((state: RootState) => state.getGuardian.error);

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
    occupation: "",
    workAddress: "",
  });

  // populate form when data fetched
  useEffect(() => {
    if (fetchedRecord) {
      setFormData({
        firstname: fetchedRecord.firstname || "",
        lastname: fetchedRecord.lastname || "",
        phone: fetchedRecord.phone || "",
        homeAddress: fetchedRecord.homeAddress || "",
        nationality: fetchedRecord.nationality || "",
        stateOfOrigin: fetchedRecord.stateOfOrigin || "",
        role: fetchedRecord.role || "",
        religion: fetchedRecord.religion || "",
        email: fetchedRecord.email || "",
        username: fetchedRecord.username || "",
        occupation: fetchedRecord.occupation || "",
        workAddress: fetchedRecord.workAddress || "",
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
      fetchGuardian();
    }
  }, [user, dispatch]);

  const fetchGuardian = async () => {
    dispatch(fetchGuardiansStart());
    try {
      const data = await guardianService.getGuardianById(user?.id);
      dispatch(fetchGuardianStart(data));
    } catch (err) {
      dispatch(fetchGuardiansFailure((err as Error).message));
    }
  };

  // 🔑 handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 🔑 handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting changes:", formData);
      // call API to update
      await guardianService.updateGuardian(user?.id, formData);

      // after success, re-fetch guardian to update redux state
      fetchGuardian();

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating guardian:", error);
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
                  {fetchedRecord?.occupation}
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
                { label: "Email", id: "email", type: "email" },
                { label: "Username", id: "username", type: "text" },
                { label: "Occupation", id: "occupation", type: "text" },
                { label: "Work Address", id: "workAddress", type: "text" },
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
                    readOnly={!isEditing}
                    className={`w-full rounded px-3 py-2 text-[12px]  ${
                      isEditing
                        ? "border focus:outline-none focus:ring-1 focus:ring-[#e67e22] border-[#EE7306]"
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
                    Save Changes
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

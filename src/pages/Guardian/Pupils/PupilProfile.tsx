import React, { useRef } from "react";
import { FaCamera } from "react-icons/fa";
import imageAssets from "../../../assets/imageAssets";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function PupilProfile() {
  const location = useLocation();
  const pupil = location.state;
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get term name from number
  const getTermName = (term: number) => {
    switch(term) {
      case 1: return 'First Term';
      case 2: return 'Second Term';
      case 3: return 'Third Term';
      default: return 'N/A';
    }
  };

  return (
    <div className="bg-white pt-2">
      <div className="">
        <h2 className="font-bold text-[16px] m-2">Personal Information</h2>
        <ArrowLeft className="cursor-pointer mb-2 ml-2" onClick={() => window.history.back()} />
        <div className="bg-white shadow overflow-hidden">
          <div className="relative w-full">
            <img
              src={imageAssets.color}
              alt="Orange gradient banner"
              className="w-full h-[150px] object-cover bg-[#EE7306]"
            />
          </div>

          {/* Profile + Name + Actions */}
          <div className="flex items-center justify-between px-4 md:px-6 mt-[-50px]">
            {/* Left section: Picture + Info */}
            <div className="flex flex-col md:flex-row items-center space-x-4">
              <div className="w-[200px] h-[200px] md:w-[100px] md:h-[100px] rounded-full border-4 border-white overflow-hidden bg-[#d9b89a] relative">
                <img
                  src={pupil?.imagePath || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                  alt="Profile"
                  className="w-full h-full object-cover z-0"
                />
                <div
                  className="absolute bottom-6 md:bottom-2 right-6 md:right-2 z-10 bg-[#EE7306] rounded-full p-[8px] border-2 border-white cursor-pointer"
                  title="View profile picture"
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
                  disabled
                />
              </div>

              {/* Name, Title, Buttons */}
              <div className="mt-19">
                <p className="font-bold text-[15px] leading-none">{pupil?.firstname} {pupil?.lastname}</p>
                <p className="text-[12px] text-gray-600 font-semibold mb-2">
                  Student ID: {pupil?.studentNo || 'N/A'}
                </p>
                <p className="text-[12px] text-gray-600 font-semibold mb-2">
                  Class: {pupil?.classroom?.name || 'No class assigned'}
                </p>
              </div>
            </div>

            {/* View Only Indicator */}
            <div className="text-[12px] md:text-[16px] text-gray-500 flex items-center select-none">
              View Only
            </div>
          </div>

          {/* Form */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-md gap-y-5">
              {/* Student ID */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Student ID
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.studentNo || 'N/A'}
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  First Name
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.firstname || 'N/A'}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Last Name
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.lastname || 'N/A'}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Gender
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.gender || 'N/A'}
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Date of Birth
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {formatDate(pupil?.dateOfBirth)}
                </div>
              </div>

              {/* Home Address */}
              <div className="sm:col-span-2">
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Home Address
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.homeAddress || 'N/A'}
                </div>
              </div>

              {/* Guardian */}
              <div className="sm:col-span-2">
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Guardian
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.guardian ? `${pupil.guardian.firstname} ${pupil.guardian.lastname}` : 'N/A'}
                </div>
              </div>

              {/* Guardian Contact */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Guardian Phone
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.guardian?.phone || 'N/A'}
                </div>
              </div>

              {/* Guardian Email */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Guardian Email
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.guardian?.email || 'N/A'}
                </div>
              </div>

              {/* Current Term */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Current Term
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {getTermName(pupil?.currentTerm)}
                </div>
              </div>

              {/* Admission Session */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Admission Session
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.admissionSession || 'N/A'}
                </div>
              </div>

              {/* Current Session */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Current Session
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.currentSession || 'N/A'}
                </div>
              </div>

              {/* Classroom */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Classroom
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.classroom?.name || 'N/A'}
                </div>
              </div>

              {/* Classroom Capacity */}
              <div>
                <label className="block text-[12px] text-gray-700 mb-1 font-bold">
                  Classroom Capacity
                </label>
                <div className="w-full rounded px-3 py-2 text-[12px] bg-gray-100">
                  {pupil?.classroom?.capacity || 'N/A'} students
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
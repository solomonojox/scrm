import { useLocation } from "react-router-dom";
import {
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaSchool,
  FaCalendarAlt,
  FaIdBadge,
  FaChalkboardTeacher,
  FaUserFriends,
  FaHashtag,
} from "react-icons/fa";

const ViewMyPupils = () => {
  const location = useLocation();
  const moreDetails = location.state;

  const calculateAge = (dob: string): number => {
    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // Guards against landing here without navigation state (e.g. direct URL access)
  if (!moreDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-sm p-8 text-center bg-white shadow-md rounded-2xl">
          <p className="mb-4 text-gray-600">No student data was passed to this page.</p>
          <button
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const classroomLabel = moreDetails.classroom || (moreDetails.classroomId ? "Assigned" : "N/A");
  const dobDisplay = moreDetails.dateOfBirth ? moreDetails.dateOfBirth.split("T")[0] : "N/A";
  const ageDisplay = moreDetails.dateOfBirth ? `${calculateAge(moreDetails.dateOfBirth)} years` : "N/A";

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
  }) => (
    <div>
      <label className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-gray-500">
        <span className="text-orange-400">{icon}</span>
        {label}
      </label>
      <div className="flex items-center px-4 py-3 border rounded-lg border-orange-100 bg-orange-50/40">
        <span className="text-sm text-gray-800 truncate">{value || "N/A"}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .fade-in-up { animation: fadeInUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* Header with Back Button */}
      <div className="relative bg-linear-to-r from-orange-400 via-orange-500 to-orange-600">
        <div
          className="absolute z-10 flex items-center justify-center w-10 h-10 p-2 text-xl cursor-pointer text-white transition-all rounded-full shrink-0 top-4 left-4 bg-black/20 hover:bg-black/30"
          onClick={() => window.history.back()}
        >
          ←
        </div>
        <div className="relative flex items-center justify-center h-40 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-linear(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_45%)]" />
          <h1 className="text-2xl font-bold text-white">Student Profile</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center px-4 -mt-16 fade-in-up">
        <div className="relative">
          <div className="flex items-center justify-center text-4xl font-bold bg-white border-4 border-white rounded-full shadow-lg h-32 w-32 bg-linear-to-br from-orange-100 to-orange-50 text-orange-600">
            {moreDetails?.firstname?.charAt(0)?.toUpperCase()}
            {moreDetails?.lastname?.charAt(0)?.toUpperCase()}
          </div>
          <div className="absolute p-1.5 text-white bg-orange-500 rounded-full shadow-md -bottom-1 -right-1 ring-4 ring-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-800">
          {moreDetails?.firstname} {moreDetails?.lastname}
        </h2>
        {moreDetails?.studentNo && (
          <p className="mt-0.5 text-xs font-medium text-gray-400">{moreDetails.studentNo}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full shadow-sm">
            {ageDisplay}
          </span>
          {moreDetails?.gender && (
            <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full shadow-sm">
              {moreDetails.gender}
            </span>
          )}
          <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
            {classroomLabel}
          </span>
          {moreDetails?.isActive === false && (
            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-5xl px-4 py-6 mx-auto">
        <div className="overflow-hidden bg-white shadow-md rounded-2xl fade-in-up" style={{ animationDelay: "80ms" }}>
          {/* Section Header */}
          <div className="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-400">
            <h3 className="font-semibold text-white">Student Information</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Personal Details */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 pb-2 text-sm font-semibold tracking-wide text-orange-600 uppercase border-b border-orange-100">
                  <FaUser className="text-orange-400" /> Personal Details
                </h4>
                <InfoRow icon={<FaUser />} label="First Name" value={moreDetails?.firstname} />
                <InfoRow icon={<FaUser />} label="Last Name" value={moreDetails?.lastname} />
                <InfoRow icon={<FaBirthdayCake />} label="Date of Birth" value={dobDisplay} />
                <InfoRow icon={<FaBirthdayCake />} label="Age" value={ageDisplay} />
                {/* <InfoRow icon={<FaVenusMars />} label="Gender" value={moreDetails?.gender} /> */}
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 pb-2 text-sm font-semibold tracking-wide text-orange-600 uppercase border-b border-orange-100">
                  <FaSchool className="text-orange-400" /> Academic Information
                </h4>
                <InfoRow icon={<FaSchool />} label="Entered Class" value={classroomLabel} />
                <InfoRow icon={<FaCalendarAlt />} label="Current Term" value={moreDetails?.currentTerm} />
                <InfoRow icon={<FaCalendarAlt />} label="Session" value={moreDetails?.currentSession} />
                <InfoRow icon={<FaIdBadge />} label="Classroom ID" value={moreDetails?.classroomId} />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 pb-2 text-sm font-semibold tracking-wide text-orange-600 uppercase border-b border-orange-100">
                  <FaUserFriends className="text-orange-400" /> Contact Information
                </h4>
                <InfoRow icon={<FaUserFriends />} label="Guardian ID" value={moreDetails?.guardianId} />
                <InfoRow icon={<FaChalkboardTeacher />} label="Teacher ID" value={moreDetails?.teacherId} />
              </div>

              {/* Identification */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 pb-2 text-sm font-semibold tracking-wide text-orange-600 uppercase border-b border-orange-100">
                  <FaHashtag className="text-orange-400" /> Identification
                </h4>
                <InfoRow icon={<FaIdBadge />} label="Student No." value={moreDetails?.studentNo} />
                <InfoRow icon={<FaIdBadge />} label="Student ID" value={moreDetails?.studentId} />
                <InfoRow icon={<FaVenusMars />} label="Gender" value={moreDetails?.gender} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          {/* <button className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm">
            Edit Profile
          </button> */}
          <button
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors shadow-sm"
            onClick={() => window.history.back()}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMyPupils;
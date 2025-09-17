import React, { useState } from "react";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    assignment: false,
    attendance: false,
    messaging: false,
    event: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <h1 className="text-2xl font-semibold text-orange-500 mb-[468px] mr-[-111px]">
          Notifications
        </h1>
      <div className="bg-white shadow-lg rounded-xl max-w-lg p-6">
        {/* Title */}
        

        {/* Assignment */}
        <div className="flex items-center justify-between border-b py-4">
          <div>
            <h2 className="font-semibold text-gray-800">Assignment</h2>
            <p className="text-sm text-gray-500">
              Get alert when pupils submit assignments <br />
              Get alert when assignments are due
            </p>
          </div>
          <button
            onClick={() => toggleSetting("assignment")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              settings.assignment ? "bg-orange-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.assignment ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Attendance */}
        <div className="flex items-center justify-between border-b py-4">
          <div>
            <h2 className="font-semibold text-gray-800">Attendance</h2>
            <p className="text-sm text-gray-500">
              Get alert with weekly attendance summary <br />
              Get alert for high absenteeism or repeated lateness in pupils
            </p>
          </div>
          <button
            onClick={() => toggleSetting("attendance")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              settings.attendance ? "bg-orange-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.attendance ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Messaging */}
        <div className="flex items-center justify-between border-b py-4">
          <div>
            <h2 className="font-semibold text-gray-800">Messaging</h2>
            <p className="text-sm text-gray-500">
              Get alert when there are new messages from guardians <br />
              Get alert when there are announcements from Admin
            </p>
          </div>
          <button
            onClick={() => toggleSetting("messaging")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              settings.messaging ? "bg-orange-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.messaging ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Event & Meeting */}
        <div className="flex items-center justify-between py-4">
          <div>
            <h2 className="font-semibold text-gray-800">Event & Meeting</h2>
            <p className="text-sm text-gray-500">
              Get alert when there is an upcoming meeting <br />
              Get alert when there is an upcoming school event
            </p>
          </div>
          <button
            onClick={() => toggleSetting("event")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              settings.event ? "bg-orange-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.event ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;

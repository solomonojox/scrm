import React, { useState } from "react";
import { student } from "../../../../constants/StudentCbtConstant";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";


interface FormState {
  name: string;
  email: string;
  phone: string;
  dept: string;
  notifExam: boolean;
  notifResult: boolean;
  notifSystem: boolean;
}

const StudentCbtSettingsPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: student.name,
    email: "amara.okafor@university.edu",
    phone: "+234 801 234 5678",
    dept: student.dept,
    notifExam: true,
    notifResult: true,
    notifSystem: false,
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const textFields: [string, keyof FormState, string][] = [
    ["Full Name", "name", "text"],
    ["Email Address", "email", "email"],
    ["Phone Number", "phone", "tel"],
    ["Department", "dept", "text"],
  ];

  const toggleFields: [keyof FormState, string, string][] = [
    ["notifExam", "Exam Reminders", "Get notified about upcoming exams"],
    ["notifResult", "Result Alerts", "Be alerted when results are published"],
    ["notifSystem", "System Updates", "Receive platform and maintenance notices"],
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Avatar Card */}
      <Card cls="p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-200">
            {student.avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{form.name}</h2>
            <p className="text-gray-500">
              {form.dept} · {student.level}
            </p>
            <p className="text-sm text-gray-400">{student.id}</p>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card cls="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          {textFields.map(([label, key, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
              </label>
              <input
                type={type}
                value={form[key] as string}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-orange-400 focus:outline-none text-sm text-gray-900 transition-colors bg-gray-50 focus:bg-white"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card cls="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {toggleFields.map(([key, label, desc]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative shrink-0 ${
                  form[key] ? "bg-orange-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                    form[key] ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card cls="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Security</h3>
        <div className="space-y-3">
          {["Current Password", "New Password", "Confirm New Password"].map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-orange-400 focus:outline-none text-sm transition-colors bg-gray-50 focus:bg-white"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Btn variant="primary" size="lg" onClick={save} cls="flex-1 justify-center">
          {saved ? "✓ Saved!" : "Save Changes"}
        </Btn>
        <Btn variant="danger" size="lg">
          Logout
        </Btn>
      </div>
    </div>
  );
};

export default StudentCbtSettingsPage;
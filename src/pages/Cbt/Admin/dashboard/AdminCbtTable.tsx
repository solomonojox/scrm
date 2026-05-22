import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Store/store";

type Tab = "students" | "teachers" | "examiners";

function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
      style={{ background: `hsl(${hue},65%,52%)` }}
    >
      {initials}
    </div>
  );
}

const AdminCbtTable = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("students");
  const [search, setSearch] = useState("");

  const students = useSelector((state: RootState) => state.getAdminCbtStudents.listRecords) ?? [];
  const teachers = useSelector((state: RootState) => state.getAdminCbtTeachers.listRecords) ?? [];
  const examiners = useSelector((state: RootState) => state.getAdminCbtExaminers.listRecords) ?? [];

  const filteredStudents = students.filter((s) =>
    `${s.firstname} ${s.lastname}`.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredTeachers = teachers.filter((t) =>
    `${t.firstname} ${t.lastname} ${t.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredExaminers = examiners.filter((e) =>
    `${e.fullname} ${e.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "students", label: "Students", count: students.length },
    { id: "teachers", label: "Teachers", count: teachers.length },
    { id: "examiners", label: "Examiners", count: examiners.length },
  ];

  const handleViewAll = () => {
    if (tab === "students") {
      navigate("/cbt/admin/students");
    } else if (tab === "teachers") {
      navigate("/cbt/admin/teachers");
    } else {
      navigate("/cbt/admin/examiners");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      {/* ── Card header ── */}
      <div className="border-b border-gray-100 px-5 pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Directory</p>
            <p className="mt-0.5 text-base font-bold text-gray-900">Users</p>
          </div>

          {/* Search */}
          <div className="relative w-44">
            <i
              className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              style={{ fontSize: 14 }}
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-xs placeholder-gray-300 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1">
          {tabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setSearch("");
              }}
              className={`relative flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition-colors
                ${
                  tab === id
                    ? "bg-orange-50 text-orange-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-bold
                ${tab === id ? "bg-orange-200 text-orange-800" : "bg-gray-100 text-gray-500"}`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        {tab === "students" ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Student", "Admission", "Term"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredStudents.slice(0, 6).map((s, i) => (
                <tr key={i} className="group transition-colors hover:bg-orange-50/30">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={`${s.firstname} ${s.lastname}`} />

                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors text-sm">
                          {s.firstname} {s.lastname}
                        </p>

                        {s.studentNo && (
                          <p className="font-mono text-xs text-gray-400">{s.studentNo}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-xs text-gray-400">{s.studentNo || "—"}</td>

                  <td className="px-5 py-3.5">
                    {s.currentTerm ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                        {s.currentTerm}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-sm text-gray-400">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : tab === "teachers" ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Teacher", "Email", "Phone"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredTeachers.slice(0, 6).map((t, i) => (
                <tr key={i} className="group transition-colors hover:bg-orange-50/30">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={`${t.firstname} ${t.lastname}`} />

                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors text-sm">
                          {t.firstname} {t.lastname}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-xs text-gray-500">{t.email}</td>

                  <td className="px-5 py-3.5 text-xs text-gray-500">{t.phone}</td>
                </tr>
              ))}

              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-sm text-gray-400">
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Examiner", "Email"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredExaminers.slice(0, 6).map((e, i) => (
                <tr key={i} className="group transition-colors hover:bg-orange-50/30">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={e.fullname} />

                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors text-sm">
                          {e.fullname}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-xs text-gray-500">{e.email}</td>
                </tr>
              ))}

              {filteredExaminers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center text-sm text-gray-400">
                    No examiners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <p className="text-xs text-gray-400">
          Showing{" "}
          {tab === "students"
            ? Math.min(filteredStudents.length, 6)
            : Math.min(filteredTeachers.length, 6)}{" "}
          of {tab === "students" ? students.length : teachers.length} {tab}
        </p>
        <button
          onClick={handleViewAll}
          className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-orange-200 transition-all hover:bg-orange-600 hover:-translate-y-px hover:shadow-md active:scale-95"
        >
          View all
          <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default AdminCbtTable;

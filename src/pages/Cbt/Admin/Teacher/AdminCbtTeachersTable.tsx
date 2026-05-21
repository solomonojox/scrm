import {
  Btn,
} from "../../../../components/ui/CbtSharedComponents";

import { Icons } from "../../../../assets/icons/Icon";

import { Teacher } from "./AdminCbtTeachersPage";

interface Props {
  teachers: Teacher[];

  onEdit: (teacher: Teacher) => void;

  onDelete: (id: string) => void;
}

export default function AdminCbtTeachersTable({
  teachers,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-100">
              {[
                "Teacher",
                "Email",
                "Phone",
                "State",
                "Employment Date",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className={`border-b border-gray-50 transition-colors hover:bg-orange-50/30 ${
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50/30"
                }`}
              >
                {/* Teacher */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 text-sm font-black text-white shadow-sm">
                      {teacher.firstname[0]}
                      {teacher.lastname[0]}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {teacher.firstname}{" "}
                        {teacher.lastname}
                      </p>

                      <p className="text-xs text-gray-500">
                        @{teacher.username}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-4 text-gray-600">
                  {teacher.email}
                </td>

                {/* Phone */}
                <td className="px-5 py-4 text-gray-600">
                  {teacher.phone || "—"}
                </td>

                {/* State */}
                <td className="px-5 py-4 text-gray-600">
                  {teacher.stateOfOrigin ||
                    "—"}
                </td>

                {/* Employment Date */}
                <td className="px-5 py-4 text-gray-600">
                  {teacher.employmentDate ||
                    "—"}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onEdit(teacher)
                      }
                    >
                      <Icons.Edit />
                    </Btn>

                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onDelete(teacher.email)
                      }
                      className="text-red-400 hover:text-red-600"
                    >
                      <Icons.Trash />
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-14 text-center text-gray-400"
                >
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tablet Table */}
      <div className="hidden overflow-x-auto md:block lg:hidden">
        <table className="w-full min-w-175 text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-100">
              {[
                "Teacher",
                "Phone",
                "State",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className={`border-b border-gray-50 transition-colors hover:bg-orange-50/30 ${
                  index % 2 === 0
                    ? ""
                    : "bg-gray-50/30"
                }`}
              >
                {/* Teacher */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 text-xs font-black text-white">
                      {teacher.firstname[0]}
                      {teacher.lastname[0]}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {teacher.firstname}{" "}
                        {teacher.lastname}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {teacher.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-4 py-4 text-gray-600">
                  {teacher.phone || "—"}
                </td>

                {/* State */}
                <td className="px-4 py-4 text-gray-600">
                  {teacher.stateOfOrigin ||
                    "—"}
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onEdit(teacher)
                      }
                    >
                      <Icons.Edit />
                    </Btn>

                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onDelete(teacher.email)
                      }
                      className="text-red-400 hover:text-red-600"
                    >
                      <Icons.Trash />
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-14 text-center text-gray-400"
                >
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 p-4 md:hidden">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 text-sm font-black text-white">
                {teacher.firstname[0]}
                {teacher.lastname[0]}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-gray-900">
                  {teacher.firstname}{" "}
                  {teacher.lastname}
                </h3>

                <p className="truncate text-sm text-gray-500">
                  {teacher.email}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {teacher.phone || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  State
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {teacher.stateOfOrigin ||
                    "—"}
                </p>
              </div>

              <div className="col-span-2 rounded-xl bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Employment Date
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {teacher.employmentDate ||
                    "—"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
              <Btn
                size="sm"
                variant="ghost"
                onClick={() =>
                  onEdit(teacher)
                }
              >
                <Icons.Edit />
              </Btn>

              <Btn
                size="sm"
                variant="ghost"
                onClick={() =>
                  onDelete(teacher.email)
                }
                className="text-red-400 hover:text-red-600"
              >
                <Icons.Trash />
              </Btn>
            </div>
          </div>
        ))}

        {teachers.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-400">
            No teachers found
          </div>
        )}
      </div>
    </div>
  );
}
// components/StudentPromotionUI.tsx
import React from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Search,
  CheckSquare,
  ArrowRightCircle,
  ChevronRight,
} from "lucide-react";
import { ClassPromotion, StudentPromotionType } from "./student-promotion-type";
import { classrooms, StudentRecord } from "../../../../Types/classroomTypes";

// ─── Avatar ────────────────────────────────────────────────────────────────────
const Avatar: React.FC<{ firstname: string; size?: "sm" | "md" }> = ({ firstname, size = "sm" }) => {
  const initials = firstname.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  const color = colors[firstname.charCodeAt(0) % colors.length];
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <span className={`${sz} ${color} rounded-full flex items-center justify-center font-semibold shrink-0`}>
      {initials}
    </span>
  );
};

// ─── Stats Cards ──────────────────────────────────────────────────────────────
interface StatsCardProps {
  label: string;
  value: number;
  icon: any;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  </div>
);

// ─── Class Selectors ──────────────────────────────────────────────────────────
interface ClassSelectorProps {
  fromClassId: string;
  toClassId: string;
  classes: classrooms[];
  classData: Record<string, StudentPromotionType[]>;
  onFromChange: (id: string) => void;
  onToChange: (id: string) => void;
  canPromote: string | boolean;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  fromClassId,
  toClassId,
  classes,
  classData,
  onFromChange,
  onToChange,
  canPromote,
}) => {
  const fromClass = classes.find((c) => c.id === fromClassId);
  const toClass = classes.find((c) => c.id === toClassId);

  return (
    <div className="px-6 py-5 border-b border-border grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
          From Class (Source)
        </label>
        <select
          value={fromClassId}
          onChange={(e) => onFromChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
        >
          <option value="">— Select source class —</option>
          {classes.map((c) => (
            <option key={c.classroomId} value={c.classroomId}>
              {c.name}
              {/* ({classData[c.classroomId]?.length ?? 0} students) */}
            </option>
          ))}
        </select>
        {fromClass && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Class teacher: <span className="font-medium text-foreground">{fromClass.teacher}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 pt-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed border-border">
          <ArrowRightCircle className={`w-5 h-5 transition-colors ${canPromote ? "text-amber-500" : "text-muted-foreground/40"}`} />
        </div>
        <span className="text-xs text-muted-foreground">to</span>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
          To Class (Destination)
        </label>
        <select
          value={toClassId}
          onChange={(e) => onToChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
        >
          <option value="">— Select destination class —</option>
          {classes.filter((c) => c.classroomId !== fromClassId).map((c) => (
            <option key={c.classroomId} value={c.classroomId}>
              {c.name}
              {/* ({classData[c.classroomId]?.length ?? 0} students) */}
            </option>
          ))}
        </select>
        {toClass && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Class teacher: <span className="font-medium text-foreground">{toClass.teacher}</span>
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Student List ─────────────────────────────────────────────────────────────
interface StudentListProps {
  students?: StudentRecord[];
  filteredStudents: StudentRecord[];
  selectedIds: Set<string>;
  search: string;
  onSearchChange: (search: string) => void;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  filteredStudents,
  selectedIds,
  search,
  onSearchChange,
  onToggleAll,
  onToggleOne,
}) => {
  const allSelected = filteredStudents.length > 0 && filteredStudents.every((s) => selectedIds.has(s.studentId));
  const someSelected = filteredStudents.some((s) => selectedIds.has(s.studentId));

  return (
    <>
      <div className="px-6 py-3 flex items-center gap-3 border-b border-border bg-background/50">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div
            onClick={onToggleAll}
            className={`w-4.5 h-4.5 rounded flex items-center justify-center border-2 cursor-pointer transition-colors ${allSelected ? "border-transparent" : someSelected ? "border-primary/60" : "border-border"
              }`}
            style={allSelected ? { background: "#1e3a5f" } : someSelected ? { background: "#1e3a5f22" } : {}}
          >
            {allSelected && <CheckSquare className="w-3 h-3 text-white" strokeWidth={3} />}
            {someSelected && !allSelected && <div className="w-2 h-0.5 rounded" style={{ background: "#1e3a5f" }} />}
          </div>
          <span className="text-sm font-medium text-foreground">{allSelected ? "Deselect all" : "Select all"}</span>
          <span className="text-xs text-muted-foreground font-normal">
            ({filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""})
          </span>
        </label>
        <div className="ml-auto flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 w-56">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-sm bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>

      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            {search ? "No students match your search." : "No students in this class."}
          </div>
        ) : (
          filteredStudents.map((student) => {
            const checked = selectedIds.has(student.studentId);
            return (
              <label
                key={student.studentId}
                className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-colors hover:bg-muted/60 ${checked ? "bg-blue-50/60" : ""
                  }`}
              >
                <div
                  onClick={() => onToggleOne(student.studentId)}
                  className={`w-4.5 h-4.5 rounded flex items-center justify-center border-2 shrink-0 transition-colors ${checked ? "border-transparent" : "border-border"
                    }`}
                  style={checked ? { background: "#1e3a5f" } : {}}
                >
                  {checked && <CheckSquare className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <Avatar firstname={student.firstname!} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{student?.firstname} {student?.lastname}</p>
                  {/* <p className="text-xs text-muted-foreground">Guardian: {student?.guardianName}</p> */}
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${student.gender === "F" ? "bg-pink-50 text-pink-600" : "bg-sky-50 text-sky-600"
                    }`}>
                    {student.gender === "F" ? "Female" : "Male"}
                  </span>
                </div>
              </label>
            );
          })
        )}
      </div>
    </>
  );
};

// ─── Promotion Actions ──────────────────────────────────────────────────────
interface PromotionActionsProps {
  selectedIds: Set<string>;
  toClassName?: string;
  canPromote: string | boolean;
  onClear: () => void;
  onPromote: () => void;
}

export const PromotionActions: React.FC<PromotionActionsProps> = ({
  selectedIds,
  toClassName,
  canPromote,
  onClear,
  onPromote,
}) => {
  const count = selectedIds.size;

  return (
    <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-muted-foreground">
        {count > 0 ? (
          <>
            <span className="font-semibold text-foreground">{count}</span> student{count !== 1 ? "s" : ""} selected
            {canPromote && toClassName && (
              <> → will be moved to <span className="font-semibold text-foreground underline">{toClassName}</span></>
            )}
          </>
        ) : (
          "Select students to promote"
        )}
      </p>
      <div className="flex items-center gap-3">
        {count > 0 && (
          <button onClick={onClear} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Clear selection
          </button>
        )}
        <button
          disabled={!canPromote}
          onClick={onPromote}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: canPromote ? "#1e3a5f" : undefined }}
        >
          <GraduationCap className="w-4 h-4" />
          Promote {count > 0 ? `${count} ` : ""}Student{count !== 1 ? "s" : ""}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Class Overview ──────────────────────────────────────────────────────────
interface ClassOverviewProps {
  classes: ClassPromotion[];
  classData: Record<string, StudentPromotionType[]>;
  fromClassId: string;
  toClassId: string;
}

export const ClassOverview: React.FC<ClassOverviewProps> = ({
  classes,
  classData,
  fromClassId,
  toClassId,
}) => (
  <div className="mt-6">
    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
      All Classes — Enrolment Overview
    </h3>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {classes.map((c) => {
        const count = classData[c.id]?.length ?? 0;
        const isFrom = c.id === fromClassId;
        const isTo = c.id === toClassId;
        return (
          <div
            key={c.id}
            className={`bg-card rounded-xl border px-4 py-3 transition-all ${isFrom ? "border-primary/40 ring-2 ring-primary/10" : isTo ? "border-amber-400/50 ring-2 ring-amber-100" : "border-border"
              }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-semibold text-foreground">{c.name}</p>
              {isFrom && <span className="text-xs text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">Source</span>}
              {isTo && <span className="text-xs text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">Target</span>}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{c.teacher}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (count / 35) * 100)}%`,
                    background: isFrom ? "#1e3a5f" : isTo ? "#f59e0b" : "#94a3b8",
                  }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">{count}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
      <GraduationCap className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-base font-semibold text-foreground mb-1">Select a Source Class</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Choose the class you want to promote students from. You can then select individual or all students.
    </p>
  </div>
);

import React from "react";
import { Icons } from "../../assets/icons/Icon";

/* =========================
   BADGE
========================= */
interface BadgeProps {
  children: React.ReactNode;
  color?: "orange" | "green" | "blue" | "red" | "gray" | "amber";
  className?: string;
}

export const Badge = ({ children, color = "orange", className = "" }: BadgeProps) => {
  const colors: Record<string, string> = {
    orange: "bg-orange-100 text-orange-700 border border-orange-200",
    green:  "bg-emerald-100 text-emerald-700 border border-emerald-200",
    blue:   "bg-blue-100 text-blue-700 border border-blue-200",
    red:    "bg-red-100 text-red-700 border border-red-200",
    gray:   "bg-gray-100 text-gray-600 border border-gray-200",
    amber:  "bg-amber-100 text-amber-700 border border-amber-200",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

/* =========================
   STAT CARD
========================= */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  color?: "orange" | "amber" | "red" | "yellow";
}

export const StatCard = ({ label, value, icon, sub, color = "orange" }: StatCardProps) => {
  const gradients: Record<string, string> = {
    orange: "from-orange-500 to-orange-600",
    amber:  "from-amber-500 to-orange-500",
    red:    "from-red-500 to-orange-500",
    yellow: "from-yellow-500 to-amber-500",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-orange-100/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-100">
      <div className="absolute inset-0 bg-linear-to-br from-orange-50/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
          <p className="text-3xl font-black tracking-tight text-gray-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${gradients[color]} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

/* =========================
   MODAL
========================= */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, title, children }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-950/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl shadow-gray-900/20"
        style={{ animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.94) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-7 py-5">
          <div>
            <h2 className="text-base font-bold tracking-tight text-gray-900">{title}</h2>
            <div className="mt-0.5 h-0.5 w-8 rounded-full bg-orange-400" />
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
          >
            <Icons.X />
          </button>
        </div>

        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  );
};

/* =========================
   INPUT
========================= */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export const Input = ({ label, required = false, className = "", ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-orange-500">*</span>}
      </label>
      <input
        {...props}
        className={`w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 transition-all duration-200 hover:border-gray-300 hover:bg-white focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-400/10 disabled:opacity-50 ${className}`}
      />
    </div>
  );
};

/* =========================
   SELECT
========================= */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const Select = ({ label, required = false, children, className = "", ...props }: SelectProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
        {label}
        {required && <span className="ml-0.5 text-orange-500">*</span>}
      </label>
      <select
        {...props}
        className={`w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-white focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-400/10 ${className}`}
      >
        {children}
      </select>
    </div>
  );
};

/* =========================
   BUTTON
========================= */
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Btn = ({
  loading,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: BtnProps) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 select-none";

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  const variants: Record<string, string> = {
    primary: "bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-px",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    ghost:   "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    danger:  "border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-200",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled || loading ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <>
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          {children}
        </>
      ) : children}
    </button>
  );
};

/* =========================
   CONFIRM DIALOG
========================= */
interface ConfirmDialogProps {
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export const ConfirmDialog = ({ loading, open, onClose, onConfirm, message }: ConfirmDialogProps) => {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4 rounded-2xl bg-red-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
            <Icons.Trash />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">This action is permanent</p>
            <p className="mt-0.5 text-sm text-gray-500">
              {message || "Are you sure you want to delete this record? This cannot be undone."}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Btn variant="outline" onClick={onClose} disabled={loading}>Cancel</Btn>
          <Btn loading={loading} variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Btn>
        </div>
      </div>
    </Modal>
  );
};
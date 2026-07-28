// components/Modals.tsx
import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  fromClass: string;
  toClass: string;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  fromClass,
  toClass,
  count,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Confirm Promotion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You are about to promote{" "}
              <span className="font-semibold text-foreground">{count} student{count !== 1 ? "s" : ""}</span> from{" "}
              <span className="font-semibold text-foreground">{fromClass}</span> to{" "}
              <span className="font-semibold text-foreground">{toClass}</span>. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ background: "#1e3a5f" }}
          >
            Yes, Promote Students
          </button>
        </div>
      </div>
    </div>
  );
};

interface SuccessBannerProps {
  message: string;
  onDismiss: () => void;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({ message, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white rounded-xl px-4 py-3 shadow-xl max-w-sm">
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onDismiss} className="ml-auto hover:opacity-75 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

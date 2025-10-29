import { X } from "lucide-react";

interface PaymentSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

interface InfoRowProps {
  label: string;
  value: any;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex justify-between py-2">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="text-gray-900">{value ?? "—"}</span>
  </div>
);

const PaymentSlipModal = ({ isOpen, onClose, data }: PaymentSlipModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 relative">
        <div className="bg-orange-500 text-white flex justify-between items-center py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4">
          <h2 className="text-lg font-semibold">Payment Slip</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-gray-600 mb-6">Payroll slip for the selected staff</p>

        <div className="text-center space-y-2 mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Graduation_cap_icon.svg/1024px-Graduation_cap_icon.svg.png"
            alt="Logo"
            className="w-16 h-16 mx-auto"
          />
          <h3 className="text-2xl font-bold text-blue-800">Gold International Academy</h3>
          <p className="text-sm text-gray-600">21, Woodgreen Road Lagos, Nigeria</p>
          <p className="text-xs text-gray-400">Generated on {new Date().toLocaleString()}</p>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <InfoRow label="Staff ID" value={data?.staffId} />
          <InfoRow label="Name" value={data?.name} />
          <InfoRow label="Role" value={data?.role} />
          <InfoRow label="Department" value={data?.department} />
          <InfoRow label="Net Pay" value={data?.netPay} />
          <InfoRow label="Date" value={data?.date} />
          <InfoRow label="Status" value={data?.status} />
        </div>
      </div>
    </div>
  );
};

export default PaymentSlipModal;
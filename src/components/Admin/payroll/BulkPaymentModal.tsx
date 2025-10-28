import { HelpCircle } from "lucide-react";

interface BulkPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const BulkPaymentModal = ({ isOpen, onClose, onProceed }: BulkPaymentModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-[340px] rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <div className="bg-green-100 p-4 rounded-full mb-4 mt-4">
          <HelpCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">Proceed with payment to selected users?</h2>
        <p className="text-gray-500 text-sm text-center mb-6">Continue to payment</p>

        <div className="flex flex-col w-full gap-3">
          <button onClick={() => { onProceed(); onClose(); }} className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition">Proceed</button>
          <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-300 transition">Close</button>
        </div>
      </div>
    </div>
  );
};

export default BulkPaymentModal;
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    label: string
}
const DeleteModal = ({ isOpen, onClose, onConfirm, label = "record" }: DeleteModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[340px] text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h2>
                <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete this {label}? This cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700">Delete</button>
                    <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
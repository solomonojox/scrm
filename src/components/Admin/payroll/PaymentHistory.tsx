import React from 'react'

interface PaymentHistoryProps {
    activeTab: string;
    handleView: (data: any) => void;
    handleEdit: (data: any) => void;
    handleDelete: (data: any) => void;
    handleGeneratePayroll: (data: any) => void;
    data: any;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center p-8">
                {/* Icon */}
                <div className="mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                        <svg 
                            className="w-8 h-8 text-orange-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                    </div>
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                    Payment History
                </h2>
                
                {/* Description */}
                <p className="text-gray-500 mb-6 max-w-md">
                    The payment history feature is currently under development. 
                    We're working hard to bring you a comprehensive view of all payroll transactions.
                </p>
                
                {/* Coming Soon Badge */}
                <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
                    Coming Soon
                </div>
            </div>
        </div>
    )
}

export default PaymentHistory;
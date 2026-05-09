import { DollarSign } from 'lucide-react'
import React from 'react'

const NappsChapterAdminRevenueShare = () => {
    return (
        <div className='rounded-xl border border-green-600 bg-green-50 p-6 space-y-4'>
            <div className="flex gap-4 items-center">
                <DollarSign className='bg-green-600 p-2 rounded-xl text-white' size={40} />
                <div>
                    <p className="text-xl font-semibold">Chapter Revenue Share</p>
                    <p className="text sm text-gray-500">Your chapter receives 20% of expected revenue</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4">
                    <p className="text-gray-500">Expected Revenue</p>
                    <p className="text-lg font-bold">₦475,000</p>
                    <p className="text-gray-500 text-xs">950 students × ₦500</p>
                </div>

                <div className="bg-white rounded-xl p-4">
                    <p className="text-gray-500">Chapter Share (20%)</p>
                    <p className="text-lg font-bold">₦95,000</p>
                    <p className="text-gray-500 text-xs">Per term</p>
                </div>

                <div className="bg-white rounded-xl p-4">
                    <p className="text-gray-500">Per Student Rate</p>
                    <p className="text-lg font-bold">₦500</p>
                    <p className="text-gray-500 text-xs">Per term</p>
                </div>
            </div>
        </div>
    )
}

export default NappsChapterAdminRevenueShare
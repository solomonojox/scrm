import { DollarSign, Dot } from 'lucide-react'
import React from 'react'

const RevenueCards = () => {
    return (
        <div className='grid grid-cols-3 gap-4'>
            <div className="rounded-xl p-4 border shadow-md flex justify-between">
                <div className='space-y-2'>
                    <p className="text-xs text-gray-500">Expected Revenue (Per Term)</p>
                    <p className="text-xl font-bold">₦245K</p>
                    <p className="text-xs text-gray-500">490 students × ₦500</p>
                </div>

                <DollarSign className='text-green-500'/>
            </div>

            <div className="rounded-xl p-4 border shadow-md flex justify-between">
                <div className='space-y-2'>
                    <p className="text-xs text-gray-500">Total Schools</p>
                    <p className="text-xl font-bold">2</p>
                </div>

                <div className='text-blue-600 bg-blue-100 h-6 w-6 rounded-full flex items-center justify-center'>
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                </div>
            </div>

            <div className="rounded-xl p-4 border shadow-md flex justify-between">
                <div className='space-y-2'>
                    <p className="text-xs text-gray-500">Expected Revenue (Per Term)</p>
                    <p className="text-xl font-bold text-orange-500">₦245K</p>
                    <p className="text-xs text-gray-500">490 students × ₦500</p>
                </div>

                <DollarSign className='text-orange-500' />
            </div>
        </div>
    )
}

export default RevenueCards
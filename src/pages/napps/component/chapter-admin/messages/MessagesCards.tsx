import { CircleCheckBig, Clock, DollarSign, Dot, Users } from 'lucide-react'
import React from 'react'

const MessagesCards = () => {
    return (
        <div className='grid grid-cols-3 gap-4'>
            <div className="rounded-xl p-4 border shadow-md flex justify-between">
                <div className='space-y-2'>
                    <p className="text-xs text-gray-500">Expected Revenue (Per Term)</p>
                    <p className="text-xl font-bold">2</p>
                </div>

                <Users className='text-blue-500' />
            </div>

            <div className="rounded-xl p-4 border shadow-md flex justify-between">
                <div className='space-y-2'>
                    <p className="text-xs text-gray-500">Total Schools</p>
                    <p className="text-xl font-bold">2</p>
                </div>

                <CircleCheckBig className='text-green-500' />
            </div>

            <div className="rounded-xl p-4 border shadow-md flex justify-between">
                <div className='space-y-2'>
                    <p className="text-xs text-gray-500">Last Sent</p>
                    <p className="text-sm font-semibold text-orange-500">2024-02-20 10:30 AM</p>
                </div>

                <Clock className='text-orange-500' />
            </div>
        </div>
    )
}

export default MessagesCards
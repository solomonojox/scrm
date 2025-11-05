import { School } from 'lucide-react'
import React from 'react'

const SuperAdminDashboardCards = () => {
    const cardItems = [
        { label: 'Total Schools', value: 17, icon: <School />, color: 'text-blue-600 bg-blue-100' },
        { label: 'Active Schools', value: 15, icon: <School />, color: 'text-green-600 bg-green-100' },
        { label: 'Inactive Schools', value: 2, icon: <School />, color: 'text-red-600 bg-red-100' },
        { label: 'Total Students', value: 10200, icon: <School />, color: 'text-purple-600 bg-purple-100' },
    ]

    const formatAmount = (amt: number) =>
        amt
            // .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full ">
            {cardItems.map((item, i) => (
                <div key={i} className="rounded-xl p-6 flex justify-between border">
                    <div>
                        <p className="text-xl font-bold">{formatAmount(item.value || 0)}</p>
                        <p className="text-gray-500 text-sm">{item.label}</p>
                    </div>

                    <div className={`text-3xl ${item.color} h-10 w-10 rounded-2xl flex items-center justify-center`}>
                        <School />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SuperAdminDashboardCards
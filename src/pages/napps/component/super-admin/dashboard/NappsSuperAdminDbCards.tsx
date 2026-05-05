import { DollarSign, Home, House, School, TrendingUp } from 'lucide-react'
import React from 'react'

const NappsSuperAdminDbCards = () => {
    const data = [
        {
            label: 'Active Chapter',
            value: 3,
            icon: Home,
            color: 'bg-blue-100 text-blue-700'
        },
        {
            label: 'Total Schools',
            value: 6,
            icon: School,
            color: 'bg-green-100 text-green-700'
        },
        {
            label: 'Total Students',
            value: 1590,
            icon: TrendingUp,
            color: 'bg-purple-100 text-purple-700'
        },
        {
            label: 'Expected Revenue (Per Term)',
            value: 1590,
            icon: DollarSign,
            color: 'bg-indigo-100 text-indigo-700'
        },
    ]
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {data.map((item, index) => (
                <div className="border rounded-xl p-4 bg-white shadow-lg space-y-4">
                    <item.icon className={`p-2 rounded-xl ${item.color}`} size={40} />
                    <p className='text-2xl font-bold'>{item.label.includes('Expected') ? '₦' : ''}{item.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                </div>
            ))}
        </div>
    )
}

export default NappsSuperAdminDbCards
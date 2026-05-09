import { DollarSign, Home, House, School, TrendingUp } from 'lucide-react'
import React from 'react'

const NappsChapterAdminDbCards = () => {
    const data = [
        {
            label: 'Total Schools',
            value: 3,
            icon: School,
            color: 'bg-blue-100 text-blue-700'
        },
        {
            label: 'Total Schools',
            value: 950,
            icon: TrendingUp,
            color: 'bg-green-100 text-green-700'
        },
        {
            label: 'Expected Revenue (Per Term)',
            value: '475K',
            icon: DollarSign,
            color: 'bg-purple-100 text-purple-700'
        },
        {
            label: 'Your Share (20%)',
            value: '95K',
            icon: DollarSign,
            color: 'bg-green-100 text-green-700'
        },
    ]
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {data.map((item, index) => (
                <div className="border rounded-xl p-4 bg-white shadow-lg space-y-4">
                    <item.icon className={`p-2 rounded-xl ${item.color}`} size={40} />
                    <p className='text-2xl font-bold'>{item.label.includes('Expected') || item.label.includes('Your') ? '₦' : ''}{item.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                </div>
            ))}
        </div>
    )
}

export default NappsChapterAdminDbCards
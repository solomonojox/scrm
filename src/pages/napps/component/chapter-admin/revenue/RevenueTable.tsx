import { Mail, MapPin, Phone, Search } from 'lucide-react';
import React from 'react'

const RevenueTable = () => {
    const schools = [
        {
            name: "Capital Heights Academy",
            admin: "Mrs. Grace Eze",
            students: '280',
            rate: '₦500',
            expected: "₦140,000",
            share: "₦28,000",
        },
        {
            name: "Royal Academy",
            admin: "Mrs. Funmi Adeyemi",
            students: '210',
            rate: '₦600',
            expected: "₦105,000",
            share: "₦21,000",
        }
    ];

    return (
        <div className='space-y-4'>
            <div className="rounded-2xl shadow-sm p-4 bg-white border space-y-4">
                <div className='relative'>
                    <input type="text" className="w-full rounded-lg p-2 border pl-10 focus:outline-none" placeholder='Search chapters by name or state...' />
                    <Search className='absolute text-gray-300 top-2.5 left-2.5' />
                </div>
            </div>

            <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    {/* Table Header */}
                    <thead>
                        <tr className="border-b border-gray-100 text-sm font-medium text-gray-500">
                            <th className="px-6 py-4">School</th>
                            <th className="px-6 py-4">Students</th>
                            <th className="px-6 py-4">Rate</th>
                            <th className="px-6 py-4">Expected Amount</th>
                            <th className="px-6 py-4">Chapter Share (20%)</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-100">
                        {schools.map((school, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                {/* School Name & Admin */}
                                <td className="px-6 py-5">
                                    <div className="font-semibold text-gray-900">{school.name}</div>
                                    <div className="text-sm text-gray-400">{school.admin}</div>
                                </td>

                                {/* Students */}
                                <td className="px-6 py-5">
                                    <div className="font-medium text-gray-900">{school.students}</div>
                                </td>

                                {/* Rate */}
                                <td className="px-6 py-5">
                                    <p className='font-medium'>{school.rate}</p>
                                    <p className='text-xs text-gray-500'>per student/term</p>
                                </td>

                                {/* Expected amount */}
                                <td className="px-6 py-5">
                                    <p className='font-medium'>{school.expected}</p>
                                    <p className='text-xs text-gray-500'>per term</p>
                                </td>

                                {/* Share */}
                                <td className="px-6 py-5">
                                    <p className='font-medium text-green-600'>{school.share}</p>
                                    <p className='text-xs text-gray-500'>per term</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RevenueTable
import { GraduationCap, MoveLeft, Shield, UserCog, Users } from 'lucide-react'
import React from 'react'
import SuperAdminHeader from './SuperAdminHeader'

const SchoolInfoPage = () => {
    const cardItems = [
        { label: 'Students', value: 450, icon: <GraduationCap />, color: 'text-blue-600 bg-blue-100' },
        { label: 'Teachers', value: 25, icon: <Users />, color: 'text-green-600 bg-green-100' },
        { label: 'School Admins', value: 3, icon: <Shield />, color: 'text-purple-600 bg-purple-100' },
        { label: 'Guardians', value: 10200, icon: <UserCog />, color: 'text-orange-600 bg-orange-100' },
        { label: 'Total Accounts', value: 868, icon: <Users />, color: 'text-white bg-blue-800' },
    ]

    const formatAmount = (amt: number) =>
        amt
            // .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
        <div>
            <div className="sticky top-0">
                <SuperAdminHeader />
            </div>

            <div className='mt-6 px-4 md:px-10 space-y-6'>
                <button className="px-4 py-2 flex items-center border rounded-xl hover:text-blue-600 gap-4" onClick={() => window.history.back()}>
                    <MoveLeft />
                    Back to Schools
                </button>

                <div className="border p-6 rounded-xl">
                    <div className="flex items-center">
                        <p>Greenfield International School</p>
                        <span className={`bg-green-100 text-green-600 px-2 py-1 rounded-md ml-2`}>Active</span>
                    </div>

                    <p>Lagos, Nigeria</p>
                    <p className="text-gray-500">Registered on January 15, 2024</p>
                </div>

                <div>
                    <p>User Statistics</p>

                    <div className="grid grid-cols-1 lg:grid-cols-5 mt-4 gap-4">
                        {cardItems.map((item, i) => (
                            <div key={i} className="rounded-xl p-6 border space-y-4">
                                <div className={`rounded-xl h-10 w-10 ${item.color} p-2`}>
                                    {item.icon}
                                </div>

                                <p className="text-gray-500 text-sm">{item.label}</p>

                                <p>{formatAmount(item.value || 0)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SchoolInfoPage
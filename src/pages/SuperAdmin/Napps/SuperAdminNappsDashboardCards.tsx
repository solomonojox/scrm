import { School } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { superAdminService } from '../../../Services/superAdmin';
import { useAuth } from '../../../Context/Auth/useAuth';

const SuperAdminNappsDashboardCards = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        totalChapters: 0,
        activeChapters: 0,
        inactiveChapters: 0,
        totalSchools: 0
    });
    const getAllSchools = async () => {
        try {
            const res = await superAdminService.getNappsDashboardStat();
            setDashboardData(res)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            getAllSchools();
        }
    }, [user])

    const cardItems = [
        { label: 'Total Chapters', value: dashboardData?.totalChapters, icon: <School />, color: 'text-blue-600 bg-blue-100' },
        { label: 'Active Chapters', value: dashboardData?.activeChapters, icon: <School />, color: 'text-green-600 bg-green-100' },
        { label: 'Inactive Chapters', value: dashboardData?.inactiveChapters, icon: <School />, color: 'text-red-600 bg-red-100' },
        { label: 'Total Schools', value: dashboardData?.totalSchools, icon: <School />, color: 'text-purple-600 bg-purple-100' },
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

export default SuperAdminNappsDashboardCards
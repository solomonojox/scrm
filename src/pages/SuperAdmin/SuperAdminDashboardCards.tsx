import { School } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { superAdminService } from '../../Services/superAdmin';
import { useAuth } from '../../Context/Auth/useAuth';

const SuperAdminDashboardCards = () => {
    const { user } = useAuth();
    const [totalSchools, setTotalSchools] = useState<number>(0);
    const [totalActiveSchools, setTotalActiveSchools] = useState<number>(0);
    const [totalInActiveSchools, setTotalInActiveSchools] = useState<number>(0);
    const [totalStudents, setTotalStudents] = useState<number>(0);
    const [allSchools, setAllSchools] = useState<any[]>([]);
    const getAllSchools = async () => {
        try {
            const res = await superAdminService.getAllSchools();
            setTotalSchools(res.data.length);
            setAllSchools(res.data);

            const totalStudents = await superAdminService.getTotalStudents();
            setTotalStudents(totalStudents);

            const activeSchools = res.data.filter((school: any) => school.approvalStatus === 1);
            const inActiveSchools = res.data.filter((school: any) => school.approvalStatus !== 1);
            setTotalActiveSchools(activeSchools.length);
            setTotalInActiveSchools(inActiveSchools.length);
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
        { label: 'Total Schools', value: totalSchools, icon: <School />, color: 'text-blue-600 bg-blue-100' },
        { label: 'Active Schools', value: totalActiveSchools, icon: <School />, color: 'text-green-600 bg-green-100' },
        { label: 'Inactive Schools', value: totalInActiveSchools, icon: <School />, color: 'text-red-600 bg-red-100' },
        { label: 'Total Students', value: totalStudents, icon: <School />, color: 'text-purple-600 bg-purple-100' },
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
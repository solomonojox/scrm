import React from 'react'
import NappsSuperAdminDbCards from '../component/super-admin/dashboard/NappsSuperAdminDbCards'
import RevenueChart from '../component/super-admin/dashboard/RevenueChart'
import { ChapterPerformance } from '../component/super-admin/dashboard/ChapterPerformance'
import { PricingModel } from '../component/super-admin/dashboard/PricingModel'

const NappsSuperAdminDashboard = () => {
    return (
        <div className='min-h-screen space-y-6'>
            <div>
                <p className="font-bold text-2xl">Welcome, EduCat Admin</p>
                <p className="text-gray-500">Super Admin Dashboard - National Overview</p>
            </div>
            <NappsSuperAdminDbCards />

            <RevenueChart />

            <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChapterPerformance />
                <PricingModel />
            </div>
        </div>
    )
}

export default NappsSuperAdminDashboard
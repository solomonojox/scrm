import React from 'react'
import { ChapterPerformance } from '../component/super-admin/dashboard/ChapterPerformance'
import { PricingModel } from '../component/super-admin/dashboard/PricingModel'
import NappsChapterAdminDbCards from '../component/chapter-admin/dashboard/NappsChapterAdminDbCards'
import NappsChapterAdminRevenueShare from '../component/chapter-admin/dashboard/NappsChapterAdminRevenueShare'
import SchoolsInYourChapter from '../component/chapter-admin/dashboard/SchoolsInYourChapter'
import NappsChapterAdminCTA from '../component/chapter-admin/dashboard/NappsChapterAdminCTA'

const NappsChapterAdminDashboard = () => {
    return (
        <div className='min-h-screen space-y-6'>
            <div>
                <p className="font-bold text-2xl">Welcome, EduCat Admin</p>
                <p className="text-gray-500">Super Admin Dashboard - National Overview</p>
            </div>

            <NappsChapterAdminDbCards />

            <NappsChapterAdminRevenueShare />

            <SchoolsInYourChapter />

            <NappsChapterAdminCTA />
        </div>
    )
}

export default NappsChapterAdminDashboard
import React from 'react'
import RevenueTable from '../component/chapter-admin/revenue/RevenueTable'
import RevenueCards from '../component/chapter-admin/revenue/RevenueCards'

const NappsChapterAdminRevenue = () => {
    return (
        <div className='space-y-4'>
            <div>
                <p className="font-bold text-2xl">Revenue Overview</p>
                <p className="text-gray-500">Expected revenue based on student enrollment</p>
            </div>

            <RevenueCards />

            <RevenueTable />
        </div>
    )
}

export default NappsChapterAdminRevenue
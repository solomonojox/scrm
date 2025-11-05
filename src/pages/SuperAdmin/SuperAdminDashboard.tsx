import React from 'react'
import SuperAdminHeader from './SuperAdminHeader'
import SchoolList from './SchoolList'
import SuperAdminDashboardCards from './SuperAdminDashboardCards'

const SuperAdminDashboard = () => {
    return (
        <div>
            <div className="sticky top-0">
                <SuperAdminHeader />
            </div>

            <div className='mt-6 px-4 md:px-10'>
                <SuperAdminDashboardCards />
                <SchoolList />
            </div>
        </div>
    )
}

export default SuperAdminDashboard
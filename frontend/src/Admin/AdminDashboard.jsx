import React from 'react';
import StudyStatisticsChart from './DashboardComponents/StudyStatisticsChart';
import ProgressChart from './DashboardComponents/ProgressChart';
import StudentOverview from './DashboardComponents/StudentOverview';
import UpcomingClasses from './DashboardComponents/UpcommingClasses';
import NavbarDashboard from './NavbarDashboard';

const AdminDashboard = () => {
    return (
        <div>
            <NavbarDashboard />
            <div className="flex items-center px-20 bg-gray-900">
                <div className='w-3/4'>
                    <StudentOverview />
                </div>
                <div className='w-1/4'>
                    <ProgressChart />
                </div>
            </div>

            <div className='flex gap-4 px-20 bg-gray-50 w-full'>
                <StudyStatisticsChart />
                <UpcomingClasses />

            </div>
        </div>
    )
}

export default AdminDashboard
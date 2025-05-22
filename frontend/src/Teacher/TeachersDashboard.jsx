import React from 'react';
import ProgressChart from './TeachersComponents/ProgressChart'
import StudentOverview from './TeachersComponents/StudentOverview';
import TaskProgressCard from './TeachersComponents/TaskProgressCard';
import AssignmentsCard from "./TeachersComponents/AssignmentsCard";
import ProjectProgressCard from "./TeachersComponents/ProjectProgressCard";
import CalendarCard from "./TeachersComponents/CalendarCard";

import NavbarDashboard from './TeacherNavbarDashboard';

const TeachersDashboard = () => {
    // console.log(JSON.parse(localStorage.getItem('teacherData')));
    return (
        <div>
            <div className="sticky-top-0">
                <NavbarDashboard />
            </div>
            <div className="flex items-center px-20 bg-gray-900">
                <div className='w-3/4'>
                    <StudentOverview />
                </div>
                <div className='w-1/4'>
                    <ProgressChart />
                </div>
            </div>

            <div className="flex flex-col gap-8 m-8">
                {/* Top row */}
                <div className="flex flex-col md:flex-row gap-8">
                    <TaskProgressCard />
                    <AssignmentsCard />
                </div>

                {/* Bottom row */}
                <div className="flex flex-col md:flex-row gap-8">
                    <ProjectProgressCard />
                    <CalendarCard />
                </div>
            </div>
        </div>
    )
}

export default TeachersDashboard
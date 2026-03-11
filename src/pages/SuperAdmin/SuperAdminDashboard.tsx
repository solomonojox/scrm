import React, { useState } from 'react'
import SuperAdminHeader from './SuperAdminHeader'
import SchoolList from './SchoolList'
import SuperAdminDashboardCards from './SuperAdminDashboardCards'
import { useAuth } from '../../Context/Auth/useAuth'
import NappList from './Napps/NappList'
import SuperAdminNappsDashboardCards from './Napps/SuperAdminNappsDashboardCards'

const SuperAdminDashboard = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('School Management');
    // console.log(user)

    const tabs = [
        { name: 'School Management', content: 'School Management' },
        { name: 'NAPPS Chapters', content: 'NAPPS Chapters' },
    ]
    return (
        <div>
            <div className="sticky top-0">
                <SuperAdminHeader />
            </div>

            <div className='mt-6 px-4 md:px-10'>
                <div className="flex gap-2 rounded-full p-1 bg-gray-100 my-6 w-88">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`px-4 py-3 rounded-full font-medium hover:bg-white transition-all ${activeTab === tab.name ? 'bg-white' : ''
                                }`}
                            onClick={() => setActiveTab(tab.name)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                {activeTab === 'School Management' && (
                    <>
                        <SuperAdminDashboardCards />
                        <SchoolList />
                    </>
                )}

                {activeTab === 'NAPPS Chapters' && (
                    <>
                        <SuperAdminNappsDashboardCards />
                        <NappList />
                    </>
                )}

            </div>
        </div>
    )
}

export default SuperAdminDashboard
import React from 'react'

const AdminSidebar = () => {
    return (
        <div>
            <nav className="w-48 bg-white border-r border-gray-200 flex flex-col px-4 py-6 space-y-4">
                <SidebarButton icon={<FaThLarge />} active label="Dashboard" />
                <SidebarButton icon={<FaUserGraduate />} label="Students" />
                <SidebarButton icon={<FaChalkboardTeacher />} label="Teachers" />
                <SidebarButton icon={<FaUserFriends />} label="Guardian" />
                <SidebarButton icon={<FaBook />} label="Classroom" />
                <SidebarButton icon={<FaNewspaper />} label="News" />
                <SidebarButton icon={<FaCalendarAlt />} label="Events" />
                <SidebarButton icon={<FaChalkboard />} label="Session" />
                <SidebarButton icon={<FaFileInvoiceDollar />} label="School Fee" />
                <button className="mt-auto bg-red-100 text-red-600 text-xs font-semibold py-2 rounded hover:bg-red-200 transition">Log Out</button>
            </nav>
        </div>
    )
}

export default AdminSidebar
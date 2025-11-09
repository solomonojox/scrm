import { GraduationCap, LogOut } from 'lucide-react'
import React from 'react'
import { useAuth } from '../../Context/Auth/useAuth'
import { useNavigate } from 'react-router-dom'

const SuperAdminHeader = () => {
    const { logout, user } = useAuth()
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/super-admin/login');
        logout();
    }

    return (
        <div className="flex items-center justify-between px-4 md:px-10 h-[70px] border-b border-gray-200 z-50 bg-white">
            <div className="flex gap-4 items-center">
                <div className="rounded-xl bg-blue-600 p-2 flex items-center justify-center">
                    <GraduationCap className='text-white' size={30} />
                </div>
                <div className='hidden md:block'>
                    <p>Educat Admin Dashboard</p>
                    <p className='text-gray-500 text-xs'>Manage schools, users, and educational services</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-end">
                    <p className='text-xs'>Logged in as</p>
                    <p className='text-gray-500 text-sm font-medium'>{user?.email}</p>
                </div>

                <button className='flex items-center gap-2 text-sm font-medium hover:text-red-600 border rounded-lg p-2' onClick={handleLogout}>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default SuperAdminHeader
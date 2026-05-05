import { Edit, Mail, MapPin, Phone, Plus, Power, Search } from 'lucide-react'
import React from 'react'
import SchoolTable from '../component/super-admin/schools/SchoolTable'

const NappsSuperAdminSchool = () => {
    return (
        <div className='space-y-6'>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-2xl font-bold">Schools</p>
                    <p className="text-gray-500 text-sm">Manage state schools across chapters</p>
                </div>

                <button className="px-6 py-2 rounded-lg flex gap-2 items-center justify-center bg-indigo-700 hover:bg-indigo-500 text-white">
                    <Plus />
                    Add School
                </button>
            </div>

            <div className="rounded-2xl shadow-sm p-4 bg-white border space-y-4">
                <div className='relative'>
                    <input type="text" className="w-full rounded-lg p-2 border pl-10 focus:outline-none" placeholder='Search chapters by name or state...' />
                    <Search className='absolute text-gray-300 top-2.5 left-2.5' />
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    {[1, 2, 3, 4].map(item => (
                        <button className={`rounded-lg bg-indigo-700 py-1 text-white text-sm px-3`}>All Chapters</button>
                    ))}
                </div>
            </div>

            <SchoolTable />
        </div>
    )
}

export default NappsSuperAdminSchool
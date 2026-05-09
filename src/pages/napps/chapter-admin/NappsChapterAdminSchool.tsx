import { Edit, Mail, MapPin, Phone, Plus, Power, Search } from 'lucide-react'
import React from 'react'
import SchoolChapterTable from '../component/chapter-admin/schools/SchoolChapterTable'

const NappsChapterAdminSchool = () => {
    return (
        <div className='space-y-6'>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-2xl font-bold">Schools</p>
                    <p className="text-gray-500 text-sm">View schools in your chapter</p>
                </div>
            </div>

            <div className="rounded-2xl shadow-sm p-4 bg-white border space-y-4">
                <div className='relative'>
                    <input type="text" className="w-full rounded-lg p-2 border pl-10 focus:outline-none" placeholder='Search chapters by name or state...' />
                    <Search className='absolute text-gray-300 top-2.5 left-2.5' />
                </div>
            </div>

            <SchoolChapterTable />
        </div>
    )
}

export default NappsChapterAdminSchool
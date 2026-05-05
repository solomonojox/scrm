import { Edit, Mail, MapPin, Phone, Plus, Power, Search } from 'lucide-react'
import React from 'react'

const NappsSuperAdminChapters = () => {
    return (
        <div className='space-y-6'>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-2xl font-bold">NAPPS Chapters</p>
                    <p className="text-gray-500 text-sm">Manage state chapter and their administrators</p>
                </div>

                <button className="px-6 py-2 rounded-lg flex gap-2 items-center justify-center bg-indigo-700 hover:bg-indigo-500 text-white">
                    <Plus />
                    Create Chapter
                </button>
            </div>

            <div className="rounded-2xl shadow-sm p-4 bg-white border">
                <div className='relative'>
                    <input type="text" className="w-full rounded-lg p-2 border pl-10 focus:outline-none" placeholder='Search chapters by name or state...' />
                    <Search className='absolute text-gray-300 top-2.5 left-2.5'/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4].map(item => (
                    <div className="rounded-xl p-4 border shadow-sm space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-lg">NAPPS Lagos Chapter</p>
                            <span className="rounded-full bg-green-200 text-green-600 font-medium text-xs px-3 py-1">Active</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2 items-center">
                                <MapPin className='text-gray-400' size={18} />
                                <p className="text-xs text-gray-400">Lagos</p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Mail className='text-gray-400' size={16} />
                                <p className="text-xs text-gray-400">lagos@napps.ng</p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Phone className='text-gray-400' size={16} />
                                <p className="text-xs text-gray-400">+234 801 234 5678</p>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gray-200"></div>

                        <p className='text-sm text-gray-400'><span className='font-bold text-sm text-black'>3</span> schools registered</p>

                        <div className="flex justify-center items-center gap-2">
                            <button className='bg-indigo-50 text-indigo-700 flex p-2 rounded-xl w-full items-center justify-center gap-2 font-medium'>
                                <Edit className='text-indigo-700' size={18} />
                                Edit
                            </button>

                            <button className='bg-gray-50 text-indigo-700 flex p-2 rounded-xl w-14 items-center justify-center gap-2 font-medium'>
                                <Power className='text-gray-600' size={18} />
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NappsSuperAdminChapters
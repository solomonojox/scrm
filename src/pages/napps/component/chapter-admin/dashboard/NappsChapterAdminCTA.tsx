import { Download } from 'lucide-react'
import React from 'react'

const NappsChapterAdminCTA = () => {
    return (
        <div className='flex gap-4'>
            <div className="rounded-xl p-4 shadow-md w-full space-y-4">
                <p className="text-xl font-bold">Export Reports</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-center rounded-xl bg-red-50 p-4 gap-4">
                        <Download className='text-red-600' size={25} />
                        <p className="text-lg font-bold text-red-600">Export as PDF</p>
                    </div>

                    <div className="flex items-center justify-center rounded-xl bg-green-50 p-4 gap-4">
                        <Download className='text-green-600' size={25} />
                        <p className="text-lg font-bold text-green-600">Export as Excel</p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-4 shadow-md w-full space-y-4 bg-linear-to-r from-orange-600 to-orange-400">
                <p className="text-xl font-bold text-white">Need Help?</p>
                <p className='text-white'>Contact EduCat support for assistance with chapter management.</p>
                <button className='text-orange-600 text-xl font-medium p-3 rounded-xl bg-white w-full'>Contact Support</button>
            </div>
        </div>
    )
}

export default NappsChapterAdminCTA
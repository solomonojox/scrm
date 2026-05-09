import React from 'react'

const SchoolsInYourChapter = () => {
    return (
        <div className='rounded-xl p-4 border shadow-md space-y-4'>
            <p className="text-xl font-bold">Schools In Your Chapter</p>

            <div className="space-y-2">
                <div className="p-4 bg-gray-50 flex justify-between item-start">
                    <div>
                        <p className="text-lg font-medium">Greenwood International School</p>
                        <p className="text-xs text-gray-400">Mr. Adeola Williams</p>
                        <p className="text-xs text-gray-400">45 Victoria Island, Lagos</p>
                    </div>

                    <div>
                        <p className="text-lg font-medium">450 students</p>
                        <p className="text-xs text-gray-400">Expected: ₦225,000</p>
                        <p className="text-xs text-gray-400">per term</p>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-between item-start">
                    <div>
                        <p className="text-lg font-medium">Royal Academy</p>
                        <p className="text-xs text-gray-400">Mrs. Funmi Adeyemi</p>
                        <p className="text-xs text-gray-400">12 Lekki Phase 1, Lagos</p>
                    </div>

                    <div>
                        <p className="text-lg font-medium">320 students</p>
                        <p className="text-xs text-gray-400">Expected: ₦160,000</p>
                        <p className="text-xs text-gray-400">per term</p>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-between item-start">
                    <div>
                        <p className="text-lg font-medium">Excellence Private School</p>
                        <p className="text-xs text-gray-400">Dr. Emeka Obi</p>
                        <p className="text-xs text-gray-400">78 Ikeja GRA, Lagos</p>
                    </div>

                    <div>
                        <p className="text-lg font-medium">180 students</p>
                        <p className="text-xs text-gray-400">Expected: ₦90,000</p>
                        <p className="text-xs text-gray-400">per term</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SchoolsInYourChapter
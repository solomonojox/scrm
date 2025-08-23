import React from 'react'

const MyPupils = () => {
    return (
        <div>
            <div className="bg-white p-6">
                <div className="flex justify-between">
                    <div className="flex gap-4">
                        <div className="h-52 w-52 rounded-2xl overflow-hidden">
                            <img src="" alt="" className='w-full h-full bg-red-600'/>
                        </div>

                        <div className="space-y-1">
                            <h1 className='text-2xl font-semibold'>Jason Ethan</h1>
                            <p className='text-gray-500'>Class: JSS 1</p>
                            <p className='text-gray-500'>Age: 12 years</p>
                            <p className='text-gray-500'>Current Status: Absent today</p>

                            <button className="rounded-lg py-1 px-6 text-white bg-orange-500">View Profile</button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4 shadow-lg rounded-lg">
                        <div className="space-y-1">
                            <h1 className='text-lg font-semibold'>Fee Balance/Payment Status</h1>
                            <p className='text-gray-700'>First Term School Fees: N20,000</p>
                            <p className='text-green-500'>Amount Paid: N10,000</p>
                            <p className='text-gray-500'>Balance: N10,000</p>
                        </div>

                        <div className="space-y-2">
                            <p className='text-orange-500'>Status</p>

                            <div className="flex gap-2">
                                <button className="bg-green-500 text-white rounded-lg px-6 py-1">Completed</button>
                                <button className="bg-gray-300 text-white rounded-lg px-6 py-1">Pending</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPupils
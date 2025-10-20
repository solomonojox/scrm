import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { byPrefixAndName } from '@awesome.me/kit-KIT_CODE/icons'
import { FaUserGraduate } from 'react-icons/fa'
import { IoMdMan, IoMdWoman } from 'react-icons/io'

const MyPupilCards = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-4 bg-lime-200 space-y-6">
                    <p className="text-lg font-medium">All Pupils</p>

                    <div className="flex justify-between">
                        <p className='text-[30px] font-semibold'>12</p>
                        <FaUserGraduate className='text-5xl text-lime-500' />
                    </div>
                </div>
                <div className="rounded-xl p-4 bg-sky-200 space-y-6">
                    <p className="text-lg font-medium">All Pupils</p>

                    <div className="flex justify-between">
                        <p className='text-[30px] font-semibold'>12</p>
                        <IoMdMan className='text-6xl text-sky-500' />
                    </div>
                </div>
                <div className="rounded-xl p-4 bg-rose-200 space-y-6">
                    <p className="text-lg font-medium">All Pupils</p>

                    <div className="flex justify-between">
                        <p className='text-[30px] font-semibold'>12</p>
                        <IoMdWoman className='text-6xl text-rose-500' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPupilCards
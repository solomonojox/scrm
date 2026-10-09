import React, { useMemo } from 'react'
import { FaUserGraduate } from 'react-icons/fa'
import { IoMdMan, IoMdWoman } from 'react-icons/io'

interface MyPupilCardsProps {
    students: any[];
}

const MyPupilCards: React.FC<MyPupilCardsProps> = ({ students }) => {
    const counts = useMemo(() => {
        const list = students || [];
        const male = list.filter((s) => s?.gender?.toLowerCase() === 'male').length;
        const female = list.filter((s) => s?.gender?.toLowerCase() === 'female').length;
        return { total: list.length, male, female };
    }, [students]);

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 space-y-6 shadow-sm rounded-xl bg-lime-100">
                <p className="text-sm font-medium text-gray-600">All Pupils</p>
                <div className="flex items-center justify-between">
                    <p className="text-[30px] font-semibold text-gray-800">{counts.total}</p>
                    <span className="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-lime-200 text-lime-600">
                        <FaUserGraduate />
                    </span>
                </div>
            </div>
            <div className="p-4 space-y-6 shadow-sm rounded-xl bg-sky-100">
                <p className="text-sm font-medium text-gray-600">Male Pupils</p>
                <div className="flex items-center justify-between">
                    <p className="text-[30px] font-semibold text-gray-800">{counts.male}</p>
                    <span className="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-sky-200 text-sky-600">
                        <IoMdMan />
                    </span>
                </div>
            </div>
            <div className="p-4 space-y-6 shadow-sm rounded-xl bg-rose-100">
                <p className="text-sm font-medium text-gray-600">Female Pupils</p>
                <div className="flex items-center justify-between">
                    <p className="text-[30px] font-semibold text-gray-800">{counts.female}</p>
                    <span className="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-rose-200 text-rose-600">
                        <IoMdWoman />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default MyPupilCards
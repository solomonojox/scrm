import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, Calendar, Award, MessageCircle } from 'lucide-react';
import assets from '../../Assets/assets';

const StudentOverview = () => {
    const [totalStudents, setTotalStudents] = useState(null);

    useEffect(() => {
        const fetchStudentCount = async () => {
            try {
                const response = await axios.get('https://scrmapi.tranquility.org.ng/api/Student/GetTotalStudentCount'); 
                setTotalStudents(response.data.total); 
            } catch (error) {
                console.error('Error fetching student count:', error);
                setTotalStudents(0); 
            }
        };

        fetchStudentCount();
    }, []);

    return (
        <div className="bg-gray-900 text-white">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>

            <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                    {/* Profile Section */}
                    <div className="flex flex-col items-start gap-4 lg:mr-20">
                        <img
                            src={assets.woman}
                            alt="Profile"
                            className="w-16 h-16 rounded-full bg-white object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">Brooklyn Simmons</h3>
                            <p className="text-gray-400 text-sm">Student • Beginner</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        <table>
                            <tbody>
                                <tr className='border-b'>
                                    <td className="pb-6 pr-20 border-r">
                                        {/* Total Students */}
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-500/20 p-2 rounded-lg">
                                                <MessageCircle className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-xl font-bold">
                                                {typeof totalStudents === 'number' ? totalStudents : 'Loading...'}

                                                </div>
                                                <div className="text-gray-400 text-sm">Total students</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="pb-6 pl-20">
                                        {/* Pending Courses */}
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-500/20 p-2 rounded-lg">
                                                <Calendar className="w-6 h-6 text-orange-400" />
                                            </div>
                                            <div>
                                                <div className="text-xl font-bold">04</div>
                                                <div className="text-gray-400 text-sm">Pending Courses</div>
                                            </div>
                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    <td className="pt-6 pr-20 border-r">
                                        {/* Watch Time */}
                                        <div className="flex items-center gap-3">
                                            <div className="bg-pink-500/20 p-2 rounded-lg">
                                                <Clock className="w-6 h-6 text-pink-400" />
                                            </div>
                                            <div>
                                                <div className="text-xl font-bold">62h</div>
                                                <div className="text-gray-400 text-sm">Watch Time</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="pt-6 pl-20">
                                        {/* Certificates */}
                                        <div className="flex items-center gap-3">
                                            <div className="bg-cyan-500/20 p-2 rounded-lg">
                                                <Award className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <div>
                                                <div className="text-xl font-bold">08</div>
                                                <div className="text-gray-400 text-sm">Certificates</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentOverview;

import React, { useState, useEffect } from 'react';
import womanId from "../Assets/woman.jpeg";
import Sidebar from "../Pages/Sidebar";
import axios from 'axios';
import { IoClose } from "react-icons/io5";
const baseUrl = process.env.REACT_APP_BASEURL;

const StudentData = () => {
    const guardianData = JSON.parse(localStorage.getItem('guardian'));
    const GuardianId = guardianData?.data?.guardianId;
    const [students, setStudents] = useState([]);
    const [teacherDetails, setTeacherDetails] = useState({});
    const [showMore, setShowMore] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getStudentByGuardian = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${baseUrl}/api/Student/GetGuardianStudents/${GuardianId}`);
                console.log("Student Data", response.data.data);
                setStudents(response.data.data);
                setShowMore(new Array(response.data.data.length).fill(false));
                
                // Fetch teacher details for each student
                const teacherPromises = response.data.data
                    .filter(student => student.teacherId)
                    .map(student => getTeacherById(student.teacherId));
                
                await Promise.all(teacherPromises);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching students:", error);
                setIsLoading(false);
            }
        };

        if (GuardianId) {
            getStudentByGuardian();
        }
    }, [GuardianId]);

    const getTeacherById = async (teacherId) => {
        try {
            const response = await axios.get(`${baseUrl}/api/Teacher/GetTeacherById/${teacherId}`);
            setTeacherDetails(prev => ({
                ...prev,
                [teacherId]: response.data.data
            }));
            console.log("Teacher Data", response.data.data);
        } catch (error) {
            console.error("Error fetching teacher:", error);
        }
    };

    const handleToggle = (index) => {
        const updatedShowMore = [...showMore];
        updatedShowMore[index] = !updatedShowMore[index];
        setShowMore(updatedShowMore);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <div className='flex'>
                <div>
                    <Sidebar />
                </div>
                <div className=' mt-10 flex justify-between space-x-8 px-10 w-[1100px] ml-[250px] h-56'>
                    {students.map((student, index) => (
                        <div key={student.studentId} className='flex pr-6 border rounded-md shadow-md h-56 items-center space-x-4'>
                            <div className='w-44 h-56 rounded-md'>
                                <img 
                                    src={student.imagePath || womanId} 
                                    alt='profile Pic' 
                                    className='h-56  rounded-md object-cover'
                                />
                            </div>
                            <div>
                                <p className='text-2xl font-bold mt-3'>
                                    {student.firstname} {student.lastname}
                                </p>
                                <p>Student No: {student.studentNo}</p>
                                <p>Class: {student.classroomId ? `Class ${student.classroomId}` : 'Not assigned'}</p>
                                <div className='flex items-center space-x-5'>
                                    <button 
                                        className='px-5 py-2 mt-6 ml bg-primary-bg rounded-md text-white'
                                        onClick={() => handleToggle(index)}
                                    >
                                        View teacher details
                                    </button>
                                   
                                </div>
                            </div>

                            {showMore[index] && (
                                <div 
                                    className='bg-[#00000099] h-[100dvh] fixed flex justify-center items-center top-0 -left-4  w-full'
                                    onClick={() => handleToggle(index)}
                                >
                                    <div 
                                        className='bg-white  h-[350px] flex items-center space-x-10 px-5 py-5 w-[600px] rounded-md relative'
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        
                                        <IoClose 
                                            className='absolute top-4 right-4 text-xl cursor-pointer'
                                            onClick={() => handleToggle(index)}
                                        />
                                        <div className="">
                                            <h1 className='text-2xl font-bold my-6'>Class Teacher's Details</h1>
                                            <img 
                                                src={womanId}
                                                alt="Teacher"
                                                className='rounded-md object-cover h-[250px] w-[250px]'
                                            />
                                        </div>
                                        <div className='space-y-4'>
                                            {student.teacherId && teacherDetails[student.teacherId] ? (
                                                <>
                                                    <p className='text-2xl font-bold'>
                                                        {teacherDetails[student.teacherId].firstName} {teacherDetails[student.teacherId].lastName}
                                                    </p>
                                                    <p><b>Email:</b> {teacherDetails[student.teacherId].email || 'Not available'}</p>
                                                    <p><b>Phone:</b> {teacherDetails[student.teacherId].phoneNumber || 'Not available'}</p>
                                                    <p><b>Gender:</b> {teacherDetails[student.teacherId].gender || 'Not specified'}</p>
                                                    <p><b>Class:</b> {student.classroomId ? `Class ${student.classroomId}` : 'Not assigned'}</p>
                                                </>
                                            ) : (
                                                <p>No teacher assigned or loading teacher details...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentData;
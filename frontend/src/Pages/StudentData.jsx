import React, { useState } from 'react'
// import studentId from "../Assets/images.jpeg";
import womanId from "../Assets/woman.jpeg";
import Sidebar from "../Pages/Sidebar"
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const StudentData = () => {
    const students = [
        {
            name: 'Mary Okafor',
            class: 'Primary 1',
            teacher: {
                name: 'Mr Paul Dan',
                assignedClass: 'Primary 1',
                email: 'pauldan@gmail.com',
                phone: '08100000001',
                qualification: 'BSc Physics',
                experience: '2 years'
            },
            guardian: 'Mrs. & Mrs. Okafor'
        },
        {
            name: 'John Okafor',
            class: 'Primary 3',
            teacher: {
                name: 'Kate Pee',
                assignedClass: 'Primary 3',
                email: 'katepee@gmail.com',
                phone: '08100000000',
                qualification: 'BSc Mathematics',
                experience: '2 years'
            },
            guardian: 'Mr. & Mrs. Okafor'
        },
    ];

    const [showMore, setShowMore] = useState(
        students.map(() => false) // Initialize an array of false values
    );
    // const [showMoreModal, setShowMoreModal] = useState(false);

    const handleToggle = (index) => {
        const updatedShowMore = [...showMore];
        updatedShowMore[index] = !updatedShowMore[index];
        setShowMore(updatedShowMore);
    };


    return (
        <div>
            <div className='flex '>
                <div>
                    <Sidebar />
                </div>
                <div className='bg-white shadow-md mt-10 flex space-x-24 px-5  w-[1000px] ml-[220px]  h-56'>
                    {students.map((student, index) => (
                        <div key={index} className=' flex items-center space-x-4'>
                            <div className='w-44 h-44 rounded-md'>
                                <img src={womanId} alt="" className='h-44 rounded-md object-cover' />
                            </div>
                            <div className=''>
                                <p className='text-2xl font-bold mt-3 px-2'>{student.name}</p>
                                <p className='mt-4'> Class Teacher: {student.teacher.name}</p>
                                <p>CLass: {student.class}</p>
                                <p>Guardian: {student.guardian} </p>
                                <div className='flex items-center space-x-5'>
                                    <button className='px-5 py-2 mt-6 ml bg-primary-bg rounded-md text-white' onClick={() => handleToggle(index)}>View teacher details</button>
                                    <IoChatbubbleEllipsesSharp className='text-3xl mt-4  ml-20 text-primary-bg' />
                                </div>
                            </div>
                            {showMore[index] && (
                                <div className='bg-[#00000099] h-[100dvh] fixed flex justify-center items-center top-0 left-0  w-full ' onClick={() => handleToggle(index)}>
                                    <div className='bg-white  h-[350px] flex items-center space-x-10 px-5 py-5 w-[600px] rounded-md relative' onClick={(e) => e.stopPropagation()}>
                                        <IoClose className='absolute top-4 right-4 text-xl cursor-pointer' onClick={() => handleToggle(index)} />
                                        <div className="   rounded-md" >
                                            <img src={womanId} alt="" className='rounded-md object-cover h-[300px] w-[300px]' />
                                        </div>
                                        <div className=' space-y-4'>
                                            <p className='text-2xl font-bold' >{student.teacher.name}</p>
                                            <p>Email: {student.teacher.email}</p>
                                            <p>Phone number: {student.teacher.phone}</p>
                                            <p>Qualification: {student.teacher.qualification}</p>
                                            <p>Experience: {student.teacher.experience}</p>
                                            <p>Class: {student.teacher.assignedClass}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StudentData
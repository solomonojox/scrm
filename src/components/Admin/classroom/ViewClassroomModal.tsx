import React, { useState } from 'react'
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import imageAssets from '../../../assets/imageAssets';

interface Student {
  sn: number;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
}

interface ClassroomData {
  schoolId: string;
  name: string;
  capacity: string;
  teacherId: string;
  teacherName: string;
  totalStudents: string;
  schoolFee: string;
  totalPayments: string;
  totalOwing: string;
}

interface ViewClassroomModalProps {
  closeViewModal: () => void;
  classroomData?: ClassroomData;
  students?: Student[];
}

const ViewClassroomModal: React.FC<ViewClassroomModalProps> = ({ 
  closeViewModal, 
  classroomData,
  students: initialStudents
}) => {
  const [formData] = useState<ClassroomData>(classroomData || {
    schoolId: '',
    name: '',
    capacity: '',
    teacherId: '',
    teacherName: '',
    totalStudents: '',
    schoolFee: '',
    totalPayments: '',
    totalOwing: ''
  });

  const [students] = useState<Student[]>(initialStudents || [
    { sn: 1001, firstName: 'Jane', lastName: 'Doe', gender: 'Female' },
    { sn: 1002, firstName: 'John', lastName: 'Smith', gender: 'Male' },
    { sn: 1003, firstName: 'Alice', lastName: 'Johnson', gender: 'Female' },
    { sn: 1004, firstName: 'Bob', lastName: 'Brown', gender: 'Male' },
    { sn: 1005, firstName: 'Emma', lastName: 'Davis', gender: 'Female' },
    { sn: 1006, firstName: 'Mike', lastName: 'Wilson', gender: 'Male' }
  ]);

  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const toggleStudentSelection = (sn: number) => {
    setSelectedStudents(prev => 
      prev.includes(sn) 
        ? prev.filter(id => id !== sn) 
        : [...prev, sn]
    );
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-2 sm:p-4'>
      <div className='w-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden'>
        {/* Header with close button */}
        <div className='flex items-center justify-end px-4 pt-2 bg-white sticky top-0 z-10'>
          
          <button 
            onClick={closeViewModal}
            className='text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors'
          >
            <FaTimes className='text-lg sm:text-xl' />
          </button>
        </div>

        <h1 className='text-lg sm:text-2xl font-semibold text-center mb-6 text-gray-800'>View Classroom</h1>

        <div className='overflow-y-auto max-h-[calc(95vh-60px)] sm:max-h-[calc(95vh-68px)]'>
          {/* Orange Background Container */}
          <div className='bg-orange-500 p-3 md:p-6'>
            {/* Main Content Container */}
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-2'>
              {/* Form Section */}
              <div className='flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {/* Left Column */}
                <div className='space-y-3 sm:space-y-4'>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3'>
                    <label className='text-white font-semibold text-sm w-32 text-nowrap '>School ID:</label>
                    <input 
                      type="text" 
                      value={formData.schoolId}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                    />
                  </div>
                  
                  <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3'>
                    <label className='text-white font-semibold text-sm w-32 text-nowrap '>Name:</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                      
                    />
                  </div>
                  
                  <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3'>
                    <label className='text-white font-semibold text-sm w-32 text-nowrap '>Capacity:</label>
                    <input 
                      type="text" 
                      value={formData.capacity}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                     
                    />
                  </div>
                  
                  <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3'>
                    <label className='text-white font-semibold text-sm w-32 text-nowrap '>Teacher ID:</label>
                    <input 
                      type="text" 
                      value={formData.teacherId}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                      
                    />
                  </div>
                  
                  <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3'>
                    <label className='text-white font-semibold text-sm w-32 text-nowrap '>Teacher Name:</label>
                    <input 
                      type="text" 
                      value={formData.teacherName}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                      
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className='space-y-3 sm:space-y-4'>
                  <div className='flex flex-col md:flex-row gap-1'>
                    <label className='text-white font-semibold md:w-[400px] text-nowrap'>Total Number of Students:</label>
                    <input 
                      type="text" 
                      value={formData.totalStudents}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                     
                    />
                  </div>
                  
                  <div className='flex flex-col md:flex-row gap-1'>
                    <label className='text-white font-semibold md:w-[400px] text-nowrap'>School Fee (₦):</label>
                    <input 
                      type="text" 
                      value={formData.schoolFee}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                      
                    />
                  </div>
                  
                  <div className='flex flex-col md:flex-row gap-1'>
                    <label className='text-white font-semibold md:w-[400px] text-nowrap'>Total Number of Payments:</label>
                    <input 
                      type="text" 
                      value={formData.totalPayments}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                      
                    />
                  </div>
                  
                  <div className='flex flex-col md:flex-row gap-1'>
                    <label className='text-white font-semibold md:w-[400px] text-nowrap'>Total Number Owing:</label>
                    <input 
                      type="text" 
                      value={formData.totalOwing}
                      className='w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-black text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50'
                
                    />
                  </div>
                </div>
              </div>

              {/* Book Image */}
              <div className='flex-shrink-0 flex justify-center lg:justify-end mt-4 lg:mt-0'>
                <div className=' '>
                  <img 
                    className='w-full h-full object-contain hover:scale-105 transition-transform duration-300 ease-in-out' 
                    src={imageAssets.book} 
                    alt="book" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student List Section */}
          <div className='p-3 sm:p-6 lg:p-8'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6'>
              <h3 className='text-base sm:text-lg font-semibold text-gray-800'>List of Students(All)</h3>
              <div className='flex items-center gap-2'>
                <select 
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className='border border-gray-300 rounded px-3 py-2 text-sm bg-orange-500 text-white focus:outline-none focus:ring-2 focus:ring-orange-300 min-w-0'
                >
                  <option value="" className='text-gray-800'>Select Action ▼</option>
                  <option value="delete" className='text-gray-800'>Delete Selected</option>
                </select>
              </div>
            </div>

            {/* Table Container with Horizontal Scroll */}
            <div className='border border-gray-300 rounded-lg overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[500px]'>
                  <thead className='bg-gray-100'>
                    <tr>
                      <th className='px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300'>SN</th>
                      <th className='px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300'>First Name</th>
                      <th className='px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300'>Last Name</th>
                      <th className='px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300'>Gender</th>
                      <th className='px-3 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700'>Delete</th>
                    </tr>
                  </thead>
                  <tbody className='bg-white'>
                    {students.map((student, index) => (
                      <tr key={index} className={`hover:bg-gray-50 transition-colors ${index < students.length - 1 ? 'border-b border-gray-300' : ''}`}>
                        <td className='px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 border-r border-gray-300'>{student.sn}</td>
                        <td className='px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 border-r border-gray-300'>{student.firstName}</td>
                        <td className='px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 border-r border-gray-300'>{student.lastName}</td>
                        <td className='px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 border-r border-gray-300'>{student.gender}</td>
                        <td className='px-3 sm:px-4 py-2 sm:py-3 text-center'>
                          <div className='flex justify-center'>
                            <input 
                              type="checkbox" 
                              checked={selectedStudents.includes(student.sn)}
                              onChange={() => toggleStudentSelection(student.sn)}
                              className='h-3 w-3 sm:h-4 sm:w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded'
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {students.length === 0 && (
              <div className='text-center py-8 sm:py-12 text-gray-500'>
                <p className='text-sm sm:text-base'>No students found in this classroom.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewClassroomModal
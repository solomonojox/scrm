import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TeacherNavbarDashboard from '../TeacherNavbarDashboard';
import { IoMdCloseCircle } from 'react-icons/io';
import { AppContext } from '../../context/AppContext';
const baseUrl = process.env.REACT_APP_BASEURL;

function Assignments() {
  const { formatDate, showOverlay, hideOverlay } = useContext(AppContext)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [message, setMessage] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [data, SetData] = useState([]);
  const [classroomData, setClassroomData] = useState([])

  console.log(classroomId)
  const fetchAssignment = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/Assignment/GetAssignmentByClassId/3`
      );
      SetData(response.data.data);
      console.log(response.data);
      

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    showOverlay();

    const form = {
      title,
      description,
      teacherId: localStorage.getItem('teacherId'),
      classroomId,
    };

    try {
      const response = await axios.post(
        `${baseUrl}/api/Assignment/CreateAssignment`,
        form
      );

      setMessage('Assignment added successfully');
      setTitle('');
      setDescription('');
      setClassroomId('');
      setTimeout(() => {
        setIsModal(false);
        setMessage('');
      }, 2000);
      fetchAssignment();

      console.log(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to create assignment'
      );
      console.error('Error:', error);
    } finally {
      hideOverlay()
    }
  };

  const fetchclassroom = async (e) => {
    try {
      const res = await axios.get(`${baseUrl}/api/Classroom/GetAllClassroom`);
      setClassroomData(res.data.data)
      // console.log(res.data.data)
    } catch (error) {
      console.error('error', error);
    }
  }

  useEffect(() => {
    fetchclassroom()
  }, []);

  return (
    <>
      <div>
        <TeacherNavbarDashboard />
      </div>

      <div className="container mb-10 mx-auto p-2">
        <div className="flex flex-col lg:flex-row justify-between ml-10 lg:items-center mb-4">
          <h2 className="text-2xl font-medium mb-4 text-start">All Assignments</h2>
          <div className="gap-2 flex items-center flex-col md:flex-row md:justify-between">
            <button
              className="bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 px-4 py-2 rounded mr-2"
              onClick={() => setIsModal(true)}
            >
              Add Assignment
            </button>
          </div>
        </div>

        {/* Modal for adding new assignment */}
        {isModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
              <IoMdCloseCircle
                className="absolute top-4 right-4 text-3xl text-red-500 cursor-pointer"
                onClick={() => setIsModal(false)}
              />
              <h2 className="text-2xl font-semibold mb-4">Create Assignment</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="classroom" className="block text-sm font-medium text-gray-700">
                    Classroom
                  </label>
                  <select name="" id="" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700" value={classroomId} onChange={(e) => setClassroomId(e.target.value)}>
                    <option value="">Select classroom</option>
                    {classroomData.map((classroomData, index) => (
                      <option value={classroomData.classroomId} key={index}>{classroomData.name}</option>
                    ))}
                  </select>
                </div>

                {message && (
                  <div
                    className={`p-2 text-sm rounded-md mb-3 ${message.includes('successfully')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 px-4 mt-5 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                  Create Assignment
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden shadow">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                {/* <th className="px-6 py-3 text-left border-b">ID</th> */}
                <th className="px-6 py-3 text-left border-b">Title</th>
                <th className="px-6 py-3 text-left border-b">Description</th>
                <th className="px-6 py-3 text-left border-b">Classroom ID</th>
                <th className="px-6 py-3 text-left border-b">Due Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {data?.length > 0 ? (
                data.map((assignment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {/* <td className="px-6 py-4 border-b">{assignment.assignmentId}</td> */}
                    <td className="px-6 py-4 border-b">{assignment.title}</td>
                    <td className="px-6 py-4 border-b">{assignment.description}</td>
                    <td className="px-6 py-4 border-b">{assignment.classroomId}</td>
                    <td className="px-6 py-4 border-b">{formatDate(assignment.dueDate)}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

export default Assignments;

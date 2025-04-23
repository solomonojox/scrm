import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import assets from '../../../Assets/assets'

const baseUrl = process.env.REACT_APP_BASEURL

const Students = ({ guardianId }) => {
    const { showOverlay, hideOverlay } = useContext(AppContext)
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('')
    useEffect(() => {
        const getUser = async () => {
            showOverlay();
            try {
                const response = await axios.get(
                    `${baseUrl}/api/Guardian/GetGuardianById/${guardianId}`
                );
                console.log(response.data.data.students[0])
                if (response.data.data) {
                    setStudents(response.data.data.students);
                }
            } catch (error) {
                console.log(error);
                if (error.response) {
                    setMessage(error.response.data.responseMessage);
                } else {
                    setMessage(`${error.message}, check your internet connection`);
                }
            } finally {
                hideOverlay()
            }
        };
        if (guardianId) {
            getUser();
        }
    }, [guardianId, showOverlay, hideOverlay]);

    return (
        <div className='p-6 h-[100dvh]'>
            {students.length > 0 ? (
                students.map(student => (
                    <div key={student.studentId} className="w-full h-36 bg-white p-4 rounded-lg flex items-center gap-4 relative">
                        <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center">
                            <img
                                src={student.imagePath || assets.avatar}
                                alt="guardian"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">
                                {student.firstname} {student.lastname}
                            </p>
                            <p className="text-gray-600">{student.studentNo}</p>
                            <p className="text-gray-600">{student.homeAddress}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>{message}</p>
            )}
        </div>
    )
}

export default Students
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';

import { MdAddAPhoto } from 'react-icons/md';
import assets from '../../../Assets/assets';
const baseUrl = process.env.REACT_APP_BASEURL

const AdminEditTeacherProfile = ({ teacherId }) => {
    const { showOverlay, hideOverlay, notifySuccess, notifyError } = useContext(AppContext)
    const [message, setMessage] = useState('');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
    const [trigger, setTrigger] = useState(false);
    const [userData, setUserData] = useState(null);

    const [teacherData, setTeacherData] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        homeAddress: "",
        classroom: "",
        nationality: "",
        stateOfOrigin: "",
        religion: "",
        email: "",
        username: ""
    });

    useEffect(() => {
        const getUser = async () => {
            showOverlay();
            try {
                const response = await axios.get(
                    `${baseUrl}/api/Teacher/GetTeacherById/${teacherId}`
                );
                console.log(response.data.data)
                if (response.data.data) {
                    setUserData(response.data.data);
                    setTeacherData({
                        firstName: response.data.data.firstname || '',
                        lastName: response.data.data.lastname || '',
                        phone: response.data.data.phone || '',
                        homeAddress: response.data.data.homeAddress || '',
                        classroom: response.data.data.classroom || '',
                        nationality: response.data.data.nationality || '',
                        stateOfOrigin: response.data.data.stateOfOrigin || "",
                        religion: response.data.data.religion || "",
                        email: response.data.data.email || '',
                        username: response.data.data.username || '',
                    });
                }
            } catch (error) {
                console.log(error);
                if (error.response) {
                    setMessage(error.response.data.responseMessage);
                } else {
                    setMessage(`${error.message}, check your internet connection`);
                }
            } finally{
                hideOverlay()
            }
        };
        if (teacherId) {
            getUser();
        }
    }, [teacherId, profilePhotoUrl, trigger, showOverlay, hideOverlay]);

    const handleIconClick = () => {
        document.getElementById('fileInput').click();
    };
    const [photo, setPhoto] = useState(null);
    const handleUploadPhoto = async (e) => {
        e.preventDefault();
        showOverlay();

        let imageUrl = '';
        if (photo) {
            const formData = new FormData();
            formData.append('file', photo);
            formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_NAME);
            formData.append('cloud_name', process.env.REACT_APP_CLOUDINARY_ID);
            try {
                const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/upload`,
                    formData
                );
                imageUrl = res.data.secure_url;
            } catch (error) {
                console.error(error);
            }
        }

        try {
            const res = await axios.post(
                `https://api.tranquility.org.ng/api/Member/ImageUrl/${teacherId}`,
                { imageUrl }
            );

            notifySuccess(res.data.responseMessage);
            setProfilePhotoUrl(res.data.data.imageUrl);
        } catch (err) {
            notifyError(err.response.data.responseMessage);
        } finally {
            hideOverlay()
        }
    };

    const updateMember = async (e) => {
        e.preventDefault();
        showOverlay()
        try {
            const res = await axios.put(
                `${baseUrl}/api/Student/UpdateStudent/${teacherId}`,
                teacherData
            );
            notifySuccess(res.data.responseMessage);
            setTrigger(!trigger);
        } catch (err) {
            console.log(err.response);
            notifyError(err.response.data.responseMessage);
        } finally {
            hideOverlay()
        }
    };

    return (
        <div className='p-6'>
            {userData === null ? (
                <div>{message || "An error occured"}</div>
            ) : (
                <div className="mx-0 md:mx-2 lg:mx-2 space-y-4">
                    <div className="w-full h-36 bg-white p-4 rounded-lg flex items-center gap-4 relative">
                        <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center">
                            <img
                                src={userData.imagePath || assets.avatar}
                                alt=""
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">
                                {userData.firstname} {userData.lastname}
                            </p>
                            <p className="text-gray-600">{userData.email}</p>
                        </div>
                        <button
                            onClick={handleIconClick}
                            className="bg-blue-500 rounded-full p-1 text-white absolute left-2 top-[90px] shadow-lg "
                        >
                            <MdAddAPhoto />
                        </button>
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={(e) => setPhoto(e.target.files[0])}
                            accept="image/*"
                        />
                        <button
                            onClick={handleUploadPhoto}
                            className="bg-blue-500 rounded text-[10px] p-[2px] text-white absolute left-2 top-[120px] shadow-lg "
                        >
                            Upload
                        </button>
                    </div>

                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Teacher Profile
                        </h2>

                        <form className="space-y-6" onSubmit={updateMember}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.keys(teacherData).map((field, index) => (
                                    <div key={index}>
                                        <label
                                            className="block text-sm font-medium text-gray-700"
                                            htmlFor={field}
                                        >
                                            {field
                                                .replace(/([A-Z])/g, ' $1')
                                                .replace(/^./, (str) => str.toUpperCase())}
                                        </label>
                                        <input
                                            type="text"
                                            id={field}
                                            value={teacherData[field]}
                                            className="mt-1 block w-full border rounded-md shadow-sm focus:border-primary-bg outline-none focus:ring-primary-bg focus:ring-1 p-2"
                                            onChange={(e) =>
                                                setTeacherData({ ...teacherData, [field]: e.target.value })
                                            }
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary-bg hover:bg-primary-hover transition-all duration-300 text-white py-2 px-4 rounded-md hover:bg-tertiary focus:outline-none"
                            >
                                Update Profile
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminEditTeacherProfile
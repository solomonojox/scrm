import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
const baseUrl = process.env.REACT_APP_BASEURL

const AddStudent = ({ nextStep }) => {
    const { notifySuccess, notifyError, showOverlay, hideOverlay } = useContext(AppContext)
    const [guardian, setGuardian] = useState([])
    useEffect(() => {
        const getGuardian = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/Guardian/GetAllGuardians`)
                console.log(res.data)
                if (res.data) {
                    setGuardian(res.data)
                }
            } catch (err) {
                console.log(err.response.data)
            }
        }

        getGuardian()
    }, [])

    const [teacher, setTeacher] = useState([])
    useEffect(() => {
        const getGuardian = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/Teacher/GetAllTeachers`)
                console.log(res.data)
                if (res.data) {
                    setTeacher(res.data)
                }
            } catch (err) {
                console.log(err.response.data)
            }
        }

        getGuardian()
    }, [])

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        enteredClass: "",
        age: '',
        homeAddress: "",
        guardianId: "",
        teacherId: "",
        sessionId:"",
        currentTerm:"",
        dateofbirth:""
    })

    const addStudent = async (e) => {
        e.preventDefault();
        showOverlay()

        try {
            const res = await axios.post(`${baseUrl}/api/Student/AddStudent`, formData)
            console.log(res.data)
            if (res.data.responseMessage) {
                notifySuccess(res.data.responseMessage)
                nextStep()
            }
        } catch (err) {
            console.log(err.response.data)
            notifyError(err.response.data.responseMessage)
        } finally {
            hideOverlay()
        }
    }

    const isNotalidated = !formData.firstname ||
        !formData.lastname ||
        !formData.enteredClass ||
        !formData.age ||
        !formData.homeAddress ||
        !formData.guardianId ||
        !formData.teacherId

    return (
        <div>
            <form action="submit" onSubmit={addStudent} className='p-6 lg:p-10 space-y-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div>
                        <label htmlFor="firstname">First name</label>
                        <input type="text" id='firstname' value={formData.firstname} placeholder='Enter firstname' className='w-full p-3 border rounded-md outline-none focus:border-primary-bg'
                            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="lastname">Last name</label>
                        <input type="text" id='lastname' value={formData.lastname} placeholder='Enter lastname' className='w-full p-3 border rounded-md outline-none focus:border-primary-bg'
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="enteredClass">Entered class</label>
                        <select id="enteredClass" value={formData.enteredClass} className='w-full p-3 border rounded-md outline-none focus:border-primary-bg'
                            onChange={(e) => setFormData({ ...formData, enteredClass: e.target.value })} >
                            <option value="Select class">Select class</option>
                            <option value={1}>JSS 1</option>
                            <option value={2}>JSS 2</option>
                            <option value={3}>JSS 3</option>
                            <option value={4}>SS 1</option>
                            <option value={6}>SS 2</option>
                            <option value={7}>SS 3</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="age">Age</label>
                        <input type="number" id='age' value={formData.age} placeholder='Enter your age' className='w-full p-3 border rounded-md outline-none focus:border-primary-bg'
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="homeAddress">Home address</label>
                        <input type="text" id='homeAddress' value={formData.homeAddress} placeholder='Enter home address' className='w-full p-3 border rounded-md outline-none focus:border-primary-bg'
                            onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="guardian">Guardian</label>
                        <select name="religion" id="guardian" className='w-full p-3 border rounded-md outline-none focus:border-primary-bg' onChange={(e) => setFormData({ ...formData, guardianId: e.target.value })}>
                            <option value="Select">Select Guardian</option>
                            {guardian !== null && guardian !== undefined ? guardian.map(guardian => (
                                <option key={guardian.guardianId} value={guardian.guardianId}>{guardian.firstname} {guardian.lastname}</option>
                            )) : null}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="teacher">Teacher</label>
                        <select name="teacher" id="teacher" className='w-full p-3 border rounded-md outline-none focus:border-primary' onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}>
                            <option value="Select">Select Teacher</option>
                            {teacher !== null && teacher !== undefined ? teacher.map(teacher => (
                                <option key={teacher.teacherId} value={teacher.teacherId}>{teacher.firstname} {guardian.lastname}</option>
                            )) : null}
                        </select>
                    </div>
                </div>

                <button
                    disabled={isNotalidated}
                    className={`${isNotalidated ? 'bg-gray-400' : 'bg-primary-bg hover:bg-primary-hover'} py-3 px-10 rounded-lg text-white`}>Submit</button>
            </form>
        </div>
    )
}

export default AddStudent
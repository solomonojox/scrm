import { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
const baseUrl = process.env.REACT_APP_BASEURL
const Guardian = ({ nextStep }) => {
    const { notifySuccess, notifyError, showOverlay, hideOverlay } = useContext(AppContext)
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        relationship: "",
        phone: "",
        occupation: "",
        homeAddress: "",
        workAddress: "",
        stateOfOrigin: "",
        nationality: "",
        religion: "",
        email: "",
        username: ""

    })

    const addGuardian = async (e) => {
        e.preventDefault()
        showOverlay()

        try {
            const res = await axios.post(`${baseUrl}/api/Guardian/AddStudentGuardian`, formData);
            if (res.data.responseMessage) {
                notifySuccess(res.data.responseMessage)
                nextStep()
            }
        } catch (err) {
            // console.log(err.response)
            notifyError(err.response.data.responseMessage)
        } finally {
            hideOverlay()
        }
    }

    const isNotValidated = !formData.firstname ||
        !formData.lastname ||
        !formData.lastname ||
        !formData.relationship ||
        !formData.phone ||
        !formData.occupation ||
        !formData.homeAddress ||
        !formData.workAddress ||
        !formData.stateOfOrigin ||
        !formData.nationality ||
        !formData.religion ||
        !formData.email ||
        !formData.username

    return (
        <div className='flex justify-center items-center '>
            <form action="submit" onSubmit={addGuardian} className='p-6 lg:px-10 lg:py-6 space-y-4 w-full'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                    <div>
                        <label htmlFor="firstname">First name</label>
                        <input type="text" id='firstname' value={formData.firstname} placeholder='Enter firstname' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="lastname">Last name</label>
                        <input type="text" id='lastname' value={formData.lastname} placeholder='Enter lastname' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="relationship">Relationship</label>
                        <input type="text" id='relationship' value={formData.relationship} placeholder='Relationship' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input type="text" id='phone' value={formData.phone} placeholder='Enter phone number' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="occupation">Ocupation</label>
                        <input type="text" id='occupation' value={formData.occupation} placeholder='Enter occupation' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="homeAddress">Home address</label>
                        <input type="text" id='homeAddress' value={formData.homeAddress} placeholder='Enter home address' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="workAddress">Work address</label>
                        <input type="text" id='workAddress' value={formData.workAddress} placeholder='Enter work address' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, workAddress: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="stateOfOrigin">State of origin</label>
                        <input type="text" id='stateOfOrigin' value={formData.stateOfOrigin} placeholder='Enter state of origin' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="nationality">Nationality</label>
                        <select name="nationality" id="nationality" className='w-full p-3 border rounded-md outline-none focus:border-primary' onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}>
                            <option value="Select country">Select country</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="religion">Religion</label>
                        <select name="religion" id="religion" className='w-full p-3 border rounded-md outline-none focus:border-primary' onChange={(e) => setFormData({ ...formData, religion: e.target.value })}>
                            <option value="Select">Select religion</option>
                            <option value="Christian">Christian</option>
                            <option value="Muslim">Muslim</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" id='nationality' value={formData.email} placeholder='Enter email' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="username">User name</label>
                        <input type="text" id='nationality' value={formData.username} placeholder='Enter user name' className='w-full p-3 border rounded-md outline-none focus:border-primary'
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    </div>
                </div>

                <div>
                    <button
                        disabled={isNotValidated}
                        className={`${isNotValidated ? 'bg-gray-400' : 'bg-primary-bg hover:bg-primary-hover'} py-3 px-10 rounded-lg text-white`}>Submit</button>
                </div>
                <button
                    onClick={nextStep}
                    className={`bg-primary-bg hover:bg-primary-hover py-3 px-10 rounded-lg text-white`}>Already have a guardian? Next</button>
            </form>
        </div>
    )
}

export default Guardian
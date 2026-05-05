import { GraduationCap, Lock, Mail } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NappsLogin = () => {
    const navigate = useNavigate()
    const handleLogin = (e: any) => {
        e.preventDefault();
        navigate('/napps/dashboard')
    }
    return (
        <div className='bg-blue-50 min-h-screen flex items-center justify-center'>
            <div className="rounded-xl bg-white shadow-lg p-10 min-w-md flex flex-col items-center gap-4">
                <GraduationCap className='text-white bg-blue-800 p-2 rounded-xl' size={55} />

                <div className='text-center space-y-2'>
                    <p className='font-bold text-2xl'>EduCat NAPPS</p>
                    <p className='text-gray-600'>Chapter Management System</p>
                </div>

                <form action="submit" className='space-y-4 w-full' onSubmit={handleLogin}>
                    <div className='space-y-2'>
                        <label htmlFor="email" className='font-medium'>Email Address</label>

                        <div className='relative mt-1'>
                            <Mail className='text-gray-400 absolute top-3 left-2' size={20} />
                            <input type="email" placeholder='Enter your email' className='rounded-xl border w-full outline-none p-2 pl-10 bg-white text-gray-400' />
                        </div>
                    </div>

                    <div >
                        <label htmlFor="email" className='font-medium'>Password</label>

                        <div className='relative mt-1'>
                            <Lock className='text-gray-400 absolute top-3 left-2' size={20} />
                            <input type="password" placeholder='Enter your password' className='rounded-xl border w-full outline-none p-2 pl-10 bg-white text-gray-400' />
                        </div>
                    </div>

                    <button className='bg-blue-800 text-white w-full p-2 rounded-xl'>Sign in</button>
                </form>
            </div>
        </div>
    )
}

export default NappsLogin
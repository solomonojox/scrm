import React, { useContext, useState } from 'react'
import { GraduationCap, Loader } from 'lucide-react'
import { superAdminService } from '../../Services/superAdmin';
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Auth/useAuth';

const SuperAdminLogin = () => {
    const navigate = useNavigate()
    const { login } = useAuth();
    const { notifySuccess, notifyError } = useContext(AppContext)
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        try {
            const res = await superAdminService.adminLogin(userName, password);
            // console.log(res);
            login(res.data);
            notifySuccess(res.responseMessage || 'Successfully logged in');
            navigate('/super-admin/dashboard')
        } catch (err: any) {
            console.log(err);
            notifyError(err.response.data.responseMessage || 'Error logging in');
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className='bg-blue-50 h-dvh w-full mx-auto flex justify-center items-center p-2'>
            <div className="rounded-2xl p-4 lg:px-8 flex flex-col items-center justify-center w-full md:w-xl border bg-white">
                <div className="rounded-xl bg-blue-600 p-2 flex items-center justify-center">
                    <GraduationCap className='text-white' size={40} />
                </div>

                <div className='space-y-2 mt-4 text-center'>
                    <p>Educat Super Admin</p>
                    <p>Sign in to access the Super Admin Dashboard</p>
                </div>

                <form action="submit" className='space-y-4 mt-10 w-full' onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="userName" className='font-medium'>Username</label>
                        <input type="text" id='userName' name='userName' placeholder='admin' className='w-full px-4 py-2 rounded-lg bg-gray-100 focus:border-blue-600 outline-none border' onChange={(e) => setUserName(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="password" className='font-medium'>Password</label>
                        <input type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder='Enter your password' className='w-full px-4 py-2 rounded-lg bg-gray-100 focus:border-blue-600 outline-none border' onChange={(e) => setPassword(e.target.value)} />

                        <div className="flex items-center mt-2">
                            <input type="checkbox" className='mr-2 h-4 w-4' onChange={(e) => setShowPassword(e.target.checked)} />
                            <label htmlFor="showPassword">Show Password</label>
                        </div>
                    </div>

                    <button
                        className={`rounded-lg w-full p-2 ${loading ? 'bg-gray-500' : 'bg-black hover:bg-black/80'} text-white`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader className="animate-spin" size={20} />
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="border-t w-full p-6 flex items-center justify-center mt-10">
                    <p className="text-gray-400 text-xs text-center">Secure admin access only. Unauthorized access is prohibited.</p>
                </div>
            </div>
        </div>
    )
}

export default SuperAdminLogin
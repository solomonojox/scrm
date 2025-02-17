import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AppContext } from "../context/AppContext";

import { PiEyeClosed } from "react-icons/pi";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const MainLogin = () => {
  const { notifySuccess, notifyError, showOverlay, hideOverlay } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginTeacher = async (e) => {
    e.preventDefault();
    showOverlay()

    try {
      const res = await axios.post('https://scrmapi.tranquility.org.ng/api/Teacher/Login', {
        email: email,
        password: password
      });
      console.log(res.data);
      notifySuccess(res.data.responseMessage);
    } catch (err) {
      console.log(err.response.data);
      notifyError(err.response.data.responseMessage);
    } finally {
      hideOverlay()
    }
  }

  const isNotValidated = !email || !password;

  return (
    <div className="bg-orange-300 h-[100dvh] w-full p-2">
      <div className="w-[350px] bg-white h-full rounded-2xl p-6 grid items-center">
        <div>LOGO</div>

        <h2 className="font-bold">WELCOME TO <br />OUR WEBSITE</h2>

        <form action="submit" className="space-y-8 p-6" onSubmit={loginTeacher}>
          <div className="space-y-1">
            <input type="email" placeholder="email" value={email} id="email"
              className="rounded-2xl w-full px-4 py-2 bg-gray-100 outline-none focus:border-primary focus:border border border-white text-[12px]"
              onChange={(e) => setEmail(e.target.value)} />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="password" value={password} id="password"
                className="rounded-2xl w-full px-4 py-2 bg-gray-100 outline-none focus:border-primary focus:border border border-white text-[12px]"
                onChange={(e) => setPassword(e.target.value)} />

              {showPassword ?
                <IoEyeOutline className='absolute top-3 right-4 text-lg cursor-pointer text-gray-500' onClick={() => setShowPassword(!showPassword)} /> :
                <PiEyeClosed className='absolute top-3 right-4 text-lg cursor-pointer text-gray-500' onClick={() => setShowPassword(!showPassword)} />
              }
            </div>

          </div>

          <button className={`rounded-2xl p-2 ${isNotValidated ? "bg-gray-600" : "bg-primary-bg hover:bg-primary-hover"} w-full text-white`}
            disabled={isNotValidated}>SIGN IN</button>

          <Link to={'/registrationwiz'} className="flex justify-center text-center hover:underline">New registration</Link>
        </form>

        <p className="text-[12px] text-center">By signing up, you confirm or <br /><span className="font-bold">Terms of Use</span> and <span className="font-bold">Privacy Policy</span></p>
      </div>
    </div>
  )
}

export default MainLogin
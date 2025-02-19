import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AppContext } from "../context/AppContext";

import { PiEyeClosed } from "react-icons/pi";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const MainLogin = () => {
  const navigate = useNavigate()
  const { notifySuccess, notifyError, showOverlay, hideOverlay } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState(""); // State for selected role

  const handleRoleChange = (e) => {
    setSelectedLogin(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault()

    if (selectedLogin === 'teacher') {
      loginTeacher()
    } else if (selectedLogin === 'guardian') {
      loginGuardian()
    } else if (selectedLogin === 'admin') {
      loginAdmin()
    }
  }

  const loginAdmin = async () => {
    showOverlay();

    try {
      const res = await axios.post('https://scrmapi.tranquility.org.ng/api/Admin/AdminLogin', {
        username: username,
        password: password
      });
      // console.log(res.data);
      notifySuccess(res.data.responseMessage);
      navigate('/admin/dashboard')
    } catch (err) {
      // console.log(err.response.data);
      notifyError(err.response.data.responseMessage);
    } finally {
      hideOverlay();
    }
  };

  const loginTeacher = async () => {
    showOverlay();

    try {
      const res = await axios.post('https://scrmapi.tranquility.org.ng/api/Teacher/Login', {
        email: email,
        password: password
      });
      // console.log(res.data);
      notifySuccess(res.data.responseMessage);
    } catch (err) {
      // console.log(err.response.data);
      notifyError(err.response.data.responseMessage);
    } finally {
      hideOverlay();
    }
  };

  const loginGuardian = async () => {
    showOverlay();

    try {
      const res = await axios.post('https://scrmapi.tranquility.org.ng/api/Guardian/Login', {
        email: email,
        password: password
      });
      // console.log(res.data);
      notifySuccess(res.data.responseMessage);
      navigate('/studentdashboard')
    } catch (err) {
      // console.log(err.response.data);
      notifyError(err.response.data.responseMessage);
    } finally {
      hideOverlay();
    }
  };

  const isNotValidated = !email || !password || !selectedLogin;
  const isNotValidated2 = !username || !password || !selectedLogin;

  return (
    <div className="bg-orange-300 h-[100dvh] w-full p-2">
      <div className="w-[350px] bg-white h-full rounded-2xl p-6 grid items-center">
        <div>LOGO</div>

        <h2 className="font-bold">WELCOME TO OUR WEBSITE</h2>

        <form action="submit" className="space-y-8" onSubmit={handleLogin}>
          <div className="space-y-1">
            <div className="flex gap-2 text-sm">
              {["admin", "teacher", "student", "guardian"].map((role) => (
                <div key={role} className="flex items-center gap-1">
                  <input
                    type="radio"
                    id={role}
                    name="loginRole"
                    value={role}
                    checked={selectedLogin === role}
                    onChange={handleRoleChange}
                  />
                  <label htmlFor={role} className="font-semibold capitalize cursor-pointer">{role}</label>
                </div>
              ))}
            </div>

            {selectedLogin === 'admin' ? (
              <input
                type="text"
                placeholder="username"
                value={username}
                id="username"
                className="rounded-2xl w-full px-4 py-2 bg-gray-100 outline-none focus:border-primary focus:border border border-white text-[12px]"
                onChange={(e) => setUsername(e.target.value)}
              />
            ) : (
              <input
                type="email"
                placeholder="email"
                value={email}
                id="email"
                className="rounded-2xl w-full px-4 py-2 bg-gray-100 outline-none focus:border-primary focus:border border border-white text-[12px]"
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                id="password"
                className="rounded-2xl w-full px-4 py-2 bg-gray-100 outline-none focus:border-primary focus:border border border-white text-[12px]"
                onChange={(e) => setPassword(e.target.value)}
              />

              {showPassword ? (
                <IoEyeOutline className="absolute top-3 right-4 text-lg cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <PiEyeClosed className="absolute top-3 right-4 text-lg cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)} />
              )}
            </div>
          </div>

          {selectedLogin === 'admin' ? (
            <button
              className={`rounded-2xl p-2 ${isNotValidated2 ? "bg-gray-600" : "bg-primary-bg hover:bg-primary-hover"} w-full text-white`}
            disabled={isNotValidated2}
            >
              SIGN IN
            </button>
          ) : (
            <button
              className={`rounded-2xl p-2 ${isNotValidated ? "bg-gray-600" : "bg-primary-bg hover:bg-primary-hover"} w-full text-white`}
            // disabled={isNotValidated}
            >
              SIGN IN
            </button>
          )}

          <Link to={'/registrationwiz'} className="flex justify-center text-center hover:underline">
            New registration
          </Link>
        </form>

        <p className="text-[12px] text-center">
          By signing up, you confirm our <br />
          <span className="font-bold">Terms of Use</span> and <span className="font-bold">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default MainLogin;

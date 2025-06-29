import { useState, useContext, useEffect } from "react";

import axios from 'axios';
import { AppContext } from "../context/AppContext";
import { motion, useAnimation } from "framer-motion"; // Add useAnimation

// import { PiEyeClosed } from "react-icons/pi";
// import { IoEyeOutline } from "react-icons/io5";
import assets from "../Assets/assets";

const MainLogin = () => {
  // Define the base URL for the API from react app env file
  const baseUrl = process.env.REACT_APP_BASEURL;
  
  const { notifySuccess, notifyError, showOverlay, hideOverlay } = useContext(AppContext);
  // const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  // const [selectedLogin, setSelectedLogin] = useState(""); // State for selected role
  const [formData, setFormData] = useState({
    schoolRegistrationNumber: localStorage.getItem('regNumber') || '',
    email: '',
    password: '',
  })
  console.log(formData.schoolRegistrationNumber)
  // Animation controls for each image
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  const controls5 = useAnimation();
  const controls6 = useAnimation();

  // Set up animation sequence
  useEffect(() => {
    // Start staggered animation sequences
    const startAnimations = async () => {
      // First row animations
      controls1.start({
        scale: [1, 1.1, 1],
        filter: ["brightness(100%)", "brightness(110%)", "brightness(100%)"],
        transition: { duration: 4, repeat: Infinity, repeatType: "reverse" }
      });

      controls2.start({
        y: [0, -20, 0, 20, 0],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      });

      controls3.start({
        x: [0, 15, 0, -15, 0],
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      });

      // Second row animations
      controls4.start({
        y: [0, 20, 0, -20, 0],
        transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
      });

      controls5.start({
        scale: [1, 1.15, 1],
        rotate: [0, 2, 0, -2, 0],
        filter: ["brightness(100%)", "brightness(115%)", "brightness(100%)"],
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      });

      controls6.start({
        x: [0, -15, 0, 15, 0],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
      });
    };

    startAnimations();
  }, [controls1, controls2, controls3, controls4, controls5, controls6]);
   const handleLogin = async (e) => {
  e.preventDefault();
  showOverlay();
  try {
    if (!formData.email || !formData.password || !formData.schoolRegistrationNumber) {
      notifyError("Please fill in all fields");
      return;
    }

    console.log("Logging in with:", formData); 

    const res = await axios.post(`${baseUrl}/api/Login/Login`, formData);
    console.log(res.data);
    notifySuccess(res.data.responseMessage);

    //
  } catch (error) {
    console.error("Login error:", error);
    const message = error?.response?.data?.responseMessage || "Login failed";
    notifyError(message);
  }
  finally{
    hideOverlay();
  }
};

  // const handleRoleChange = (e) => {
  //   setSelectedLogin(e.target.value);
  // };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(`${baseUrl}/api/Login/Login`, formData);
  //     notifySuccess(res.data.responseMessage);


  //     console.log(res.data);
  //     notifySuccess(res.data.responseMessage)
  //   } catch (error) {
  //     console.error('error', error)

  //   }
  //   //   if (selectedLogin === 'teacher') {
  //   //     loginTeacher();
  //   //   } else if (selectedLogin === 'guardian') {
  //   //     loginGuardian();
  //   //   } else if (selectedLogin === 'admin') {
  //   //     loginAdmin();
  //   //   }
  //   // };

  //   // const loginAdmin = async () => {
  //   //   showOverlay();

  //   //   try {
  //   //     const res = await axios.post(`${baseUrl}/api/Admin/AdminLogin`, {
  //   //       username: username,
  //   //       password: password
  //   //     });
  //   //     notifySuccess(res.data.responseMessage);
  //   //     localStorage.setItem('adminId', res.data.data.adminId)
  //   //     localStorage.setItem('adminData', JSON.stringify(res.data.data))
  //   //     console.log("Admin login response data:", res.data.data);

  //   //     navigate('/admin/dashboard');
  //   //   } catch (err) {
  //   //     notifyError(err.response.data.responseMessage);
  //   //   } finally {
  //   //     hideOverlay();
  //   //   }
  //   // };

  //   // const loginTeacher = async () => {
  //   //   showOverlay();

  //   //   try {
  //   //     const res = await axios.post(`${baseUrl}/api/Teacher/Login`, {
  //   //       email: email,
  //   //       password: password
  //   //     });
  //   //     notifySuccess(res.data.responseMessage);

  //   //     // console.log(res.data);
  //   //     localStorage.setItem('teacherId', res.data.data.teacherId)
  //   //     localStorage.setItem('teacherData', JSON.stringify(res.data.data))
  //   //     console.log("Teacher login response data:", res.data.data);

  //   //     navigate('/teacher/dashboard');
  //   //   } catch (err) {
  //   //     notifyError(err.response.data.responseMessage);
  //   //   } finally {
  //   //     hideOverlay();
  //   //   }
  //   // };

  //   // const loginGuardian = async () => {
  //   //   showOverlay();

  //   //   try {
  //   //     const res = await axios.post(`${baseUrl}/api/Guardian/Login`, {
  //   //       email: email,
  //   //       password: password
  //   //     });

  //   //     console.log(res.data);

  //   //     if (res.data.status === true) {
  //   //       notifySuccess(res.data.responseMessage);
  //   //       navigate('/studentdata');
  //   //       localStorage.setItem('guardianId', res.data.data.guardianId);
  //   //       localStorage.setItem('guardian', JSON.stringify(res.data.data));
  //   //       hideOverlay();
  //   //     }
  //   //   } catch (err) {
  //   //     notifyError(err.response.data.responseMessage);
  //   //   } finally {
  //   //     hideOverlay();
  //   //   }
  //   // };

  //   // const isNotValidated = !email || !password || !selectedLogin;
  //   // const isNotValidated2 = !username || !password || !selectedLogin;
  // //   try {

  return (
    <div className="bg-orange-300 h-[100dvh] w-full p-2 flex gap-6 ">
      <div className="w-full md:w-[350px] bg-white h-full rounded-2xl p-6 space-y-8 items-center">
        <div>
          <div><img src={assets.scrm} alt="" width={150} /></div>

          <div className="mt-5">
            <h2 className="font-bold text-xl">WELCOME BACK</h2>
            <p className="text-sm">Please login</p>
          </div>
        </div>
        <form action="submit" onSubmit={handleLogin}>
          {/* <div className="space-y-4"> */}
          {/* <div className="flex gap-2 text-sm">
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
            </div> */}

          {/* {selectedLogin === 'admin' ? (
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
              className={`rounded-2xl p-2 ${isNotValidated2 ? "bg-gray-600" : "bg-primary-bg hover:bg-primary-hover"} w-full text-white transition duration-300`}
              disabled={isNotValidated2}
            >
              SIGN IN
            </button>
          ) : (
            <button
              className={`rounded-2xl p-2 ${isNotValidated ? "bg-gray-600" : "bg-primary-bg hover:bg-primary-hover"} w-full text-white transition duration-300`}
            >
              SIGN IN
            </button>
          )} */}
          <div className="space-y-4">

            <input
              type='email'
              placeholder="email"
              id="email"
              className="rounded-2xl w-full px-4 py-2 bg-gray-100 outline-none focus:border-primary focus:border border border-white text-[12px]" onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type='password'
              placeholder="password"
              id="password"
              className="rounded-2xl w-full px-4 py-2 bg-gray-100 outline-none focus:border-primary focus:border border border-white text-[12px]"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

          </div>
          <div className="flex justify-center">
            <button className="bg-orange-600 mt-5 hover:bg-orange-500 rounded-xl shadow-md px-10 py-2  font-semibold text-lg text-white">Sign in</button>
          </div>
        </form>

        <p className="text-[12px] text-center">
          By signing up, you confirm our <br />
          <span className="font-bold">Terms of Use</span> and <span className="font-bold">Privacy Policy</span>
        </p>
      </div>

      <div className="flex-1 md:flex justify-center items-center overflow-hidden hidden">
        <div className="w-full">
          <div className="grid grid-cols-3 gap-4">
            {/* First row */}
            <div className="overflow-hidden rounded-lg">
              <motion.div
                className="w-full h-60 rounded-lg overflow-hidden"
                animate={controls1}
                initial={{ scale: 1 }}
              >
                <img
                  src={assets.school1}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            <div className="overflow-hidden rounded-lg">
              <motion.div
                className="w-full h-60 rounded-lg overflow-hidden"
                animate={controls2}
              >
                <img
                  src={assets.school5}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            <div className="overflow-hidden rounded-lg">
              <motion.div
                className="w-full h-60 rounded-lg overflow-hidden"
                animate={controls3}
              >
                <img
                  src={assets.school3}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Second row */}
            <div className="overflow-hidden rounded-lg">
              <motion.div
                className="w-full h-60 rounded-lg overflow-hidden"
                animate={controls4}
              >
                <img
                  src={assets.school2}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            <div className="overflow-hidden rounded-lg">
              <motion.div
                className="w-full h-60 rounded-lg overflow-hidden"
                animate={controls5}
                initial={{ scale: 1, rotate: 0 }}
              >
                <img
                  src={assets.school4}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            <div className="overflow-hidden rounded-lg">
              <motion.div
                className="w-full h-60 rounded-lg overflow-hidden"
                animate={controls6}
              >
                <img
                  src={assets.school6}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLogin;
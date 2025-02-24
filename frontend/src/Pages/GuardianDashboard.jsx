import React from 'react';
import Sidebar from '../Pages/Sidebar'
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { MdIncompleteCircle } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, 
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ChevronRight } from "lucide-react";
import studentId from "../Assets/images.jpeg"

const data = [
  { week: "Monday", time: 5 },
  { week: "Tuesday", time: 6 },
  { week: "Wednesday", time: 4 },
  { week: "Thursday", time: 7 },
  { week: "Friday", time: 3 },
  { week: "Saturday", time: 8 },
  { week: "Sunday", time: 6 },
];

const pieData = [
  { name: "Incompleted", value: 40, color: "#FF0000" }, 
  { name: "Completed", value: 30, color: "#800080" }, 
  { name: "In Progress", value: 20, color: "#FFA500" }, 
];

const CenteredText = ({ viewBox }) => {
  const { cx, cy } = viewBox;
  return (
    <>
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#333">
        22
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fontSize="12" fontWeight="normal" fill="#555">
        Total Courses
      </text>
    </>
  );
};

const WeeklyBarChart = () => {
  return (
    <ResponsiveContainer width="80%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="time" fill="#ff7300" barSize={50} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ProgressCard = ({ color, title, tasks, percentage }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-lg rounded-lg w-80 mt-5">
      <div className="w-12 h-12">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textSize: "24px",
            pathColor: color,
            textColor: "#333",
            trailColor: "#E5E7EB",
          })}
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">{tasks} Tasks</p>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
};

const StudentDashboard = () => {
  const guardianData = JSON.parse(localStorage.getItem('guardian'));
  // console.log("Guardian Data",guardianData);
  return (
    <div className="flex bg-gray-100 flex-row">
       <div className='fixed'>
         <Sidebar/>
       </div>

      {/* Main Content */}
      <div className="flex-1 bg-white h-dvh px-10 ml-[220px] py-12">
        <p className="font-bold text-4xl">Welcome Back, {guardianData.data.firstname}</p>
        <p className="text-gray-700">04, October, 2022</p>
        
        <div className="flex space-x-72 items-center mt-5">
          <p className="font-bold capitalize text-xl">Time Spendings</p>
          <select className="rounded-md h-10 font-semibold border-2">
            <option>Weekly</option>
          </select>
        </div>
        
        <div className="">
          <div className='flex '>
           <div className='w-[600px]  '>
           <WeeklyBarChart />
           </div>
          <div className='flex flex-col  relative right-32 space-x-5 mt-10  w-[250px]'>
            <div className='flex items-center space-x-2'>
            <div className='bg-blue-600 flex items-center px-3 rounded-full w-[50px] h-[50px] ml-10'>
            <MdEventNote className='text-white text-4xl font-bold' />
            </div>
            <div>
              <p className='text-gray-700 font-semibold'>Hours spent</p>
              <p className='font-bold text-xl'>42</p>
            </div>
            </div>
            <div className='flex items-center mt-7 space-x-2'>
            <div className='bg-blue-600 flex items-center px-3 rounded-full w-[50px] h-[50px] ml-5'>
            <FaBookOpen className='text-white text-4xl font-bold' />

            </div>
            <div>
              <p className='text-gray-700 font-semibold'>Overall Result</p>
              <p className='font-bold text-xl'>220</p>
            </div>
            </div>
            <div className='flex items-center mt-7 space-x-2'>
            <div className='bg-blue-600 flex items-center px-3 rounded-full w-[50px] h-[50px] ml-5'>
            <MdIncompleteCircle className='text-white text-4xl font-bold' />
            </div>
            <div>
              <p className='text-gray-700 font-semibold'>Completed</p>
              <p className='font-bold text-xl'>20</p>
            </div>
            </div>
          </div>
          </div>
          
          
          <div className="flex w-[800px] mt-10">
            <div className="flex flex-col space-y-5 w-[50%]">
              <ProgressCard color="#6366F1" title="User Experience Design" tasks={12} percentage={92} />
              <ProgressCard color="#00BFFF" title="Web Development" tasks={15} percentage={85} />
            </div>

            <div className="flex    flex-col items-center">
              <h2 className="text-xl mt-6  font-bold">Course Statistics</h2>

              <div className="flex flex-col  ">
                <PieChart width={250} height={250}>
                  <Pie 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={90} 
                    fill="#8884d8" 
                    dataKey="value"
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <CenteredText viewBox={{ cx: 125, cy: 125 }} />
                </PieChart>

                <div className="flex flex-col mb-4 ml-10 space-y-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center ml-10 space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm font-semibold">{item.value}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>      
      </div>
      <div className='flex flex-col  absolute ml-[930px] border-l-2 px-10 py-5 h-[906px]   w-[360px]'>
        <div className='flex items-center space-x-32'>
          <p className='text-xl capitalize'> my profile</p>
          <FiEdit3 className='text-xl' />
        </div>
       <div className='flex flex-col items-center '>
          <div  className='bg-blue-600 h-40 w-40 shadow-md mt-10'>
              <img src={studentId} alt="" className='h-40 object-cover' />
             </div>
          <p className='text-xl font-semibold capitalize'>royal parvej</p>
          <p className='text-gray-700'>@royalparvej</p>
       </div>
       <div className='flex flex-row w-full '>
           <div className='bg-gray-100 px-5 py-3 rounded-l-md flex flex-col items-center h-20  mt-7'>
              <p className=' font-bold'>10</p>
              <p>Rank</p>
           </div>
           <div className='bg-gray-100 px-5 py-3  flex flex-col items-center h-20 w-full mt-7'>
           <p className=' font-bold'>2h</p>
              <div className='flex space-x-2 '>
              <p>Act </p>
              <p>hour</p>
              </div>
           </div>
           <div className='bg-gray-100 px-5 py-3 rounded-r-md flex flex-col items-center h-20  mt-7'>
              <p className=' font-bold'>12</p>
              <p>Enclaim </p>
           </div>   
       </div>
       <div className='flex items-center mt-5 space-x-7'>
           <FaAngleLeft />
           <p className='font-bold text-lg'>October 2022</p>
           <FaAngleRight />
           </div>
           <div className='mt-4 flex space-x-7 '>
         <div>
          <p className='font-bold'>12</p>
          <p className='text-gray-700'>Sat</p>
         </div>
         <div>
          <p className='font-bold'>12</p>
          <p className='text-gray-700'>Sun</p>
         </div>
         <div>
          <p className='font-bold'>12</p>
          <p className='text-gray-700'>Mon</p>
         </div>
         <div>
          <p className='font-bold'>12</p>
          <p className='text-gray-700'>Tue</p>
         </div>
         <div>
          <p className='font-bold'>12</p>
          <p className='text-gray-700'>Wed</p>
         </div>
      </div>
      <div>
        <p className='mt-10 text-lg capitalize font-bold'>upcomming class</p>
        <div className='flex space-x-2 mt-5 items-center '>
          <div className='h-14 w-16 border-2 px-3  py-4 rounded-md'>
            <p className='font-bold text-lg'>8:30</p>
          </div>
          <div>
            <p className='font-bold text-lg capitalize'>user experience design</p>
            <p className='text-gray-700'>online . zoom marketing</p>
          </div>
        </div>
        <div className='flex space-x-2 mt-5 items-center '>
          <div className='h-14 w-16 border-2 px-3  py-4 rounded-md'>
            <p className='font-bold text-lg'>9:30</p>
          </div>
          <div>
            <p className='font-bold text-lg capitalize'>user interface design</p>
            <p className='text-gray-700'>online . zoom marketing</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

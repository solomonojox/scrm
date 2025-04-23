// import React, { useState, useMemo, useEffect, useContext, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import { AppContext } from '../../../context/AppContext';
// import axios from 'axios';

// const BASE_URL = 'https://scrmapi.tranquility.org.ng/api';

// const StudentFeePaymentTable = ({ studentId }) => {
//   const { showOverlay, hideOverlay, formatAmount, notifyError } = useContext(AppContext);

//   const [state, setState] = useState({
//     session: 2025,
//     total: 0,
//     classroomId: 1,
//     payments: [],
//     balance: 0,
//     sessionFee: 0,
//     filterDate: '',
//   });

//   // API calls with error handling
//   const fetchData = useCallback(async (url) => {
//     showOverlay();
//     try {
//       const response = await axios.get(url);
//       return response.data.data;
//     } catch (error) {
//       notifyError(error.response?.data?.message || 'An error occurred');
//       console.error('API Error:', error);
//       return null;
//     } finally {
//       hideOverlay();
//     }
//   }, [showOverlay, hideOverlay, notifyError]);

//   // Fetch payment data
//   const fetchPayments = useCallback(async () => {
//     if (!studentId) return;
    
//     const data = await fetchData(
//       `${BASE_URL}/Payment/GetStudentPaymentForSession?studentId=${studentId}&sessionId=${state.session}`
//     );

//     if (data) {
//       setState(prev => ({
//         ...prev,
//         payments: data.payments,
//         total: data.totalPaid,
//         classroomId: data.payments[0]?.classroomId || prev.classroomId
//       }));
//     }
//   }, [studentId, state.session, fetchData]);

//   // Fetch balance
//   const fetchBalance = useCallback(async () => {
//     if (!studentId) return;

//     const data = await fetchData(
//       `${BASE_URL}/Payment/GetStudentPaymentBalance?studentId=${studentId}&sessionId=${state.session}`
//     );

//     if (data) {
//       setState(prev => ({
//         ...prev,
//         balance: data.balance
//       }));
//     }
//   }, [studentId, state.session, fetchData]);

//   // Fetch total fee
//   const fetchTotalFee = useCallback(async () => {
//     if (!studentId || !state.classroomId) return;

//     const data = await fetchData(
//       `${BASE_URL}/Classroom/GetClassSchoolFee?classroomId=${state.classroomId}&sessionId=${state.session}`
//     );

//     if (data) {
//       setState(prev => ({
//         ...prev,
//         sessionFee: data
//       }));
//     }
//   }, [studentId, state.classroomId, state.session, fetchData]);

//   // Initial data load
//   useEffect(() => {
//     const loadAllData = async () => {
//       await Promise.all([
//         fetchPayments(),
//         fetchBalance(),
//         fetchTotalFee()
//       ]);
//     };

//     loadAllData();
//   }, [fetchPayments, fetchBalance, fetchTotalFee]);

//   // Memoized values
//   const uniquePaymentDates = useMemo(() => (
//     [...new Set(state.payments.map(payment =>
//       new Date(payment.paymentDate).toISOString().split('T')[0]
//     ))].sort().reverse()
//   ), [state.payments]);

//   const filteredPayments = useMemo(() => (
//     !state.filterDate 
//       ? state.payments 
//       : state.payments.filter(payment =>
//           new Date(payment.paymentDate).toISOString().split('T')[0] === state.filterDate
//         )
//   ), [state.payments, state.filterDate]);

//   // Event handlers
//   const handleSessionChange = (e) => {
//     const newSession = Number(e.target.value);
//     setState(prev => ({ ...prev, session: newSession }));
//   };

//   const handleDateFilter = (e) => {
//     setState(prev => ({ ...prev, filterDate: e.target.value }));
//   };

//   const handleViewDetails = (paymentId) => {
//     // Implement view details logic
//     console.log('View payment details', paymentId);
//   };

//   const handleGenerateReceipt = (paymentId) => {
//     // Implement receipt generation logic
//     console.log('Generate receipt for', paymentId);
//   };

//   // Render helper components
//   const renderSummaryCard = (title, amount, colorScheme) => (
//     <div className={`bg-${colorScheme}-50 p-3 rounded-lg`}>
//       <p className={`text-sm text-${colorScheme}-600`}>{title}</p>
//       <p className={`text-xl font-semibold text-${colorScheme}-800`}>
//         ₦{formatAmount(amount || 0)}
//       </p>
//     </div>
//   );

//   return (
//     <div className="w-full">
//       {/* Filter Controls */}
//       <div className="mb-4 p-4 bg-white rounded-lg shadow">
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           <h2 className="text-xl font-semibold text-gray-800">Fee Payment Records</h2>
          
//           {/* Session Filter */}
//           <div className="flex items-center gap-2">
//             <label htmlFor="sessionFilter" className="text-sm font-medium text-gray-700">
//               Filter by Session:
//             </label>
//             <select
//               id="sessionFilter"
//               value={state.session}
//               onChange={handleSessionChange}
//               className="rounded-md border shadow-sm focus:border-indigo-500 outline-none focus:ring-opacity-50 w-[150px]"
//             >
//               {[2025, 2026].map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           {/* Date Filter */}
//           <div className="flex items-center gap-2">
//             <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">
//               Filter by Payment Date:
//             </label>
//             <select
//               id="dateFilter"
//               value={state.filterDate}
//               onChange={handleDateFilter}
//               className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             >
//               <option value="">All Dates</option>
//               {uniquePaymentDates.map(date => (
//                 <option key={date} value={date}>
//                   {new Date(date).toLocaleDateString()}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Payments Table */}
//       <div className="overflow-x-auto rounded-lg shadow">
//         <table className="min-w-full divide-y divide-gray-200 bg-white">
//           <thead className="bg-gray-50">
//             <tr>
//               {['Payment Date', 'Amount Paid', 'Total Paid', 'Balance', 'Actions'].map(header => (
//                 <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredPayments.length > 0 ? (
//               filteredPayments.map(payment => (
//                 <tr key={payment.paymentId} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(payment.paymentDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ₦{formatAmount(payment.amount)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ₦{formatAmount(payment.totalPaid)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       payment.balance <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       ₦{formatAmount(payment.balance)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button
//                         className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
//                         onClick={() => handleViewDetails(payment.paymentId)}
//                       >
//                         View
//                       </button>
//                       <button
//                         className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded"
//                         onClick={() => handleGenerateReceipt(payment.paymentId)}
//                       >
//                         Receipt
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                   No payment records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Summary Section */}
//       <div className="mt-4 p-4 bg-white rounded-lg shadow">
//         <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Summary</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {renderSummaryCard('Total Amount For Session', state.sessionFee, 'blue')}
//           {renderSummaryCard('Total Amount', state.total, 'green')}
//           {renderSummaryCard('Current Balance', state.balance, 'red')}
//         </div>
//       </div>
//     </div>
//   );
// };

// StudentFeePaymentTable.propTypes = {
//   studentId: PropTypes.string.isRequired,
// };

// export default StudentFeePaymentTable;


import React, { useState, useMemo, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BASEURL
const StudentFeePaymentTable = ({ studentId }) => {
  const { showOverlay, hideOverlay, formatAmount } = useContext(AppContext);

  const [session, setSession] = useState(2025);
  const [total, setTotal] = useState(0);
  const [classroomId, setClassroomId] = useState(1);
  const [payments, setPayments] = useState([]);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const getPayment = async () => {
      showOverlay()
      try {
        const res = await axios.get(`${baseUrl}/api/Payment/GetStudentPaymentForSession?studentId=${studentId}&sessionId=${session}`)

        console.log('Payments', res.data.data)
        setPayments(res.data.data.payments)
        setTotal(res.data.data.totalPaid)
        setClassroomId(res.data.data.payments[0].classroomId)
      } catch (err) {
        console.log(err.response)
      } finally {
        hideOverlay()
      }
    }

    if (studentId) {
      getPayment()
    }
  }, [studentId, showOverlay, hideOverlay, trigger, session])

  const [balance, setBalance] = useState(0);

  const getBalance = useCallback(async () => {
    if (!studentId) return;

    showOverlay();
    try {
      const res = await axios.get(
        `${baseUrl}/api/Payment/GetStudentPaymentBalance?studentId=${studentId}&sessionId=${session}`
      );

      console.log(res.data.data);
      setBalance(res.data.data.balance);
    } catch (err) {
      console.log(err.response);
    } finally {
      hideOverlay();
    }
  }, [studentId, session, hideOverlay, showOverlay]);

  const [sessionFee, setSessionFee] = useState(0);
  const getTotalFee = useCallback(async () => {
    if (!studentId) return;

    showOverlay();
    try {
      const res = await axios.get(
        `${baseUrl}/api/Classroom/GetClassSchoolFee?classroomId=${classroomId}&sessionId=${session}`
      );

      console.log(res.data.data);
      setSessionFee(res.data.data);
    } catch (err) {
      console.log(err.response);
    } finally {
      hideOverlay();
    }
  }, [studentId, session, hideOverlay, showOverlay, classroomId]);

  useEffect(() => {
    getBalance();
    getTotalFee();
  }, [studentId, getBalance, getTotalFee]);

  const handleTrigger = (e) => {
    setSession(e.target.value)
    setTrigger(!trigger)
  }

  const [filterDate, setFilterDate] = useState('');

  // Get unique payment dates for filter dropdown
  const uniquePaymentDates = useMemo(() => {
    const dates = [...new Set(payments.map(payment =>
      new Date(payment.paymentDate).toISOString().split('T')[0]
    ))];
    return dates.sort().reverse(); // Most recent dates first
  }, [payments]);

  // Filter payments based on paymentDate filter
  const filteredPayments = useMemo(() => {
    if (!filterDate) return payments;
    const dateFilter = filterDate.split('T')[0]; // Handle ISO string format if present
    return payments.filter(payment =>
      new Date(payment.paymentDate).toISOString().split('T')[0] === dateFilter
    );
  }, [payments, filterDate]);

  return (
    <div className="w-full">
      <button onClick={handleTrigger}>Click me</button>
      {/* Filter Controls */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Fee Payment Records</h2>
          <div className="flex items-center gap-2">
            <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">
              Filter by Session:
            </label>
            <select
              id="dateFilter"
              // value={session}
              onChange={handleTrigger}
              className="rounded-md border shadow-sm focus:border-indigo-500 outline-none focus:ring-opacity-50 w-[150px]"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">
              Filter by Payment Date:
            </label>
            <select
              id="dateFilter"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">All Dates</option>
              {uniquePaymentDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount Paid
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Paid
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.paymentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₦{formatAmount(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₦{formatAmount(payment.totalPaid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${payment.balance <= 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'}`}>
                      ₦{formatAmount(payment.balance)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                        onClick={() => console.log('View payment details', payment.paymentId)}
                      >
                        View
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded"
                        onClick={() => console.log('Receipt for', payment.paymentId)}
                      >
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No payment records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">Total Amount For session</p>
            <p className="text-xl font-semibold text-blue-800">
              ₦{formatAmount(sessionFee) || 0.00}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600">Total Amount</p>
            <p className="text-xl font-semibold text-green-800">
              {/* ₦{formatAmount(filteredPayments.reduce((sum, payment) => sum + payment.amount, 0))} */}
              ₦{formatAmount(total || 0.00)}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-600">Current Balance</p>
            <p className="text-xl font-semibold text-red-800">
              ₦{formatAmount(balance) || 0.00}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeePaymentTable;
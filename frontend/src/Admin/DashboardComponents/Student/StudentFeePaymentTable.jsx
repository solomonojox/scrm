import React, { useState, useMemo, useEffect, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';

const StudentFeePaymentTable = ({ studentId }) => {
  const { showOverlay, hideOverlay } = useContext(AppContext);

  const [payments, setPayments] = useState([])
  useEffect(() => {
    const getPayment = async () => {
      showOverlay()
      try {
        const res = await axios.get(`https://scrmapi.tranquility.org.ng/api/Payment/GetStudentPaymentForSession?studentId=${studentId}&sessionId=2025`)

        console.log(res.data)
        setPayments(res.data.data)
      } catch (err) {
        console.log(err.response)
      } finally {
        hideOverlay()
      }
    }

    if (studentId) {
      getPayment()
    }
  })
  
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
      {/* Filter Controls */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Fee Payment Records</h2>
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
                    ₦{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₦{payment.totalPaid.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${payment.balance <= 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'}`}>
                      ₦{payment.balance.toLocaleString()}
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
      {filteredPayments.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">Total Amount for Selected Period</p>
              <p className="text-xl font-semibold text-blue-800">
                ₦{filteredPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Total Amount Paid</p>
              <p className="text-xl font-semibold text-green-800">
                ₦{filteredPayments[0]?.totalPaid.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600">Current Balance</p>
              <p className="text-xl font-semibold text-red-800">
                ₦{filteredPayments[0]?.balance.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFeePaymentTable;

// Example usage:
// <StudentFeePaymentTable payments={paymentsData} />
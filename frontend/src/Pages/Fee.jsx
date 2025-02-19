import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Fee = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar Container */}
      <div className="w-full md:w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 space-y-6 font-sans">
        {/* Top Section */}
        <div>
          <div className="text-gray-700 text-xl font-semibold">2 Pupils Found</div>
          <p className="text-gray-700 mt-4">Please click on the student names to view fees</p>
        </div>

        {/* Student Info & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center space-x-4">
            <span
              onClick={() => setSelectedStudent('bolu')}
              className={`font-medium bg-gray-100 rounded-md py-2 px-5 w-[150px] h-10 flex items-center justify-center cursor-pointer ${
                selectedStudent === 'bolu' ? 'bg-blue-200' : ''
              }`}
            >
              Ademola Bolu
            </span>
            <span
              onClick={() => setSelectedStudent('david')}
              className={`font-medium bg-gray-100 rounded-md py-2 px-5 w-[200px] h-10 flex items-center justify-center cursor-pointer ${
                selectedStudent === 'david' ? 'bg-blue-200' : ''
              }`}
            >
              Ademola David
            </span>
          </div>
        </div>

        {/* Conditionally Render Cards for Selected Student */}
        {selectedStudent === 'bolu' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* School Fees Card for Ademola Bolu */}
            <div className="border rounded-md p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">School Fees</h2>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Classroom: <span className="font-medium">5A</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Session: <span className="font-medium">2024/2025</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment Term: <span className="font-medium">Term 1</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: <span className="font-medium">₦50,000</span>
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between border-t -mx-4 px-4">
                <span className="text-green-600 text-sm font-semibold">Paid</span>
                <button className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900">
                  View Receipt
                </button>
              </div>
            </div>

            {/* Books Card for Ademola Bolu */}
            <div className="border rounded-md p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Books</h2>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Book Titles: <span className="font-medium">Mathematics, English, Science</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Number of Books: <span className="font-medium">3</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Classroom: <span className="font-medium">5A</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Session: <span className="font-medium">2024/2025</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment Term: <span className="font-medium">Term 1</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: <span className="font-medium">₦12,000</span>
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between border-t -mx-4 px-4">
                <span className="text-red-600 text-sm font-semibold">Pending</span>
                <button className="px-4 py-2 text-sm border border-black text-black rounded-md hover:bg-gray-50">
                  Pay Now
                </button>
              </div>
            </div>

            {/* Uniform Fees Card for Ademola Bolu */}
            <div className="border rounded-md p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Uniform Fees</h2>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Uniform Details: <span className="font-medium">Shirt, Trousers, Tie</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Classroom: <span className="font-medium">5A</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Session: <span className="font-medium">2024/2025</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment Term: <span className="font-medium">Term 1</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: <span className="font-medium">₦8,000</span>
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between border-t -mx-4 px-4">
                <span className="text-green-600 text-sm font-semibold">Paid</span>
                <button className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900">
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedStudent === 'david' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* School Fees Card for Ademola David */}
            <div className="border rounded-md p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">School Fees</h2>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Classroom: <span className="font-medium">6B</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Session: <span className="font-medium">2024/2025</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment Term: <span className="font-medium">Term 1</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: <span className="font-medium">₦60,000</span>
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between border-t -mx-4 px-4">
                <span className="text-red-600 text-sm font-semibold">Pending</span>
                <button className="px-4 py-2 text-sm border border-black text-black rounded-md hover:bg-gray-50">
                  Pay Now
                </button>
              </div>
            </div>

            {/* Books Card for Ademola David */}
            <div className="border rounded-md p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Books</h2>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Book Titles: <span className="font-medium">History, Geography</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Number of Books: <span className="font-medium">2</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Classroom: <span className="font-medium">6B</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Session: <span className="font-medium">2024/2025</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment Term: <span className="font-medium">Term 1</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: <span className="font-medium">₦15,000</span>
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between border-t -mx-4 px-4">
                <span className="text-green-600 text-sm font-semibold">Paid</span>
                <button className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900">
                  View Receipt
                </button>
              </div>
            </div>

            {/* Uniform Fees Card for Ademola David */}
            <div className="border rounded-md p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Uniform Fees</h2>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Uniform Details: <span className="font-medium">Polo, Shorts</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Classroom: <span className="font-medium">6B</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Session: <span className="font-medium">2024/2025</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment Term: <span className="font-medium">Term 1</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: <span className="font-medium">₦9,000</span>
                  </p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between border-t -mx-4 px-4">
                <span className="text-red-600 text-sm font-semibold">Pending</span>
                <button className="px-4 py-2 text-sm border border-black text-black rounded-md hover:bg-gray-50">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fee;

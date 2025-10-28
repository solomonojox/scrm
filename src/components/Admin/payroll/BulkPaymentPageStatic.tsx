interface BulkPaymentPageStaticProps {
  onBack: () => void;
}
const BulkPaymentPageStatic = ({ onBack }: BulkPaymentPageStaticProps) => {
  return (
    <div className="py-8 px-4">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:underline text-sm"
        >
          &larr; Back
        </button>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-8">
          {/* Icon */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Payment History
          </h2>

          {/* Description */}
          <p className="text-gray-500 mb-6 max-w-md">
            The payment history feature is currently under development.
            We're working hard to bring you a comprehensive view of all payroll transactions.
          </p>

          {/* Coming Soon Badge */}
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
    // <div className="min-h-screen bg-white p-6">
    //   <div className="mb-4">
    //     <button
    //       onClick={onBack}
    //       className="text-gray-600 hover:underline text-sm"
    //     >
    //       &larr; Back
    //     </button>
    //   </div>

    //   <section className="border-0">
    //     <div className="bg-[#124A71] w-full text-white rounded-lg overflow-hidden shadow-md">
    //       <div className="flex justify-between p-4 items-center text-sm">
    //         <p>No 1111111</p>
    //         <div className="text-center">
    //           <p className="font-semibold text-xl">Gold International Academy</p>
    //           <p className="text-center text-xs">Lorem ipsum dolor sit amet</p>
    //         </div>
    //         <p className="text-red-400 text-xs -mt-3">
    //           Lorem ipsum dolor sit amet consectet
    //         </p>
    //       </div>

    //       <nav className="-ml-45 py-2">
    //         <h1 className="text-2xl text-center font-semibold">
    //           Total: N1,400,000.00
    //         </h1>
    //       </nav>

    //       <div className="flex justify-between p-4 text-xs">
    //         <div>Term: First Term</div>
    //         <div className="text-center">Date: 25th Oct, 2025</div>
    //         <div>Session: 2024/2025</div>
    //       </div>
    //     </div>

    //     <section className="flex flex-col lg:flex-row justify-between border-t-2 border-black mt-6 gap-6">
    //       {/* Staff ID column */}
    //       <div id="staff-id" className="w-full lg:w-1/4">
    //         <div className="bg-indigo-500 p-2 w-full text-center text-white rounded text-sm">
    //           Staff ID
    //         </div>
    //         <div className="flex flex-col items-center justify-center gap-2 mt-4 text-sm">
    //           {Array.from({ length: 11 }).map((_, i) => (
    //             <p key={i} className="w-full text-center py-2 text-gray-700">
    //               fdgshkjl
    //             </p>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Beneficiary column */}
    //       <div id="Beneficiary" className="w-full lg:w-1/3">
    //         <div className="bg-indigo-500 p-2 w-full text-center text-white rounded text-sm">
    //           Beneficiary
    //         </div>
    //         <div className="flex flex-col gap-2 mt-3">
    //           {Array.from({ length: 11 }).map((_, i) => (
    //             <input
    //               key={i}
    //               type="text"
    //               className="border rounded-sm text-center py-2 text-sm"
    //               placeholder="open Math"
    //             />
    //           ))}
    //         </div>
    //       </div>

    //       {/* Amount column */}
    //       <div id="Amount" className="w-full lg:w-1/4">
    //         <div className="bg-indigo-500 p-2 w-full text-white rounded text-sm text-center">
    //           Amount
    //         </div>
    //         <div className="flex flex-col px-2 gap-2 mt-2">
    //           {Array.from({ length: 11 }).map((_, i) => (
    //             <input
    //               key={i}
    //               type="text"
    //               placeholder="N150,000"
    //               className="border py-2 rounded-sm w-full text-sm text-center"
    //             />
    //           ))}
    //         </div>
    //       </div>
    //     </section>

    //     <p className="border-4 ml-18 border-indigo-700 mt-4"></p>

    //     <section className="flex flex-col lg:flex-row justify-between gap-6 mt-4">
    //       <div className="flex flex-col gap-2 w-full lg:w-1/3 text-sm">
    //         <p className="px-18 mt-3">Ojone</p>
    //         <p className="px-18 mt-3">Ojone</p>
    //         <p className="px-18 mt-3">Ojone</p>
    //       </div>

    //       <div className="flex flex-col gap-2 mt-3 w-full lg:w-1/3">
    //         <input
    //           type="text"
    //           className="border rounded-sm text-center py-2 text-sm"
    //           placeholder="open Math"
    //         />
    //         <input
    //           type="text"
    //           className="border rounded-sm text-center py-2 text-sm"
    //           placeholder="open Math"
    //         />
    //         <input
    //           type="text"
    //           className="border rounded-sm text-center py-2 text-sm"
    //           placeholder="open Math"
    //         />
    //       </div>

    //       <div className="flex flex-col px-2 gap-2 mt-2 w-full lg:w-1/3">
    //         <input
    //           type="text"
    //           placeholder="N150,000"
    //           className="border py-2 rounded-sm w-full text-sm text-center"
    //         />
    //         <input
    //           type="text"
    //           placeholder="N150,000"
    //           className="border py-2 rounded-sm w-full text-sm text-center"
    //         />
    //         <input
    //           type="text"
    //           placeholder="N150,000"
    //           className="border py-2 rounded-sm w-full text-sm text-center"
    //         />
    //       </div>
    //     </section>

    //     <p className="border-4 ml-18 border-indigo-700 mt-4 mb-4"></p>

    //     <section className="flex flex-col lg:flex-row justify-between gap-6 text-sm">
    //       <div className="flex flex-col gap-2 w-full lg:w-1/3">
    //         <p className="px-18 mt-3">Ojone</p>
    //         <p className="px-18 mt-3">Ojone</p>
    //         <p className="px-18 mt-3 text-yellow-600">Ojone</p>
    //       </div>

    //       <div className="flex flex-col gap-2 mt-3 w-full lg:w-1/3">
    //         <input
    //           type="text"
    //           className="border rounded-sm text-center py-2 text-sm"
    //           placeholder="open Math"
    //         />
    //         <input
    //           type="text"
    //           className="border rounded-sm text-center py-2 text-sm"
    //           placeholder="open Math"
    //         />
    //       </div>

    //       <div className="flex flex-col px-2 gap-2 mt-2 w-full lg:w-1/3">
    //         <input
    //           type="text"
    //           placeholder="N150,000"
    //           className="border py-2 rounded-sm w-full text-sm text-center"
    //         />
    //         <input
    //           type="text"
    //           placeholder="N150,000"
    //           className="border py-2 rounded-sm w-full text-sm text-center"
    //         />
    //         <input
    //           type="text"
    //           placeholder="N150,000"
    //           className="border py-2 rounded-sm w-full text-sm text-center text-yellow-600"
    //         />
    //       </div>
    //     </section>
    //   </section>

    //   <div className="flex space-x-4 p-4 justify-center mt-6">
    //     <button className="bg-orange-600 h-11 px-8 rounded text-white text-lg">
    //       Confirm Payment
    //     </button>
    //     <button
    //       onClick={onBack}
    //       className="bg-gray-400 h-11 px-8 rounded text-white text-lg"
    //     >
    //       Cancel
    //     </button>
    //   </div>
    // </div>
  );
};

export default BulkPaymentPageStatic;
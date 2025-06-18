import React from 'react';

const AddStudent = ({ nextStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    nextStep(); // Move to the next step (admin page)
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white pl-1 pt-1 w-full max-w-3xl space-y-6">
        <div>
          <label htmlFor="Name" className="block mb-2 text-lg font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="OwnerName"
            name="OwnerName"
            placeholder="Enter owner's name"
            className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
          />
        </div>

        <div>
          <label htmlFor="Phone" className="block mb-2 text-lg font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="OwnerPhone"
            name="OwnerPhone"
            placeholder="Enter owner's phone number"
            className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
          />
        </div>

        <div>
          <label htmlFor="Email" className="block mb-2 text-lg font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="OwnerEmail"
            name="OwnerEmail"
            placeholder="Enter owner's email"
            className="w-full p-4 border rounded-md outline-none focus:border-primary text-base"
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-12 rounded-lg transition duration-300"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;

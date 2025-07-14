import React, { useRef, useState } from 'react';
import {
  faArrowLeft,
  faFileAlt,
  faFilePdf,
  faTrash,
  faCheckCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RegistrationForm = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = () => {
    // Simulate save action
    console.log('Saving files:', files);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen font-['Inter'] bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-5 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-orange-700 tracking-wide">EduCat</h1>
        <nav className="space-x-6 text-sm font-semibold text-gray-700">
          <a href="#" className="hover:text-orange-700 transition">Home</a>
          <a href="#" className="hover:text-orange-700 transition">Contact</a>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-5xl rounded-xl p-10 relative shadow-lg">
          {/* Back arrow */}
          <button
            aria-label="Go back"
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 text-lg"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          {/* Title */}
          <h2 className="text-center font-black text-2xl md:text-3xl text-gray-800">
            Registration Form
          </h2>
          <p className="text-center mt-2 text-sm md:text-base italic text-orange-600 font-semibold">
            Fill out the form below to get your school started{' '}
            <span className="font-normal">with</span>{' '}
            <span className="font-semibold">EduCat.</span>
          </p>
          <p className="text-center mt-1 text-[10px] text-gray-500 font-normal">
            Note: Complete each section before moving to the next.
          </p>

          {/* Progress bar */}
          <div className="mt-6 w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div className="h-2 bg-green-700 w-1/2 transition-all" />
          </div>

          {/* Tabs */}
          <nav className="mt-6 flex space-x-6 text-sm font-bold text-orange-700 justify-center uppercase">
            <button className="hover:underline">Add School</button>
            <button className="underline">Upload School License</button>
            <button className="hover:underline">Add Admin</button>
          </nav>

          {/* Upload section */}
          <div className="mt-8 flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
            {/* Upload Box */}
            <div
              className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg w-full md:w-1/3 h-44 cursor-pointer hover:border-orange-500 transition"
              role="button"
              tabIndex={0}
              onClick={handleBrowseClick}
            >
              <img
                alt="Upload"
                className="mb-3"
                draggable="false"
                src="https://storage.googleapis.com/a1aa/image/fe76c44b-fb63-4c81-72a8-e7a2ef9efb17.jpg"
                width={48}
                height={48}
              />
              <p className="text-center text-sm text-gray-600 mb-2 font-medium">Drag files here</p>
              <button
                className="bg-blue-700 text-white text-sm font-bold rounded px-4 py-1 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                type="button"
              >
                Browse
              </button>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* File List */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg w-full md:w-2/3 p-4">
              <p className="text-sm font-bold text-gray-800 mb-4">Uploaded Files</p>

              {files.length === 0 && (
                <p className="text-sm text-gray-500 italic">No files uploaded yet.</p>
              )}

              {files.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-3 bg-white p-2 rounded shadow-sm">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {item.url ? (
                      <img
                        src={item.url}
                        alt={item.file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : item.file.type.includes('pdf') ? (
                      <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-lg" />
                    ) : (
                      <FontAwesomeIcon icon={faFileAlt} className="text-gray-800 text-lg" />
                    )}
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                      {item.file.name}
                    </span>
                    <div className="w-36 h-2 bg-gray-300 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span>{(item.file.size / (1024 * 1024)).toFixed(1)}MB</span>
                    <button
                      aria-label={`Remove ${item.file.name}`}
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded shadow-md transition"
            >
              Save
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center text-xs text-gray-500 py-4 border-t mt-10">
        © {new Date().getFullYear()} <span className="font-semibold">EduCat</span>. All rights reserved.
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-4xl mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Saved Successfully</h3>
            <p className="text-sm text-gray-600 mb-4">Your form has been saved.</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;

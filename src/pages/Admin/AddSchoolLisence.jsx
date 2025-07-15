import React, { useRef, useState } from 'react';
import {
  faArrowLeft,
  faFileAlt,
  faFilePdf,
  faTrash,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Styles/loader.css'; 
import Header from '../Header';

const RegistrationForm = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Open the hidden file input
  const triggerFileDialog = () => fileInputRef.current?.click();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const mapped = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setFiles((prev) => [...prev, ...mapped]);
    e.target.value = ''; // reset input so the same file can be selected again
  };

  // Remove file from the list
  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Simulate save action
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowModal(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen font-['Inter'] bg-gray-100 relative">
      {/* Loader */}
      {saving && (
        <div className="loaderwrapper">
          <div className="loader" />
        </div>
      )}

      <Header />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-5xl rounded-xl p-10 relative shadow-lg">
          {/* Back */}
          <button
            type="button"
            onClick={() => window.history.back()}
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
            <span className="font-semibold">EduCat</span>.
          </p>
          <p className="text-center mt-1 text-[10px] text-gray-500 font-normal">
            Note: Complete each section before moving to the next.
          </p>

          {/* Progress */}
          <div className="mt-6 w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div className="h-2 bg-green-700 w-1/2 transition-all" />
          </div>

          {/* Tabs */}
          <nav className="mt-6 flex space-x-6 text-sm font-bold text-orange-700 justify-center uppercase">
            <button type="button" className="hover:underline">Add School</button>
            <button type="button" className="underline">Upload School License</button>
            <button type="button" className="hover:underline">Add Admin</button>
          </nav>

          {/* Upload */}
          <div className="mt-8 flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
            {/* Dropzone */}
            <div
              className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg w-full md:w-1/3 h-44 cursor-pointer hover:border-orange-500 transition"
              role="button"
              tabIndex={0}
              onClick={triggerFileDialog}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerFileDialog()}
            >
              <img
                alt="Upload"
                className="mb-3 pointer-events-none"
                draggable="false"
                src="https://storage.googleapis.com/a1aa/image/fe76c44b-fb63-4c81-72a8-e7a2ef9efb17.jpg"
                width={48}
                height={48}
              />
              <p className="text-center text-sm text-gray-600 mb-2 font-medium">Drag files here</p>
              <button
                type="button"
                onClick={triggerFileDialog}
                className="bg-blue-700 text-white text-sm font-bold rounded px-4 py-1 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                Browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Files */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg w-full md:w-2/3 p-4">
              <p className="text-sm font-bold text-gray-800 mb-4">Uploaded Files</p>

              {files.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No files uploaded yet.</p>
              ) : (
                files.map(({ id, file, preview }) => (
                  <div
                    key={id}
                    className="flex items-center justify-between mb-3 bg-white p-2 rounded shadow-sm"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {preview ? (
                        <img
                          src={preview}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : file.type === 'application/pdf' ? (
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="text-red-600 text-lg"
                          aria-label="PDF file"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          className="text-gray-800 text-lg"
                          aria-label="File"
                        />
                      )}

                      <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                        {file.name}
                      </span>

                      <div className="w-36 h-2 bg-gray-300 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full w-full" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                      <button
                        type="button"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => handleDelete(id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded shadow-md transition ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-600 text-4xl mb-4"
              aria-hidden="true"
            />
            <h3 className="text-lg font-bold mb-2">Files saved successfully!</h3>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white text-center text-xs text-gray-500 py-4 border-t mt-10">
        © {new Date().getFullYear()} <span className="font-semibold">EduCat</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default RegistrationForm;

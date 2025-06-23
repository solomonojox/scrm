import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import { motion } from 'framer-motion';

const baseUrl = process.env.REACT_APP_BASEURL;

const AddDocument = ({ nextStep }) => {
  const { notifySuccess, notifyError, showOverlay, hideOverlay } = useContext(AppContext);
  const [schoolId, setSchoolId] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem('schoolId');
    if (storedId) {
      setSchoolId(storedId);
      console.log('Retrieved schoolId:', storedId);
    } else {
      console.warn('No schoolId in localStorage. User may need to register first.');
    }
  }, []);

  // Handle file selection (via click or drop)
  const handleFileChange = useCallback((selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      notifyError && notifyError('Invalid file format. Only PDF or Word allowed.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    console.log('Selected file:', selectedFile.name);
  }, [notifyError]);

  const onInputChange = (e) => {
    const selected = e.target.files[0];
    handleFileChange(selected);
  };

  // Drag events
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    handleFileChange(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;

    if (!schoolId) {
      notifyError && notifyError('No schoolId found. Please register the school first.');
      return;
    }
    if (!file) {
      notifyError && notifyError('Please select a PDF or Word document to upload.');
      return;
    }

    showOverlay && showOverlay();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadUrl = `${baseUrl}/api/School/UploadDocument/${schoolId}`;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const res = await axios.post(uploadUrl, formData, config);
      console.log('Upload response:', res.data);
      if (res.data && res.data.success !== false) {
        notifySuccess && notifySuccess('Document uploaded successfully.');
        nextStep && nextStep();
      } else {
        const msg = res.data.message || 'Upload failed on server side.';
        notifyError && notifyError(msg);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const serverMsg = error.response?.data?.message;
      notifyError && notifyError(serverMsg || 'Something went wrong during upload.');
    } finally {
      hideOverlay && hideOverlay();
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Upload Document</h2>

        {!schoolId && (
          <p className="text-center text-red-500">
            No school ID found. Please complete school registration first.
          </p>
        )}

        {/* Drag-and-drop / click-to-select area */}
        <div
          className={`relative border-2 ${
            dragActive ? 'border-orange-500 bg-orange-50' : 'border-dashed border-gray-300'
          } rounded-lg p-6 text-center transition-colors`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            id="fileInput"
            name="fileInput"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-12 w-12 mb-2 ${
                dragActive ? 'text-orange-500' : 'text-gray-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16v-4m0 0l-3 3m3-3l3 3m6-3v4m0 0l3-3m-3 3l-3-3M12 12V4m0 0l-3 3m3-3l3 3"
              />
            </svg>
            <p className={`${dragActive ? 'text-orange-600' : 'text-gray-500'}`}>
              {file ? (
                <span className="font-medium text-gray-700">
                  Selected: <span className="text-orange-600">{file.name}</span>
                </span>
              ) : (
                <>Drag & drop here, or click to select a PDF/Word file</>
              )}
            </p>
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="mt-2 text-sm text-red-500 hover:underline pointer-events-auto"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Upload button */}
        <div className="flex justify-center mt-4">
          <motion.button
            type="submit"
            disabled={!schoolId || uploading || !file}
            whileHover={uploading || !file ? {} : { scale: 1.05 }}
            whileTap={uploading || !file ? {} : { scale: 0.95 }}
            className={`flex items-center justify-center font-medium py-3 px-8 rounded-xl text-md shadow-md transition-colors
              ${
                !schoolId || uploading || !file
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
              }
            `}
          >
            {uploading ? (
              <>
                {/* Simple spinner */}
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddDocument;

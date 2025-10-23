import React, { useRef, useState } from 'react';
import axios from 'axios';
import {
  faArrowLeft,
  faFileAlt,
  faFilePdf,
  faTrash,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import '../../Styles/loader.css';
import Header from '../Header';
import Footer from '../Footer';

const AddSchoolLicense = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const schoolId = localStorage.getItem('schoolIdOnRegistration');
  if (!schoolId) {
    console.error('No schoolId found in localStorage');
  }

  const triggerFileDialog = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const mapped = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));
    setFiles((prev) => [...prev, ...mapped]);
    e.target.value = '';
  };

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    if (!files.length) {
      setError('Please select at least one file.');
      return;
    }
    if (!schoolId) {
      setError('Missing school ID. Please complete the previous step.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(({ file }) => {
        formData.append('file', file);
      });

      const response = await axios.post(
        `${baseUrl}/api/School/UploadDocument/${schoolId}`,
        formData
      );

      console.log('Upload success:', response.data);
      localStorage.setItem("continueRegistration", 'account-registration');
      setShowModal(true);
      setFiles([]);
      navigate('/account-registration');
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
      const msg = err.response?.data?.message || err.message;
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-[Inter] bg-gray-100 relative">
      {saving && (
        <div className="loaderwrapper z-50">
          <div className="loader scale-125" />
        </div>
      )}

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-5xl rounded-xl p-10 relative shadow-lg">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 text-lg"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <h2 className="text-center font-black text-2xl md:text-3xl text-gray-800">
            Upload School License
          </h2>

          <p className="text-center mt-2 text-sm italic text-orange-600 font-semibold">
            Upload documents to continue with <span className="font-bold">EduCat</span>
          </p>

          <div className="mt-6 w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div className="h-2 bg-green-700 w-1/2 transition-all" />
          </div>

          <nav className="mt-6 flex space-x-6 text-sm font-bold text-orange-700 justify-center uppercase">
            <Link to="/add-school-form" className="hover:underline">Add School</Link>
            <Link to="/upload-license" className="underline">Upload School License</Link>
            <Link to="/account-registration" className="hover:underline">Add Account details</Link>
            <Link to="/add-admin" className="hover:underline">Add School Admin</Link>
          </nav>

          <div className="mt-8 flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
            <div
              role="button"
              tabIndex={0}
              onClick={triggerFileDialog}
              onKeyDown={(e) => ['Enter', ' '].includes(e.key) && triggerFileDialog()}
              className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg w-full md:w-1/3 h-44 cursor-pointer hover:border-orange-500 transition"
            >
              <img
                src="https://storage.googleapis.com/a1aa/image/fe76c44b-fb63-4c81-72a8-e7a2ef9efb17.jpg"
                alt="Upload"
                width={48}
                height={48}
                draggable="false"
                className="mb-3 pointer-events-none"
              />
              <p className="text-sm text-gray-600 mb-2 font-medium">Drag or browse files</p>
              <button
                type="button"
                className="bg-blue-700 text-white text-sm font-bold rounded px-4 py-1 hover:bg-blue-800"
              >
                Browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept='application/pdf'
                name="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

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
                        <img src={preview} alt={file.name} className="w-10 h-10 object-cover rounded" />
                      ) : file.type === 'application/pdf' ? (
                        <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-lg" />
                      ) : (
                        <FontAwesomeIcon icon={faFileAlt} className="text-gray-800 text-lg" />
                      )}
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>{(file.size / (1024 * 1024)).toFixed(1)}MB</span>
                      <button
                        type="button"
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

          {error && <p className="text-red-600 mt-4 text-sm font-medium">⚠️ {error}</p>}

          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded shadow-md transition ${saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-4xl mb-4" />
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

      <Footer />
    </div>
  );
};

export default AddSchoolLicense;

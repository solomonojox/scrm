import React, { useRef, useState } from 'react';
import {
  faArrowLeft,
  faFileAlt,
  faFilePdf,
  faTrash,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../Styles/loader.css';
import Header from '../Header';
import Footer from '../Footer';
import { Link, useParams, useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  let { schoolId } = useParams();
  const navigate = useNavigate();

  if (!schoolId) {
    console.warn("⚠️ schoolId not provided via route params. Using fallback test ID.");
    schoolId = "12345678-1234-1234-1234-1234567890ab";
  }

  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');

    if (!schoolId) {
      setErrorMessage('School ID not found. Please register a school first.');
      return;
    }

    if (files.length === 0) {
      setErrorMessage('Please upload at least one file.');
      return;
    }

    setSaving(true);

    const formData = new FormData();
    files.forEach(({ file }) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`https://scrmapi.tranquility.org.ng/api/School/UploadDocument/${schoolId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result?.message || 'Upload failed. Please try again.');
        return;
      }

      console.log('✅ Upload success:', result);
      navigate('/AddAccount');
    } catch (error) {
      console.error('❌ Upload exception caught:', error);
      setErrorMessage(error.message || 'File upload failed. Check console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-['Inter'] bg-gray-100 relative">
      <Header />

      {saving && (
        <div className="loaderwrapper z-50">
          <div className="loader scale-125" />
        </div>
      )}

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-5xl rounded-xl p-10 relative shadow-lg">
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Go back"
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 text-lg"
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
            <Link to="/addschoolform" className="hover:underline">Add School</Link>
            <Link to="/AddSchool" className="underline">Upload School License</Link>
            <Link to="/AddAccount" className="hover:underline">Add Account details</Link>
            <Link to="/AddAdmin" className="hover:underline">Add School Admin</Link>
          </nav>

          {errorMessage && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
            <div
              className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg w-full md:w-1/3 h-44 cursor-pointer hover:border-orange-500 transition"
              onClick={triggerFileDialog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerFileDialog()}
            >
              <img
                alt="Upload"
                src="https://storage.googleapis.com/a1aa/image/fe76c44b-fb63-4c81-72a8-e7a2ef9efb17.jpg"
                width={48}
                height={48}
                className="mb-3"
                draggable="false"
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
                        <img
                          src={preview}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : file.type === 'application/pdf' ? (
                        <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-lg" />
                      ) : (
                        <FontAwesomeIcon icon={faFileAlt} className="text-gray-800 text-lg" />
                      )}
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
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

      <Footer />
    </div>
  );
};

export default RegistrationForm;

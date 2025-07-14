// import React, { useRef, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileAlt, faFilePdf, faTimes, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';

// export default function FileUpload() {
//   const fileInputRef = useRef(null);
//   const [files, setFiles] = useState([]);

//   const handleBrowseClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const newFiles = selectedFiles.map((file) => ({
//       file,
//       id: Math.random().toString(36).substr(2, 9),
//       url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
//     }));
//     setFiles((prev) => [...prev, ...newFiles]);
//   };

//   const handleDelete = (id) => {
//     setFiles((prev) => prev.filter((f) => f.id !== id));
//   };

//   return (
//     <div className="mt-6 flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
//       {/* Upload area */}
//       <div
//         aria-label="Drag files here or browse"
//         className="flex flex-col items-center justify-center bg-gray-200 rounded-md w-full md:w-1/3 h-40 cursor-pointer"
//         role="button"
//         tabIndex={0}
//         onClick={handleBrowseClick}
//       >
//         <img
//           alt="Upload"
//           className="mb-2"
//           draggable="false"
//           src="https://storage.googleapis.com/a1aa/image/fe76c44b-fb63-4c81-72a8-e7a2ef9efb17.jpg"
//           width={40}
//           height={40}
//         />
//         <p className="text-center text-xs text-gray-700 mb-3">Drag files here</p>
//         <button
//           className="bg-blue-700 text-white text-xs rounded px-4 py-1 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
//           type="button"
//         >
//           Browse
//         </button>
//         <input
//           type="file"
//           multiple
//           className="hidden"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//         />
//       </div>

//       {/* Uploaded files */}
//       <div className="bg-gray-200 rounded-md w-full md:w-2/3 p-4">
//         <p className="text-xs font-semibold text-gray-700 mb-2">Uploaded Files</p>

//         {files.map((item) => (
//           <div key={item.id} className="flex items-center justify-between mb-2">
//             <div className="flex items-center space-x-2">
//               {item.url ? (
//                 <img src={item.url} alt="Preview" className="w-8 h-8 object-cover rounded" />
//               ) : item.file.type.includes('pdf') ? (
//                 <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-sm" />
//               ) : (
//                 <FontAwesomeIcon icon={faFileAlt} className="text-black text-sm" />
//               )}
//               <span className="text-xs text-gray-500 truncate max-w-[100px]">
//                 {item.file.name}
//               </span>
//               <div className="w-36 h-2 bg-gray-300 rounded-full ml-3">
//                 <div
//                   className="h-2 bg-blue-400 rounded-full"
//                   style={{ width: '100%' }}
//                 ></div>
//               </div>
//             </div>
//             <span className="text-xs text-gray-400">
//               {(item.file.size / (1024 * 1024)).toFixed(1)}MB
//             </span>
//             <button
//               aria-label={`Remove ${item.file.name}`}
//               className="text-gray-600 hover:text-red-600 ml-3"
//               onClick={() => handleDelete(item.id)}
//             >
//               <FontAwesomeIcon icon={faTrash} />
//             </button>
//           </div>
//         ))}

//         {files.length === 0 && (
//           <p className="text-xs text-gray-500 italic">No files uploaded yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ missing import
import Sidebar from "../../pages/Admin/guardian/Sidebar";

export default function Gallery() {
  const navigate = useNavigate();

  const augustImages = [
    "https://storage.googleapis.com/a1aa/image/c1594022-aa0c-4a32-2c16-812d6c756f50.jpg",
    "https://storage.googleapis.com/a1aa/image/5941782a-a136-4f79-5791-f713b051868e.jpg",
    "https://storage.googleapis.com/a1aa/image/c3dec1e2-6a57-42c5-9b48-1beb15ac6175.jpg",
    "https://storage.googleapis.com/a1aa/image/02ba9b52-412f-43ef-7543-69cd429a711c.jpg",
    "https://storage.googleapis.com/a1aa/image/a92bb078-45f1-4a22-829e-9780f4733aa2.jpg",
    "https://storage.googleapis.com/a1aa/image/c1594022-aa0c-4a32-2c16-812d6c756f50.jpg",
    "https://storage.googleapis.com/a1aa/image/5941782a-a136-4f79-5791-f713b051868e.jpg",
    "https://storage.googleapis.com/a1aa/image/c3dec1e2-6a57-42c5-9b48-1beb15ac6175.jpg",
    "https://storage.googleapis.com/a1aa/image/02ba9b52-412f-43ef-7543-69cd429a711c.jpg",
    "https://storage.googleapis.com/a1aa/image/a92bb078-45f1-4a22-829e-9780f4733aa2.jpg",
  ];

  const julyImages = [
    "https://storage.googleapis.com/a1aa/image/88edb971-066e-4945-82bb-400f9ad44ac8.jpg",
    "https://storage.googleapis.com/a1aa/image/cd7fa9aa-6382-4f71-85e8-861793ce0282.jpg",
    "https://storage.googleapis.com/a1aa/image/78a50a04-19de-4851-f40b-5117d6575ff6.jpg",
    "https://storage.googleapis.com/a1aa/image/134469ef-7656-43fe-ca9f-8844c5c236e4.jpg",
    "https://storage.googleapis.com/a1aa/image/ecf5c478-9c6d-499a-4316-6ad149418983.jpg",
    "https://storage.googleapis.com/a1aa/image/88edb971-066e-4945-82bb-400f9ad44ac8.jpg",
    "https://storage.googleapis.com/a1aa/image/cd7fa9aa-6382-4f71-85e8-861793ce0282.jpg",
    "https://storage.googleapis.com/a1aa/image/78a50a04-19de-4851-f40b-5117d6575ff6.jpg",
    "https://storage.googleapis.com/a1aa/image/134469ef-7656-43fe-ca9f-8844c5c236e4.jpg",
    "https://storage.googleapis.com/a1aa/image/ecf5c478-9c6d-499a-4316-6ad149418983.jpg",
  ];

  return (
    <div className="bg-gray-200 font-sans text-black min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto p-4 md:ml-64"> {/* ✅ Added md:ml-64 */}
        <header className="flex items-center space-x-3 mb-4">
          <button
            aria-label="Back"
            onClick={() => navigate("/guardian/event")}
            className="text-black text-lg"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="font-bold text-base sm:text-lg md:text-xl">Gallery</h1>
        </header>

        {/* August 2025 Section */}
        <section className="mb-6">
          <h2 className="font-semibold text-sm sm:text-base mb-3">
            August, 2025
          </h2>
          <div className="bg-white rounded-md p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {augustImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`August gallery ${index + 1}`}
                className="rounded-md shadow-lg object-cover w-full h-[150px]"
                loading="lazy"
              />
            ))}
          </div>
        </section>

        {/* July 2025 Section */}
        <section>
          <h2 className="font-semibold text-sm sm:text-base mb-3">
            July, 2025
          </h2>
          <div className="bg-white rounded-md p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {julyImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`July gallery ${index + 1}`}
                className="rounded-md shadow-lg object-cover w-full h-[150px]"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

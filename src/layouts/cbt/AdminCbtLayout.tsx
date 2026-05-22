// layouts/Cbt.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminCbtSidebar from "../../pages/Cbt/Admin/AdminCbtSidebar";
import AdminCbtNavbar from "../../pages/Cbt/Admin/AdminCbtNavbar";

export const AdminCbtLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

    const closeMobileMenu = () => {
      setIsMobileMenuOpen(false);
      setIsSidebarOpen(false);
    }


  return (
    <div className="">
      <AdminCbtNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="">
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <AdminCbtSidebar 
            isSidebarOpen={isSidebarOpen} 
            onClose={closeMobileMenu}
            onToggle={toggleSidebar} // Pass the toggle function
           />
         </div>

        <div className={` ${isSidebarOpen ? 'lg:ml-56' : 'lg:ml-20'} py-3`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};








// // layouts/Cbt.tsx
// import { Outlet } from "react-router-dom";
// import { useState, useEffect } from "react";
// import AdminCbtSidebar from "../../pages/Cbt/Admin/AdminCbtSidebar";
// import AdminCbtNavbar from "../../pages/Cbt/Admin/AdminCbtNavbar";

// export const AdminCbtLayout = ({ children }: { children?: React.ReactNode }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Handle responsive sidebar
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setIsSidebarOpen(false);
//       } else {
//         setIsSidebarOpen(true);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const toggleSidebar = () => {
//     if (window.innerWidth < 1024) {
//       setIsMobileMenuOpen(!isMobileMenuOpen);
//       setIsSidebarOpen(!isSidebarOpen);
//     } else {
//       setIsSidebarOpen(!isSidebarOpen);
//     }
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
//       <AdminCbtNavbar 
//         onMenuClick={toggleSidebar} 
//         isSidebarOpen={isSidebarOpen}
//       />

//       <div className="flex">
//         {/* Backdrop for mobile */}
//         {isMobileMenuOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//             onClick={closeMobileMenu}
//           />
//         )}
        
//         {/* Sidebar */}
//         <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
//           <AdminCbtSidebar 
//             isSidebarOpen={isSidebarOpen} 
//             onClose={closeMobileMenu}
//             onToggle={toggleSidebar} // Pass the toggle function
//           />
//         </div>
        
//         {/* Main Content */}
//         <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-52' : 'lg:ml-20'}`}>
//           <div className="p-4 lg:p-6">
//             {<Outlet />}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

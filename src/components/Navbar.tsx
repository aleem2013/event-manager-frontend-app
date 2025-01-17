// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side - Brand and main navigation */}
          <div className="flex items-center flex-1">
            <Link to="/" className="text-xl font-bold text-gray-800 mr-8">
              Event Manager
            </Link>
            {/* Navigation items */}
            {isAuthenticated ? (
            <div className="flex space-x-8">
              {/* <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
              >
                Events
              </Link> */}
              {isAuthenticated && isAdmin() && (
                <Link
                  to="/create-event"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
                >
                  Create Event
                </Link>
              )}
              <Link
                to="/scan"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
              >
                Scan QR
              </Link>
            </div>
            ): (
              <div className="space-x-6">
                
              </div>
            )}
          </div>

          {/* Right side - Authentication */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* <span className="text-sm text-gray-600">
                  {isAdmin() ? 'Admin' : 'User'}
                </span> */}
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Calendar, PlusCircle, QrCode } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// const Navbar: React.FC = () => {
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <div className="flex-shrink-0 flex items-center">
//               <Link to="/" className="text-xl font-bold text-gray-800">
//                 Event Manager
//               </Link>
//             </div>
//             {isAuthenticated && (
//               <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//                 <Link
//                   to="/"
//                   className="inline-flex items-center px-1 pt-1 text-gray-900"
//                 >
//                   Events
//                 </Link>
//                 <Link
//                   to="/create-event"
//                   className="inline-flex items-center px-1 pt-1 text-gray-900"
//                 >
//                   Create Event
//                 </Link>
//                 <Link
//                   to="/scan"
//                   className="inline-flex items-center px-1 pt-1 text-gray-900"
//                 >
//                   Scan QR
//                 </Link>
//               </div>
//             )}
//           </div>
//           <div className="flex items-center">
//             {isAuthenticated ? (
//               <button
//                 onClick={logout}
//                 className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
//               >
//                 Logout
//               </button>
//             ) : (
//               <div className="space-x-4">
//                 <Link
//                   to="/login"
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

  /*
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">Event Manager</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/create-event" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <PlusCircle className="h-5 w-5" />
              <span>Create Event</span>
            </Link>
            <Link to="/scan" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <QrCode className="h-5 w-5" />
              <span>Scan QR</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;*/
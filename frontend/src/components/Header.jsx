import { ClipboardList, LogOut, User, X, Mail, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";
import { logoutUser } from "../utils/auth";

function Header({ totalCount = 0, completedCount = 0 }) {
  const remaining = totalCount - completedCount;
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  
  // Get user data from localStorage
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const parsed = JSON.parse(userData);
      return {
        name: parsed.name || 'Guest User',
        email: parsed.email || 'guest@example.com',
        joinedDate: parsed.joinedDate || new Date().toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }),
        role: 'User'
      };
    }
    return {
      name: 'Guest User',
      email: 'guest@example.com',
      joinedDate: new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }),
      role: 'Guest'
    };
  });

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    
    const result = logoutUser();
    
    if (result.success) {
      setShowLogoutSuccess(true);
      setTimeout(() => {
        setShowLogoutSuccess(false);
        navigate('/login');
      }, 2500);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleCloseModal = () => {
    setShowProfileModal(false);
  };

  return (
    <>
      <header className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 px-6 py-6 mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-black p-3 rounded-xl shadow-sm">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Todo App</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Stay organized, one task at a time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {totalCount > 0 && (
              <div className="bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">
                {completedCount} done · {remaining} remaining
              </div>
            )}

            <Button 
              label="Profile" 
              onClick={handleProfileClick} 
              variant="ghost"
              icon={<User className="w-4 h-4" />}
            />

            <Button 
              label="Logout" 
              onClick={handleLogout} 
              variant="danger"
              icon={<LogOut className="w-4 h-4" />}
            />
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Logout Confirmation</h3>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to logout?
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              <Button 
                label="Cancel" 
                onClick={cancelLogout} 
                variant="ghost"
              />
              <Button 
                label="Logout" 
                onClick={confirmLogout} 
                variant="danger"
              />
            </div>
          </div>
        </div>
      )}

      {/* Logout Success Toast Notification */}
      {showLogoutSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm w-80">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-800">Logged Out Successfully!</p>
                <p className="text-xs text-green-600 mt-0.5">You have been logged out.</p>
              </div>
              <button
                onClick={() => setShowLogoutSuccess(false)}
                className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Profile Details</h3>
              <button 
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-3">
                  {user.name}
                </h2>
                {user.role && (
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mt-1">
                    {user.role}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="text-sm font-medium text-gray-800">{user.joinedDate}</p>
                  </div>
                </div>
              </div>

              {totalCount > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Task Statistics</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-indigo-50 rounded-xl">
                      <p className="text-2xl font-bold text-indigo-600">{totalCount}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                      <p className="text-xs text-gray-500">Done</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl">
                      <p className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <Button 
                label="Close" 
                onClick={handleCloseModal} 
                variant="ghost"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default Header;
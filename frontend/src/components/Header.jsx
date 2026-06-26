import { CheckCircle, LogOut, User, X, Mail, Calendar, Pencil, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser, updateUserName, updateUserEmail } from "../utils/auth";

function Header({ totalCount = 0, completedCount = 0 }) {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    joinedDate: '',
    role: 'User'
  });

  // --- Editing state ---
  const [editingField, setEditingField] = useState(null); // null | "name" | "email"
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({
          name: currentUser.name,
          email: currentUser.email,
          joinedDate: new Date(currentUser.$createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          role: 'User'
        });
      }
    }
    fetchUser();
  }, []);

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logoutUser();
    setShowLogoutSuccess(true);
    setTimeout(() => navigate('/login'), 800);
  };

  function startEditingName() {
    setNameInput(user.name);
    setFieldError("");
    setEditingField("name");
  }

  function startEditingEmail() {
    setEmailInput(user.email);
    setPasswordInput("");
    setFieldError("");
    setEditingField("email");
  }

  function cancelEditing() {
    setEditingField(null);
    setFieldError("");
  }

  async function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setFieldError("Name can't be empty.");
      return;
    }
    setSaving(true);
    setFieldError("");
    const result = await updateUserName(trimmed);
    setSaving(false);
    if (result.success) {
      setUser((prev) => ({ ...prev, name: trimmed }));
      setEditingField(null);
    } else {
      setFieldError(result.message || "Failed to update name.");
    }
  }

  async function saveEmail() {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setFieldError("Email can't be empty.");
      return;
    }
    if (!passwordInput) {
      setFieldError("Enter your current password to confirm.");
      return;
    }
    setSaving(true);
    setFieldError("");
    const result = await updateUserEmail(trimmed, passwordInput);
    setSaving(false);
    if (result.success) {
      setUser((prev) => ({ ...prev, email: trimmed }));
      setEditingField(null);
      setPasswordInput("");
    } else {
      setFieldError(result.message || "Failed to update email.");
    }
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <header className="bg-white rounded-2xl shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#6b3f5e" }}>
                <CheckCircle className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800 tracking-tight">Todo App</span>
            </div>

            {/* Right side: identity + actions */}
            <div className="flex items-center gap-4">
              {/* User identity */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-gray-50 transition-all"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
                  style={{ backgroundColor: "#6b3f5e" }}>
                  <span className="text-white text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:inline">
                  {user.name}
                </span>
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-200" />

              {/* Actions */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                title="Log out"
                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Log out?</h3>
                <p className="text-gray-500 text-sm">Are you sure you want to logout?</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-full text-sm text-gray-500 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-full text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#6b3f5e" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Success Toast */}
      {showLogoutSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-4 max-w-sm w-72">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Logged out successfully!</p>
                <p className="text-xs text-gray-400 mt-0.5">See you next time.</p>
              </div>
              <button onClick={() => setShowLogoutSuccess(false)}>
                <X className="w-4 h-4 text-gray-300 hover:text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setEditingField(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: "#6b3f5e" }}>
                  <span className="text-white text-3xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mt-3">{user.name}</h2>
                <span className="text-xs text-gray-400 mt-1">{user.role}</span>
              </div>

              <div className="space-y-2">
                {/* Full Name row */}
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#f3e8ef" }}>
                      <User className="w-4 h-4" style={{ color: "#6b3f5e" }} />
                    </div>

                    {editingField === "name" ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveName()}
                          autoFocus
                          className="flex-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#6b3f5e]"
                        />
                        <button onClick={saveName} disabled={saving} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-50">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={cancelEditing} disabled={saving} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-50">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Full Name</p>
                          <p className="text-sm font-medium text-gray-700">{user.name}</p>
                        </div>
                        <button onClick={startEditingName} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingField === "name" && fieldError && (
                    <p className="text-xs text-red-500 mt-2 ml-11">{fieldError}</p>
                  )}
                </div>

                {/* Email row */}
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#f3e8ef" }}>
                      <Mail className="w-4 h-4" style={{ color: "#6b3f5e" }} />
                    </div>

                    {editingField === "email" ? (
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="New email"
                            autoFocus
                            className="flex-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#6b3f5e]"
                          />
                          <button onClick={saveEmail} disabled={saving} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-50">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button onClick={cancelEditing} disabled={saving} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-50">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEmail()}
                          placeholder="Current password (required to confirm)"
                          className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#6b3f5e]"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm font-medium text-gray-700">{user.email}</p>
                        </div>
                        <button onClick={startEditingEmail} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {editingField === "email" && fieldError && (
                    <p className="text-xs text-red-500 mt-2 ml-11">{fieldError}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "#f3e8ef" }}>
                    <Calendar className="w-4 h-4" style={{ color: "#6b3f5e" }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Member Since</p>
                    <p className="text-sm font-medium text-gray-700">{user.joinedDate}</p>
                  </div>
                </div>
              </div>

              {totalCount > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">Task Stats</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-3 rounded-xl" style={{ backgroundColor: "#f3e8ef" }}>
                      <p className="text-xl font-bold" style={{ color: "#6b3f5e" }}>{totalCount}</p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <p className="text-xl font-bold text-green-600">{completedCount}</p>
                      <p className="text-xs text-gray-400">Done</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl">
                      <p className="text-xl font-bold text-orange-500">{totalCount - completedCount}</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setEditingField(null);
                }}
                className="px-4 py-2 rounded-full text-sm text-gray-500 hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </>
  );
}

export default Header;
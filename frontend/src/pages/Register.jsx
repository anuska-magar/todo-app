import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, X, CheckCircle } from "lucide-react";
import { registerUser } from "../utils/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await registerUser(name.trim(), email.trim(), password);
      if (result.success) {
        setShowPopup(true);
        setTimeout(() => navigate("/login"), 800);
      } else {
        setError(result.message);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordError = confirmPassword && !passwordsMatch;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#fdf6f0" }}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2d2d2d" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">Create Account</h1>
            <p className="text-xs text-gray-400">Sign up to start organizing your tasks.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="Ram Bahadur"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: "#f3f0ee" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: "#f3f0ee" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 transition-all pr-11"
                style={{ backgroundColor: "#f3f0ee" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 transition-all pr-11"
                style={{ backgroundColor: "#f3f0ee" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {passwordError && <p className="text-xs text-red-400 mt-1 pl-2">Passwords do not match</p>}
            {passwordsMatch && <p className="text-xs text-green-500 mt-1 pl-2">Passwords match ✓</p>}
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 mt-2"
            style={{ backgroundColor: "#6b3f5e" }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-gray-700 hover:underline">Log In →</Link>
        </p>
      </div>

      {/* Toast */}
      {showPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-4 w-72">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Registration Successful!</p>
                <p className="text-xs text-gray-400 mt-0.5">Please login to continue.</p>
              </div>
              <button onClick={() => setShowPopup(false)}>
                <X className="w-4 h-4 text-gray-300 hover:text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default Register;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, X } from "lucide-react";
import { loginUser } from "../utils/auth";

function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit() {
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await loginUser(email, password);
    if (result.success) {
      setLoggedIn(true);
      setShowPopup(true);
      setTimeout(() => navigate("/"), 800);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#fdf6f0" }}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8">

        {/* Avatar icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "#2d2d2d" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Welcome Back</h1>
        <p className="text-sm text-center text-gray-400 mb-7">Log in to access your todos.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: "#f3f0ee", focusRingColor: "#6b3f5e" }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-sm text-gray-700 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 transition-all pr-11"
                style={{ backgroundColor: "#f3f0ee" }}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
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

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 mt-2"
            style={{ backgroundColor: "#6b3f5e" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-sm text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-gray-700 hover:underline">Register</Link>
        </p>
      </div>

      {/* Toast */}
      {showPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-4 w-72">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Login Successful!</p>
                <p className="text-xs text-gray-400 mt-0.5">Welcome back!</p>
              </div>
              <button onClick={() => setShowPopup(false)}>
                <X className="w-4 h-4 text-gray-300 hover:text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

export default Login;
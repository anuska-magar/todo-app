import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, X } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../utils/auth";

function Login() {
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
    setLoading(false);

    if (result.success) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 2500);
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-black p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        </div>
        <p className="text-gray-500 mb-6">Log in to access your todos.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-center">
            <Button
              label={loading ? "Logging in..." : "Login"}
              onClick={handleSubmit}
              variant="primary"
              disabled={loading}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-black font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* Login Success Toast */}
      {showPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm w-80">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800">Login Successful!</p>
                <p className="text-xs text-green-600 mt-0.5">Welcome back! You have been logged in.</p>
              </div>
              <button onClick={() => setShowPopup(false)}>
                <X className="w-4 h-4 text-green-400 hover:text-green-600" />
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
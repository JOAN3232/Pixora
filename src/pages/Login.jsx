import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Chrome, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const REDIRECT_DELAY_MS = 5000;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // show success UI then redirect
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, REDIRECT_DELAY_MS);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] text-gray-200 px-4">
      <div className="bg-[#18181b] border border-gray-800 rounded-2xl p-8 w-full max-w-md text-gray-200 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Welcome Back
        </h2>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-3 mb-5 rounded-lg border border-gray-700 bg-[#1f1f23] transition"
        >
          <Chrome size={20} className="text-yellow-400" />
          <span className="font-medium">Continue with Google</span>
        </button>

        <div className="flex items-center gap-2 mb-5">
          <span className="flex-grow border-t border-gray-700"></span>
          <span className="text-gray-500 text-xs">or</span>
          <span className="flex-grow border-t border-gray-700"></span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center bg-[#1a1a1d] rounded-lg px-3">
            <Mail className="text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-transparent focus:outline-none text-gray-200"
              required
            />
          </div>

          <div className="flex items-center bg-[#1a1a1d] rounded-lg px-3">
            <Lock className="text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent focus:outline-none text-gray-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg font-semibold"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Sign-in success modal */}
      {success && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#18181b]/95 border border-gray-800 rounded-2xl p-6 shadow-2xl text-center">
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Sign in complete ✨
            </h3>
            <p className="mt-2 text-gray-400">Redirecting to Pixora in 5s...</p>
          </div>
        </div>
      )}
    </div>
  );
}

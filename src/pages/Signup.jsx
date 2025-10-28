import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Chrome, Mail, Lock, User } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // show modal after successful signup
  const REDIRECT_DELAY_MS = 5000;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      setLoading(false);

      if (error) {
        setError(error.message);
        return;
      }

      // Show success modal
      setSuccess(true);

      // If Supabase returned a session (auto-signed in), sign the user out so they must log in manually.
      // This ensures the flow: signup -> "signup complete" modal -> redirect to login page.
      if (data?.session) {
        await supabase.auth.signOut();
      }

      // Redirect to login after a delay
      setTimeout(() => {
        setSuccess(false);
        navigate("/login");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Signup failed");
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
    // Note: OAuth will redirect out to Google's flow; when it returns Supabase may create a session.
    // Supabase will trigger auth state events which your Navbar listens for.
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f10] text-gray-200 px-4">
      <div className="bg-[#18181b] border border-gray-800 rounded-2xl p-8 w-full max-w-md text-gray-200 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Join Pixora
        </h2>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleGoogleSignup}
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

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex items-center bg-[#1a1a1d] rounded-lg px-3">
            <User className="text-gray-400" size={18} />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              className="w-full p-3 bg-transparent focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center bg-[#1a1a1d] rounded-lg px-3">
            <Mail className="text-gray-400" size={18} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-transparent focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center bg-[#1a1a1d] rounded-lg px-3">
            <Lock className="text-gray-400" size={18} />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-transparent focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>

      {/* Success modal (keeps your dark/pixora gradient) */}
      {success && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#18181b]/95 border border-gray-800 rounded-2xl p-6 shadow-2xl text-center">
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Sign up complete ✨
            </h3>
            <p className="mt-2 text-gray-400">Redirecting to login in 5s...</p>
          </div>
        </div>
      )}
    </div>
  );
}

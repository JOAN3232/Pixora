import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { User, Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load user session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  if (loading) return null;

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#0b0b0e]/80 via-[#11111a]/60 to-[#0b0b0e]/80 border-b border-gray-800/70 px-6 py-4 flex justify-between items-center shadow-[0_1px_10px_rgba(0,0,0,0.4)]">
      
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
      >
        Pixora
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-5">

        <Link
          to="/favorites"
          className={`flex items-center gap-2 bg-[#18181b] px-3 py-2 rounded-lg border ${
            location.pathname === "/favorites"
              ? "border-pink-500/60"
              : "border-gray-700 hover:border-pink-500/60"
          } cursor-pointer transition`}
        >
          <span className="text-pink-400 group-hover:text-pink-300 transition">
            ❤️
          </span>
          <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
            Favorites
          </span>
        </Link>

        {!user ? (
          <>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white font-medium transition"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-[#18181b] px-2 py-1 rounded-full border border-gray-700 hover:border-gray-700 transition"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User Avatar"
                  className="w-7 h-7 rounded-full border border-gray-700"
                />
              ) : (
                <User size={18} className="text-gray-400" />
              )}
              <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {user.user_metadata?.username ||
                  user.user_metadata?.full_name ||
                  user.email}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 font-medium transition text-sm"
              title="Logout"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Hamburger Button */}
      <button
        className="md:hidden text-gray-300 hover:text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0b0b0e]/90 backdrop-blur-xl flex flex-col md:hidden p-4 gap-3 border-t border-gray-800/70">
          <Link
            to="/favorites"
            className={`flex items-center gap-2 bg-[#18181b] px-3 py-2 rounded-lg border ${
              location.pathname === "/favorites"
                ? "border-pink-500/60"
                : "border-gray-700 hover:border-pink-500/60"
            } cursor-pointer transition`}
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-pink-400">❤️</span>
            <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Favorites
            </span>
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white font-medium transition"
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-[#18181b] px-2 py-1 rounded-full border border-gray-700 hover:border-gray-700 transition"
                onClick={() => setMobileOpen(false)}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-full border border-gray-700"
                  />
                ) : (
                  <User size={18} className="text-gray-400" />
                )}
                <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  {user.user_metadata?.username ||
                    user.user_metadata?.full_name ||
                    user.email}
                </span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="text-gray-400 hover:text-red-400 font-medium transition text-sm"
                title="Logout"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

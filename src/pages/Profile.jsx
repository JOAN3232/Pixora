import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { User, Heart, LogOut } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  // 🧠 Load user and favorites
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      setNewName(currentUser?.user_metadata?.username || "");
    };
    getUser();

    const favs = JSON.parse(localStorage.getItem("pixora-favorites")) || [];
    setFavorites(favs);
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // ✏️ Update username
  const updateUsername = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: newName },
      });
      if (error) throw error;
      alert("✅ Username updated!");
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Error updating username");
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#0f0f10]">
        Please log in to view your profile.
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0f0f10] text-gray-200 pt-28 px-6">
        {/* 🌈 Profile Header */}
        <motion.div
          className="max-w-3xl mx-auto bg-[#18181b]/80 border border-gray-800 rounded-2xl shadow-xl p-8 text-center backdrop-blur-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Avatar */}
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full border border-gray-700 mx-auto mb-4"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-[#1f1f23] rounded-full border border-gray-700 mx-auto mb-4">
              <User size={40} className="text-gray-500" />
            </div>
          )}

          {/* Username (editable) */}
          {editing ? (
            <div className="flex justify-center gap-2 items-center">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-[#111113] border border-gray-700 text-gray-200 rounded-lg px-3 py-1 w-40 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={updateUsername}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-lg hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <h1
              onClick={() => setEditing(true)}
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 cursor-pointer hover:underline"
            >
              {user.user_metadata?.username || "Pixora User"}
            </h1>
          )}

          {/* Email */}
          <p className="text-gray-400 mb-6">{user.email}</p>

          {/* Stats */}
          <div className="flex justify-center gap-10 mb-8">
            <div className="flex flex-col items-center">
              <Heart className="text-pink-500 mb-1" size={20} />
              <span className="text-sm text-gray-400">Favorites</span>
              <span className="font-semibold text-gray-100">{favorites.length}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
          >
            <LogOut size={16} className="inline mr-2" />
            Logout
          </button>
        </motion.div>

        {/* ❤️ Favorite Gallery */}
        <motion.div
          className="max-w-6xl mx-auto mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 text-center">
            Your Favorite Images ❤️
          </h2>

          {favorites.length === 0 ? (
            <p className="text-center text-gray-500">
              You haven’t added any favorites yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favorites.map((fav) => (
                <motion.div
                  key={fav.id}
                  className="rounded-xl overflow-hidden border border-gray-800 hover:scale-105 transition-transform"
                >
                  <img
                    src={fav.url}
                    alt={fav.photographer}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

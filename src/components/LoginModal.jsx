import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Chrome } from "lucide-react";

export default function LoginModal({ onClose }) {
  const [mode, setMode] = useState("login");

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Card */}
        <motion.div
          className="relative w-[90%] max-w-md bg-[#131316]/90 border border-gray-800 rounded-2xl shadow-2xl p-8 text-gray-200 backdrop-blur-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 p-2 rounded-full hover:bg-black/70 transition"
          >
            <X size={18} className="text-gray-300" />
          </button>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-gray-400 mb-6 text-sm">
            {mode === "login"
              ? "Log in to continue exploring Pixora."
              : "Join Pixora and start discovering stunning photos."}
          </p>

          {/* Google Login */}
          <button className="flex items-center justify-center gap-3 w-full py-3 mb-5 rounded-lg border border-gray-700 hover:border-gray-500 bg-[#18181b] hover:bg-[#1f1f23] transition">
            <Chrome size={20} className="text-yellow-400" />
            <span className="font-medium text-gray-200">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-5">
            <span className="flex-grow border-t border-gray-700"></span>
            <span className="text-gray-500 text-xs">or continue with email</span>
            <span className="flex-grow border-t border-gray-700"></span>
          </div>

          {/* Email Form */}
          <form className="space-y-4">
            {mode === "signup" && (
              <div className="flex items-center bg-[#1a1a1d] rounded-lg px-3">
                <User className="text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-3 bg-transparent text-gray-200 focus:outline-none"
                />
              </div>
            )}
            <div className="flex items-center bg-[#1a1a1d] rounded-lg px-3">
              <Mail className="text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-transparent text-gray-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center bg-[#1a1a1d] rounded-lg px-3">
              <Lock className="text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 bg-transparent text-gray-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {mode === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-5 text-sm text-gray-400">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-purple-400 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-blue-400 hover:underline"
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

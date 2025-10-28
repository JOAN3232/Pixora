import React, { useState } from "react";
import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "./LoginModal";

export default function ImageModal({ image, onClose }) {
  const [showLogin, setShowLogin] = useState(false);

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative max-w-4xl w-[90%] bg-[#18181b] rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
          >
            <X className="text-white" size={22} />
          </button>

          {/* Image */}
          <img
            src={image.urls.regular}
            alt={image.alt_description}
            className="w-full max-h-[80vh] object-contain bg-black"
          />

          {/* Info Section */}
          <div className="flex justify-between items-center p-4 bg-[#141416] text-gray-200">
            <div>
              <p className="font-semibold text-white">{image.user.name}</p>
              <p className="text-sm text-gray-400">@{image.user.username}</p>
            </div>
            <button
              onClick={async () => {
                try {
                  const response = await fetch(selectedImage.urls.full); // get the actual full-size image
                  const blob = await response.blob(); // convert to a blob
                  const url = window.URL.createObjectURL(blob); // create temp file link

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${selectedImage.user.name || "pixora-image"}.jpg`; // ✅ forces download
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Error downloading image:", error);
                }
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
            >
              <Download size={18} />
              <span>Download</span>
            </button>

          </div>
        </motion.div>

        {/* Login Modal */}
        {showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

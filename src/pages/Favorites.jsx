import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Heart } from "lucide-react";
import axios from "axios";
import { UNSPLASH_ACCESS_KEY } from "../config";
import Navbar from "../components/Navbar";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    // 🩵 Load favorites from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("pixora-favorites")) || [];
        setFavorites(saved);
    }, []);

    // ❤️ Remove from favorites
    const removeFavorite = (id) => {
        const updated = favorites.filter((fav) => fav.id !== id);
        setFavorites(updated);
        localStorage.setItem("pixora-favorites", JSON.stringify(updated));
    };

    // 💾 Download handler (uses Unsplash-approved flow)
    const handleDownload = async (photo) => {
        try {
            const { data } = await axios.get(photo.download_location, {
                headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
            });
            window.open(data.url, "_blank"); // triggers download
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download image. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#0f0f10] text-gray-200 pt-24">
                {/* 🌈 Header */}
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#c084fc] to-[#818cf8] mb-3">
                        Your Favorites ❤️
                    </h1>
                    <p className="text-gray-400">
                        All your saved inspiration in one place ✨
                    </p>
                </header>

                {/* 🖼️ Gallery */}
                {favorites.length === 0 ? (
                    <p className="text-center text-gray-500 mt-20">
                        No favorites yet 😔 — go add some from the home page!
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-6 pb-10">
                        {favorites.map((img) => (
                            <motion.div
                                key={img.id}
                                layoutId={img.id}
                                onClick={() => setSelectedImage(img)}
                                className="cursor-pointer overflow-hidden rounded-xl group relative"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <img
                                    src={img.url}
                                    alt={img.photographer}
                                    className="w-full h-full object-cover rounded-xl group-hover:opacity-90 transition"
                                />

                                {/* ❤️ Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFavorite(img.id);
                                    }}
                                    className="absolute top-2 right-2 text-pink-500 bg-black/40 p-1.5 rounded-full hover:bg-black/70 transition"
                                >
                                    <Heart size={18} fill="currentColor" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* 🔹 Modal Preview */}
                <AnimatePresence>
                    {selectedImage && (
                        <>
                            {/* Overlay */}
                            <motion.div
                                className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedImage(null)}
                            />

                            {/* Modal */}
                            <motion.div
                                layoutId={selectedImage.id}
                                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div
                                    className="relative w-full max-w-4xl max-h-[90vh] bg-[#18181b]/95 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800">
                                        <div>
                                            <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                                {selectedImage.photographer}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                @{selectedImage.username}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedImage(null)}
                                            className="text-gray-400 hover:text-gray-200 transition"
                                        >
                                            <X size={22} />
                                        </button>
                                    </div>

                                    {/* Image */}
                                    <div className="flex-1 flex items-center justify-center bg-black/30 overflow-hidden">
                                        <img
                                            src={selectedImage.fullUrl}
                                            alt={selectedImage.photographer}
                                            className="max-h-[75vh] w-auto object-contain rounded-lg"
                                        />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center px-5 py-3 border-t border-gray-800 bg-[#111113]/80 backdrop-blur-lg">
                                        <button
                                            className="flex items-center gap-2 text-pink-500 hover:text-pink-400 transition"
                                            onClick={() => removeFavorite(selectedImage.id)}
                                        >
                                            <Heart size={18} fill="currentColor" />
                                            <span>Remove</span>
                                        </button>

                                        <button
                                            onClick={() => handleDownload(selectedImage)}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                                        >
                                            <Download size={18} />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

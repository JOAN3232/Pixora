import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Heart, Search, X } from "lucide-react";
import { UNSPLASH_ACCESS_KEY } from "../config";


export default function Home() {
    const [images, setImages] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);

    // 🔹 Load favorites from localStorage on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("pixora-favorites")) || [];
        setFavorites(saved);
    }, []);

    // 🔹 Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("pixora-favorites", JSON.stringify(favorites));
    }, [favorites]);

    // 🔹 Fetch default images on load
    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async (searchTerm = "") => {
        setLoading(true);
        try {
            const url = searchTerm
                ? `https://api.unsplash.com/search/photos`
                : `https://api.unsplash.com/photos`;

            const res = await axios.get(url, {
                headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
                params: searchTerm
                    ? { query: searchTerm, per_page: 30 }
                    : { per_page: 30 },
            });

            setImages(searchTerm ? res.data.results : res.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) fetchImages(query);
    };

    // ❤️ Toggle favorites in local storage
    const toggleFavorite = (image) => {
        const isFav = favorites.find((fav) => fav.id === image.id);

        if (isFav) {
            const updated = favorites.filter((fav) => fav.id !== image.id);
            setFavorites(updated);
        } else {
            const newFav = {
                id: image.id,
                url: image.urls.small,
                fullUrl: image.urls.regular,
                photographer: image.user.name,
                username: image.user.username,
                download: image.links.download,
            };
            setFavorites([...favorites, newFav]);
        }
    };

    const isFavorited = (id) => favorites.some((fav) => fav.id === id);


    const handleDownload = async (photo) => {
        try {
            // Step 1: Ask Unsplash for the actual download URL
            const { data } = await axios.get(photo.links.download_location, {
                headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
            });

            // Step 2: Open the actual image in a new tab (this triggers Unsplash’s download)
            window.open(data.url, "_blank");

        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download image. Please try again.");
        }
    };


    return (
        <>
            <div className="min-h-screen bg-[#0f0f10] text-gray-200">
                {/* 🔹 Header with Search */}
                <header className="pt-24 text-center py-10 px-4">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Pixora
                    </h1>
                    <p className="text-gray-400 mb-6">
                        Discover and download stunning images ✨
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="max-w-xl mx-auto flex items-center bg-[#18181b] border border-gray-800 rounded-full px-4 py-2 focus-within:border-purple-500/60 transition"
                    >
                        <Search className="text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search for photos..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent px-3 py-2 text-gray-200 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1.5 rounded-full font-medium hover:opacity-90 transition"
                        >
                            Search
                        </button>
                    </form>
                </header>

                {/* 🔹 Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-6 pb-10">
                    {loading ? (
                        <p className="col-span-full text-center text-gray-500">
                            Loading images...
                        </p>
                    ) : (
                        images.map((img) => (
                            <motion.div
                                key={img.id}
                                layoutId={img.id}
                                onClick={() => setSelectedImage(img)}
                                className="cursor-pointer overflow-hidden rounded-xl group relative"
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <img
                                    src={img.urls.small}
                                    alt={img.alt_description}
                                    className="w-full h-full object-cover rounded-xl group-hover:opacity-90 transition"
                                />
                                {isFavorited(img.id) && (
                                    <Heart
                                        size={20}
                                        className="absolute top-2 right-2 text-pink-500 drop-shadow-md"
                                        fill="currentColor"
                                    />
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

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

                            {/* Centered Modal */}
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
                                                {selectedImage.user.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                @{selectedImage.user.username}
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
                                            src={selectedImage.urls.regular}
                                            alt={selectedImage.alt_description}
                                            className="max-h-[75vh] w-auto object-contain rounded-lg"
                                        />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center px-5 py-3 border-t border-gray-800 bg-[#111113]/80 backdrop-blur-lg">
                                        <button
                                            className={`flex items-center gap-2 ${isFavorited(selectedImage.id)
                                                ? "text-pink-500"
                                                : "text-gray-300 hover:text-pink-400"
                                                } transition`}
                                            onClick={() => toggleFavorite(selectedImage)}
                                        >
                                            <Heart
                                                size={18}
                                                fill={
                                                    isFavorited(selectedImage.id) ? "currentColor" : "none"
                                                }
                                            />
                                            <span>
                                                {isFavorited(selectedImage.id)
                                                    ? "Favorited"
                                                    : "Add to Favorites"}
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => handleDownload(selectedImage)}
                                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
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

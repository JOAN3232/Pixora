import React from "react";

export default function ImageGrid({ images, onImageClick }) {
  if (!images || images.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-12">
        Explore visual stories waiting to be found 🔦
      </p>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-6xl">
      {images.map((img) => (
        <div
          key={img.id}
          className="relative group overflow-hidden rounded-2xl break-inside-avoid bg-[#141416] cursor-pointer"
          onClick={() => onImageClick(img)}
        >
          <img
            src={img.urls.small}
            alt={img.alt_description}
            className="w-full rounded-2xl transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 rounded-2xl">
            <p className="text-gray-100 text-sm font-medium">{img.user.name}</p>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 text-xs rounded-full font-semibold">
              View
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

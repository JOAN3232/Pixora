import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-[#18181b] rounded-full shadow-md hover:shadow-[0_0_15px_#7e22ce55] transition-shadow duration-300"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search breathtaking moments..."
        className="flex-grow px-5 py-3 bg-transparent text-gray-200 placeholder-gray-500 rounded-l-full focus:outline-none"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-r-full hover:from-purple-500 hover:to-blue-500 transition-all"
      >
        <Search size={22} className="text-white" />
      </button>
    </form>
  );
}

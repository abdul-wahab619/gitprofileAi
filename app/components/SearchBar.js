"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [username, setUsername] = useState("");

  return (
    <div className="flex justify-center gap-2">
      <input
        className="px-4 py-2 text-black rounded-full focus:outline-none"
        placeholder="GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={() => onSearch(username)}
        className="bg-blue-600 px-4 py-2 rounded-full border-2 border-amber-50 hover:scale-105 transition"
      >
        Analyze
      </button>
    </div>
  );
}

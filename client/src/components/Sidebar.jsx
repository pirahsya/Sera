import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets";
import { Search } from "lucide-react";

const Sidebar = () => {
  const { chats, setSelectedChat, theme, setTheme, user } = useAppContext();
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#24216E]/30 to-[#000000]/30 border-r border-[#1E1980]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1">
      {/* Logo */}
      <img
        // src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-48"
      />

      {/* New Chat Button */}
      <button className="flex justify-center items-center w-full py-2 mt-10 text-white bg-linear-to-r from-[#7C55F0] to-[#3D81F6] text-sm rounded-md cursor-pointer">
        <span className="mr-2 text-xl">+</span> Obrolan baru
      </button>

      {/* Search Conversations */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
        <Search size={16} className="text-gray-600 dark:text-white" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Cari obrolan"
          className="text-xs placeholder:text-gray-400 outline-none"
        />
      </div>
    </div>
  );
};

export default Sidebar;

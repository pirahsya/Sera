import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets";
import { Search, Trash2, Images, Wallet, Moon, Sun } from "lucide-react";

const Sidebar = () => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate } =
    useAppContext();
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

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Obrolan terbaru</p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat.id}
              className="p-2 px-4 dark:bg-[#241E80]/10 border border-gray-300 dark:border-[#1E1980]/15 rounded-md cursor-pointer flex justify-between group"
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {chat.updatedAt}
                </p>
              </div>
              <Trash2
                size={16}
                className="hidden group-hover:block text-gray-600 dark:text-white cursor-pointer"
              />
            </div>
          ))}
      </div>

      {/* Library */}
      <div
        onClick={() => {
          navigate("/perpustakaan");
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <Images size={16} className="text-gray-600 dark:text-white" />
        <div className="flex flex-col text-sm">
          <p>Perpustakaan</p>
        </div>
      </div>

      {/* Credit Purchase Option */}
      <div
        onClick={() => {
          navigate("/kredit");
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <Wallet size={16} className="text-gray-600 dark:text-white" />
        <div className="flex flex-col text-sm">
          <p>Kredit: {user?.credits}</p>
          <p className="text-xs text-gray-400">Isi kredit</p>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          {theme === "dark" ? (
            <Sun size={16} className="text-gray-600 dark:text-white" />
          ) : (
            <Moon size={16} className="text-gray-600 dark:text-white" />
          )}
          <p>Dark Mode</p>
        </div>
        <label className="relative inline-flex cursor-pointer">
          <input
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-[#241E80] transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>
    </div>
  );
};

export default Sidebar;

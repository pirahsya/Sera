import { useState } from "react";
import {
  Search,
  Trash2,
  Images,
  Wallet,
  Moon,
  Sun,
  CircleUser,
  LogOut,
  X,
  Plus,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/useAppContext";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUsersChats,
    setToken,
    token,
    setUser,
  } = useAppContext();

  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setChats([]);
    navigate("/");
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!window.confirm("Hapus obrolan ini?")) return;

    try {
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUsersChats();
        toast.success("Berhasil dihapus");
      }
    } catch (error) {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-70 max-w-70 p-5 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 max-md:fixed left-0 z-60 ${
        !isMenuOpen ? "max-md:-translate-x-full" : "max-md:translate-x-0"
      }`}
    >
      <button
        onClick={() => setIsMenuOpen(false)}
        className="md:hidden absolute top-5 right-5 text-gray-400"
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-2 mb-6 px-2">
        <Sparkles
          size={24}
          fill="currentColor"
          className="text-gray-900 dark:text-white"
        />
        <span className="font-bold text-xl tracking-tight">Sera</span>
      </div>

      <button
        onClick={createNewChat}
        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm"
      >
        <Plus size={18} />
        <span>Obrolan baru</span>
      </button>

      <div className="flex items-center gap-2 px-3 py-2.5 mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-gray-100 dark:focus-within:ring-gray-800 transition-all">
        <Search size={16} className="text-gray-400" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Cari obrolan..."
          className="bg-transparent text-sm w-full outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto mt-6 space-y-1 custom-scrollbar">
        {chats.length > 0 && (
          <p className="px-2 mb-2 text-[10px] font-bold text-gray-400 tracking-widest">
            Obrolan Terbaru
          </p>
        )}
        {chats
          .filter((chat) =>
            (chat.name || chat.messages[0]?.content || "")
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate(`/c/${chat._id}`);
                setIsMenuOpen(false);
              }}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors"
            >
              <p className="text-sm truncate pr-2 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                {chat.name || chat.messages[0]?.content || "Obrolan baru"}
              </p>
              <button
                onClick={(e) => deleteChat(e, chat._id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 rounded-md transition-all cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
      </div>

      <div className="mt-auto pt-4 space-y-1 border-t border-gray-100 dark:border-gray-900">
        <div
          onClick={() => {
            navigate("/perpustakaan");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer text-gray-600 dark:text-gray-400"
        >
          <Images size={18} />
          <span className="text-sm font-medium">Perpustakaan</span>
        </div>

        <div
          onClick={() => {
            navigate("/kredit");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer text-gray-600 dark:text-gray-400"
        >
          <Wallet size={18} />
          <div className="flex-1 flex justify-between items-center text-sm font-medium">
            <span>Kredit</span>
            <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-900 dark:text-gray-100">
              {user?.credits || 0}
            </span>
          </div>
        </div>

        <div
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-medium">
              {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 mt-2 rounded-2xl bg-gray-100 dark:bg-gray-900">
          <CircleUser size={20} className="text-gray-500" />
          <p className="flex-1 text-xs font-bold truncate tracking-tight">
            {user?.name || "User"}
          </p>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

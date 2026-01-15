import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/useAppContext";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Login from "./pages/Login";
import Credit from "./pages/Credit";
import Library from "./pages/Library";
import Loading from "./pages/Loading";
import "./assets/prism.css";

const App = () => {
  const { user, loadingUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/memuat" || loadingUser) return <Loading />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Toaster />

      {user ? (
        <div className="flex h-screen w-screen overflow-hidden relative">
          {!isMenuOpen && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="absolute top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 md:hidden text-gray-600 dark:text-gray-400 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
          )}

          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          <main className="flex-1 relative flex flex-col min-w-0">
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/c/:chatId" element={<ChatBox />} />
              <Route path="/kredit" element={<Credit />} />
              <Route path="/perpustakaan" element={<Library />} />
            </Routes>
          </main>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </div>
  );
};

export default App;

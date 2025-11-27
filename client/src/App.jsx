import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Credit from "./pages/Credit";
import Library from "./pages/Library";
import { Menu } from "lucide-react";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadingUser } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/memuat" || loadingUser) return <Loading />;

  return (
    <>
      <Toaster />
      {!isMenuOpen && (
        <Menu
          onClick={() => setIsMenuOpen(true)}
          size={20}
          className="absolute top-3 left-3 cursor-pointer md:hidden text-gray-600 dark:text-white"
        />
      )}

      {user ? (
        <div className="dark:bg-linear-to-b from-[#24216E] to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/kredit" element={<Credit />} />
              <Route path="/perpustakaan" element={<Library />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-b from-primary to-[#000000] flex items-center justify-center h-screen w-screen">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;

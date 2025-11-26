import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Credit from "./pages/Credit";
import Library from "./pages/Library";
import { Menu } from "lucide-react";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {!isMenuOpen && (
        <Menu
          onClick={() => setIsMenuOpen(true)}
          size={20}
          className="absolute top-3 left-3 cursor-pointer md:hidden text-gray-600 dark:text-white"
        />
      )}
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
    </>
  );
};

export default App;

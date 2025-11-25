import React from "react";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <div className="dark:bg-linear-to-b from-[#24216E] to-[#000000] dark:text-white">
        <div className="flex h-screen w-screen">
          <Sidebar />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/kredit" element={<Credit />} />
            <Route path="/perpustakaan" element={<Credit />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;

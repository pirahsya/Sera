import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
    >
      <p className="text-2xl font-medium m-auto">
        {state === "login" ? "Masuk" : "Daftar Akun"}
      </p>
      {state === "register" && (
        <div className="w-full">
          <p>Nama</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Masukkan nama Anda"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#1A2260]"
            type="text"
            required
          />
        </div>
      )}
      <div className="w-full ">
        <p>Email</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Masukkan email Anda"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#1A2260]"
          type="email"
          required
        />
      </div>
      <div className="w-full ">
        <p>Kata Sandi</p>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Masukkan kata sandi"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#1A2260]"
          type="password"
          required
        />
      </div>
      {state === "register" ? (
        <p>
          Sudah punya akun?{" "}
          <span
            onClick={() => setState("login")}
            className="text-[#1A2260] cursor-pointer"
          >
            Masuk
          </span>
        </p>
      ) : (
        <p>
          Belum punya akun?{" "}
          <span
            onClick={() => setState("register")}
            className="text-[#1A2260] cursor-pointer"
          >
            Daftar
          </span>
        </p>
      )}
      <button
        type="submit"
        className="bg-[#1A2260] hover:bg-[#151A50] transition-all text-white w-full py-2 rounded-md cursor-pointer"
      >
        {state === "register" ? "Buat Akun" : "Masuk"}
      </button>
    </form>
  );
};

export default Login;

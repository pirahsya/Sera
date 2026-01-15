import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/useAppContext";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const url = state === "login" ? "/api/user/login" : "/api/user/register";

    try {
      const { data } = await axios.post(url, { name, email, password });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-100 px-6 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] shadow-2xl dark:shadow-none p-8 sm:p-10 flex flex-col gap-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {state === "login" ? "Masuk" : "Daftar"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {state === "login"
              ? "Selamat datang kembali di Sera"
              : "Mulai perjalanan Anda bersama Sera"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {state === "register" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest ml-1">
                Nama
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Siapa nama Anda?"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all dark:text-white"
                type="text"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest ml-1">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all dark:text-white"
              type="email"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest ml-1">
              Kata Sandi
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Masukkan kata sandi"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all dark:text-white"
              type="password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg dark:shadow-none disabled:opacity-50"
          >
            {loading
              ? "Memuat..."
              : state === "register"
              ? "Daftar Sekarang"
              : "Masuk ke Sera"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            {state === "register" ? "Sudah punya akun? " : "Belum punya akun? "}
            <span
              onClick={() =>
                !loading && setState(state === "login" ? "register" : "login")
              }
              className={`text-gray-900 dark:text-white font-bold cursor-pointer hover:underline underline-offset-4 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {state === "login" ? "Daftar" : "Masuk"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

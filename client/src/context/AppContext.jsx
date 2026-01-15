import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "./ChatContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    const osTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    localStorage.setItem("theme", osTheme);
    return osTheme;
  });

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingUser(false);
    }
  }, [token]);

  const fetchUsersChats = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setChats(data.chats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [token]);

  const createNewChat = () => {
    if (!user) return toast.error("Silakan masuk terlebih dahulu");
    navigate("/");
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e) => {
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        toggleTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
      localStorage.setItem("token", token);
    } else {
      setUser(null);
      setLoadingUser(false);
      localStorage.removeItem("token");
    }
  }, [token, fetchUser]);

  useEffect(() => {
    if (user) {
      fetchUsersChats();
    } else {
      setChats([]);
    }
  }, [user, fetchUsersChats]);

  const value = {
    user,
    setUser,
    token,
    setToken,
    chats,
    setChats,
    theme,
    setTheme: toggleTheme,
    loadingUser,
    axios,
    navigate,
    fetchUser,
    fetchUsersChats,
    createNewChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

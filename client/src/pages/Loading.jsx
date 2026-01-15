import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUser } = useAppContext();

  useEffect(() => {
    if (location.search) {
      navigate("/memuat", { replace: true });
    }

    const timeout = setTimeout(() => {
      fetchUser();
      navigate("/");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [navigate, location.search, fetchUser]);

  return (
    <div className="bg-white dark:bg-gray-950 flex flex-col items-center justify-center h-screen w-screen transition-colors duration-200">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-800"></div>
        <div className="absolute w-12 h-12 rounded-full border-2 border-gray-900 dark:border-white border-t-transparent dark:border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
import { useEffect, useState, useCallback } from "react";
import Loading from "../pages/Loading";
import { useAppContext } from "../context/useAppContext";
import toast from "react-hot-toast";

const Library = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, token } = useAppContext();

  const fetchImages = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/images", {
        headers: { Authorization: token },
      });

      if (data.success) {
        setImages(data.images);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [axios, token]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  if (loading) return <Loading />;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white dark:bg-gray-950 transition-colors duration-200 custom-scrollbar">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Perpustakaan
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Koleksi gambar dan visualisasi yang Anda buat bersama Sera.
          </p>
        </header>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((item, index) => (
              <a
                key={index}
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 mb-6 rounded-3xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-800">
              <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-md rotate-12" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Belum ada visualisasi
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              Minta Sera untuk mengubah ide Anda menjadi gambar atau diagram,
              dan temukan hasilnya di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;

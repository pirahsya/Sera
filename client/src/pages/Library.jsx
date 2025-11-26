import React, { useEffect, useState } from "react";
import Loading from "./Loading";

const Library = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setImages([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-[#D6DBFF]">
        Perpustakaan
      </h2>

      {images.length > 0 ? (
        <div className="flex flex-wrap max-sm:justify-center gap-5">
          {images.map((item, index) => (
            <a
              key={index}
              href={item.imageUrl}
              target="_blank"
              className="relative group block rounded-lg overflow-hidden border border-gray-200 dark:border-[#1A2260] shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </a>
          ))}
        </div>
      ) : (
        <div className="py-8">
          <p className="text-base sm:text-lg text-center text-gray-600 dark:text-[#BFC9FF] mt-10">
            Visualisasikan apa pun, temukan di sini
          </p>
          <p className="text-sm sm:text-base text-center text-gray-400 dark:text-[#5C60A0]">
            Minta Sera untuk mengubah ide apa pun menjadi gambar, diagram, atau
            visual.
          </p>
        </div>
      )}
    </div>
  );
};

export default Library;

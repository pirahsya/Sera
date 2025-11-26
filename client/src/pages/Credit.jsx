import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { dummyPlans } from "../assets/assets";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(number)
    .replace(/\s/g, "");
};

const Credit = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white">
        Paket Kredit
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`border border-gray-200 dark:border-[#1A2260] rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-[300px] flex flex-col ${
              plan._id === "pro"
                ? "bg-[#E3E6FF] dark:bg-[#121548]"
                : "bg-white dark:bg-transparent"
            }`}
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold text-[#241E80] dark:text-[#A3B6FF] mb-4">
                {formatRupiah(plan.price)}
                <span className="text-base font-normal text-gray-600 dark:text-[#BFC9FF]">
                  {" "}
                  / {plan.credits} kredit
                </span>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-[#BFC9FF] space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button className="mt-6 bg-[#241E80] hover:bg-[#1A2260] active:bg-[#151A50] text-white font-medium py-2 rounded transition-colors cursor-pointer">
              Beli Sekarang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credit;

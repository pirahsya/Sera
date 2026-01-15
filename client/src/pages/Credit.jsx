import { useEffect, useState, useCallback } from "react";
import Loading from "../pages/Loading";
import { useAppContext } from "../context/useAppContext";
import toast from "react-hot-toast";

const Credit = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, token } = useAppContext();

  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        headers: { Authorization: token },
      });

      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Gagal mengambil data paket");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [axios, token]);

  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (loading) return <Loading />;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Paket Kredit
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Pilih paket yang sesuai dengan kebutuhan AI Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`relative flex flex-col p-8 rounded-4xl border transition-all duration-300 ${
                plan._id === "plus"
                  ? "bg-gray-900 dark:bg-white border-transparent shadow-xl"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold ${
                    plan._id === "plus"
                      ? "text-white dark:text-gray-900"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-extrabold ${
                      plan._id === "plus"
                        ? "text-white dark:text-gray-900"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    Rp{plan.price.toLocaleString("id-ID")}
                  </span>
                  <span
                    className={`text-sm ${
                      plan._id === "plus"
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    / {plan.credits} kredit
                  </span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <div
                        className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                          plan._id === "plus"
                            ? "bg-gray-400 dark:bg-gray-300"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                      <span
                        className={
                          plan._id === "plus"
                            ? "text-gray-300 dark:text-gray-600"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() =>
                  toast.promise(purchasePlan(plan._id), {
                    loading: "Memproses...",
                    success: "Mengalihkan ke pembayaran",
                    error: "Gagal memproses",
                  })
                }
                className={`mt-10 w-full py-4 rounded-xl font-bold text-sm transition-all cursor-pointer active:scale-[0.98] ${
                  plan._id === "plus"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:opacity-90"
                    : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 shadow-md"
                }`}
              >
                Beli Sekarang
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Credit;

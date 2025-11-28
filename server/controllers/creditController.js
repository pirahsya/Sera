import midtransClient from "midtrans-client";
import Transaction from "../models/Transaction.js";

const plans = [
  {
    _id: "basic",
    name: "Dasar",
    price: 149900,
    credits: 100,
    features: [
      "Ringan & mudah digunakan",
      "Cukup untuk beberapa proyek kecil",
      "Mulai eksplorasi tanpa risiko",
      "Cocok untuk pemula",
    ],
  },
  {
    _id: "plus",
    name: "Plus",
    price: 279900,
    credits: 500,
    features: [
      "Paket terpopuler",
      "Ideal untuk penggunaan reguler",
      "Hemat waktu & biaya",
      "Cocok untuk pengguna aktif",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 449900,
    credits: 1000,
    features: [
      "Maksimalkan produktivitas",
      "Untuk kebutuhan besar",
      "Paket lengkap & efisien",
      "Cocok untuk profesional",
    ],
  },
];

// API to get all plans
export const getPlans = async (req, res) => {
  try {
    res.json({ success: true, plans: plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to purchase a plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const userId = req.user._id;

    const plan = plans.find((plan) => plan._id === planId);

    if (!plan) {
      return res.json({ success: false, message: "Paket tidak ditemukan" });
    }

    const orderId = `${userId}-${Date.now()}`;

    const transaction = await Transaction.create({
      userId: userId,
      planId: plan._id,
      orderId: orderId,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: plan.price,
      },
    };

    const midtrans = await snap.createTransaction(parameter);

    res.json({
      success: true,
      snapToken: midtrans.token,
      redirectUrl: midtrans.redirect_url,
      transactionId: transaction._id,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

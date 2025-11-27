import midtransClient from "midtrans-client";
import Transaction from "../models/Transaction.js";

// API to handle payment notification
export const paymentNotification = async (req, res) => {
  try {
    const core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const data = await core.transaction.notification(req.body);

    const success =
      (data.transaction_status === "capture" &&
        data.fraud_status === "accept") ||
      data.transaction_status === "settlement";

    const failed =
      data.transaction_status === "cancel" ||
      data.transaction_status === "deny" ||
      data.transaction_status === "expire";

    const transaction = await Transaction.findOne({ orderId: data.order_id });

    if (!transaction) {
      return res.json({ success: false });
    }

    if (success) transaction.isPaid = true;

    if (failed) transaction.isPaid = false;

    await transaction.save();

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

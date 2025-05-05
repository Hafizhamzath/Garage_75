const express = require("express");
const Stripe = require("stripe");
const router = express.Router();
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Test Stripe connection on startup
stripe.accounts.retrieve()
  .then(account => console.log("✅ Stripe connected:", account.id))
  .catch(err => console.error("❌ Stripe connection failed:", err.message));

if (!process.env.FRONTEND_URL) {
  console.error("❌ ERROR: FRONTEND_URL is missing in .env");
  process.exit(1);
}

router.post("/", async (req, res) => {
  try {
    const { amount, currency, orderId } = req.body;
    console.log("Payment Request Payload:", { amount, currency, orderId }); // Debug

    // Validate inputs
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      return res.status(400).json({ message: "Invalid amount: Must be a positive integer" });
    }

    // Cap amount to ₹99,999,999 (9,999,999,900 paise)
    if (amount > 99999999) {
      return res.status(400).json({ message: "Amount exceeds maximum limit of ₹99,999,999" });
    }

    if (!orderId) {
      return res.status(400).json({ message: "Missing order ID" });
    }

    if (!currency || currency.toLowerCase() !== "inr") {
      return res.status(400).json({ message: "Invalid currency: Must be 'inr'" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: "Your Cart Items" },
            unit_amount: amount * 100, // Convert rupees to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-confirmation?orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    console.log("Stripe Session Created:", session.id); // Debug
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", {
      message: error.message,
      type: error.type,
      code: error.code,
      requestId: error.requestId,
      raw: error.raw,
      stack: error.stack,
    });
    res.status(500).json({ message: "Payment processing failed", error: error.message });
  }
});

module.exports = router;
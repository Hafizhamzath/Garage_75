import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import API from "../services/api";
import Footer from "../components/Footer";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  throw new Error("❌ Stripe Public Key is missing! Check your .env file.");
}

const stripePromise = loadStripe(stripePublicKey);

function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize.");

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      console.log("Cart:", cart); // Debug
      const totalAmount = Math.round(cart.reduce((total, item) => total + item.price, 0)) || 0;
      console.log("Total Amount:", totalAmount); // Debug

      if (cart.length === 0) {
        alert("Your cart is empty!");
        setLoading(false);
        return;
      }

      // Cap amount to avoid Stripe limits (₹99,999,999)
      if (totalAmount > 99999999) {
        alert("Total amount exceeds maximum limit of ₹99,999,999. Please reduce your cart.");
        setLoading(false);
        return;
      }

      // Ensure cart items match orderItems schema
      const orderItems = cart.map(item => ({
        name: item.name || "Unknown Item",
        quantity: item.quantity || 1,
        price: item.price || 0,
      }));

      // Create the order
      const orderResponse = await API.post("/orders", {
        orderItems,
        totalPrice: totalAmount,
      });

      console.log("Order Response:", orderResponse.data); // Debug
      if (!orderResponse.data || !orderResponse.data._id) {
        throw new Error("Failed to save order to database");
      }

      const orderId = orderResponse.data._id;

      // Make payment request
      const paymentResponse = await API.post("/payments", {
        amount: totalAmount,
        currency: "inr",
        orderId,
      });

      console.log("Payment Response:", paymentResponse.data); // Debug
      if (!paymentResponse.data || !paymentResponse.data.sessionId) {
        throw new Error("Invalid payment response: sessionId is missing");
      }

      const { sessionId } = paymentResponse.data;

      // Redirect to Stripe checkout
      await stripe.redirectToCheckout({ sessionId });

    } catch (error) {
      console.error("Payment Processing Error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong with the payment";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container className="mt-4 text-center">
        <h2>Complete Your Payment</h2>
        <Button variant="success" disabled={loading} onClick={handlePayment}>
          {loading ? "Processing..." : "Pay with Stripe"}
        </Button>
      </Container>
      <Footer />
    </div>
  );
}

export default Payment;
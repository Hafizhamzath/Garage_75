import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify"; // Ensure toast is used for notifications
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";

function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState(localStorage.getItem("deliveryAddress") || "");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState(null);

  // ✅ Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("❌ Please log in to continue checkout!");
      navigate("/login");
    }
  }, [navigate]); // ✅ Only runs once when the component mounts
  

  const handlePayment = () => {
    if (!address.trim()) {
      setError("Please enter a valid delivery address.");
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    if (paymentMethod === "COD") {
      setError("Cash on Delivery (COD) is not available for this product.");
      return;
    }

    localStorage.setItem("deliveryAddress", address);
    navigate("/payment");
  };

  return (
    <div>
      <Container className="mt-4" style={{ maxWidth: "600px" }}>
        <h2>Checkout</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {/* Address Input */}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>

          {/* Payment Method Selection */}
          <h4>Select Payment Method</h4>
          <Form.Check 
            type="radio" 
            label="Cash on Delivery (COD)" 
            name="payment" 
            value="COD"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <Form.Check 
            type="radio" 
            label="Online Payment" 
            name="payment" 
            value="Online"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <Button variant="success" className="mt-3" onClick={handlePayment}>
            Proceed to Payment
          </Button>
        </Form>
      </Container>
      <Footer />
    </div>
  );
}

export default Checkout;

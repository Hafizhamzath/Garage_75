import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { Container, Card, Button, Spinner, Alert, Badge, Row, Col, ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      
      // Get order ID from URL query params
      const queryParams = new URLSearchParams(location.search);
      const orderId = queryParams.get("orderId");

      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/orders/${orderId}`);
        setOrder(response.data);

        // Clear cart after successful order confirmation
        localStorage.setItem("cart", JSON.stringify([]));
        toast.success("🛒 Your cart has been cleared!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("❌ Failed to fetch order details", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location]);

  // Get Future Delivery Date (Always 10 Days from Today)
  const getFutureDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 10); // Add 10 days
    return today.toDateString();
  };

  return (
    <Container className="mt-5">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Fetching order details...</p>
        </div>
      ) : order ? (
        <>
          {/* Order Success Card */}
          <Card className="p-4 shadow-lg mb-4 text-center bg-light">
            <h2>🎉 Order Confirmed!</h2>
            <p>Thank you for your purchase! Your order details are below.</p>

            <h5>Order ID: <strong>{order._id}</strong></h5>
            <h5>Status: {order.isPaid ? (
              <Badge bg="success">Paid</Badge>
            ) : (
              <Badge bg="danger">Unpaid</Badge>
            )}</h5>

            <h4 className="mt-3">Total: ₹{order.totalPrice}</h4>
          </Card>

          {/* Order Progress Timeline */}
          <Card className="p-4 shadow-lg mb-4">
            <h3 className="text-center">📦 Order Status</h3>
            <ProgressBar animated now={75} label="Dispatched" variant="info" className="mt-3" />
            <p className="text-center mt-2">Estimated Delivery:15 days <strong></strong></p>
          </Card>

          {/* Order Items Summary */}
          <Card className="p-4 shadow-lg mb-4">
            <h3 className="text-center mb-3">🛍️ Items in Your Order</h3>
            <Row>
              {order.orderItems.map((item, index) => (
                <Col md={6} key={index} className="mb-3">
                  <Card className="p-3 shadow-sm">
                    <Card.Body>
                      <Card.Title>🛒 {item.name}</Card.Title>
                      <Card.Text><strong>Quantity:</strong> {item.quantity}</Card.Text>
                      <Card.Text><strong>Price:</strong> ₹{item.price}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Thank You & Offers Section */}
          <Card className="p-4 shadow-lg mb-4 bg-light text-center">
            <h4>🎁 Special Offer for You!</h4>
            <p>Enjoy <strong>10% OFF</strong> on your next purchase. Use code: <Badge bg="success">THANKYOU10</Badge></p>
          </Card>

          {/* Continue Shopping Button */}
          <div className="text-center mt-4">
            <Button variant="primary" size="lg" onClick={() => navigate("/products")}>
              🛒 Continue Shopping
            </Button>
          </div>
        </>
      ) : (
        <Alert variant="warning" className="text-center">No recent orders found.</Alert>
      )}
    </Container>
  );
}

export default OrderConfirmation;
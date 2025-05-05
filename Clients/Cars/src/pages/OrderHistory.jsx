import { useEffect, useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Axios instance for API calls

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container className="mt-5">
      <h2>📦 My Orders</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Price</th>
              <th>Paid</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>₹{order.totalPrice}</td>
                <td>{order.isPaid ? "✅ Yes" : "❌ No"}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => navigate(`/order-confirmation/${order._id}`)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Button variant="primary" className="mt-3" onClick={() => navigate("/")}>Back to Home</Button>
    </Container>
  );
}

export default OrderHistory;

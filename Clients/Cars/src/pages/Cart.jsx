import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Card, Row, Col, Form, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart);
    toast.success("🗑️ Item removed from cart!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    updateCart(updatedCart);
    toast.info(`📦 Updated ${updatedCart[index].name} quantity to ${newQuantity}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <div>
      <Container className="mt-5 mb-5">
        <h2 className="mb-4 d-flex align-items-center">
          <FaShoppingCart className="me-2" /> Your Shopping Cart{" "}
          <Badge bg="primary" className="ms-2">{totalItems} {totalItems === 1 ? "Item" : "Items"}</Badge>
        </h2>

        {cart.length === 0 ? (
          <Card className="shadow-sm border-0 text-center p-4">
            <Card.Body>
              
              <h3>Your Cart is Empty</h3>
              <p className="text-muted">
                Looks like you haven't added any cars yet. Start shopping now!
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/products")}
                className="mt-3"
              >
                Shop Now <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Car</th>
                      <th>Image</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((car, index) => (
                      <tr key={index}>
                        <td className="align-middle">{car.name}</td>
                        <td className="align-middle">
                          <img
                            src={car.images && car.images.length > 0 ? car.images[0] : "/default-image.jpg"}
                            alt={car.name}
                            style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                          />
                        </td>
                        <td className="align-middle">{formatPrice(car.price)}</td>
                        <td className="align-middle">
                          <Form.Select
                            value={car.quantity || 1}
                            onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                            style={{ width: "80px" }}
                          >
                            {[1, 2, 3, 4, 5].map((qty) => (
                              <option key={qty} value={qty}>
                                {qty}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td className="align-middle">
                          {formatPrice(car.price * (car.quantity || 1))}
                        </td>
                        <td className="align-middle">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeFromCart(index)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="shadow-sm border-0 p-4 mt-4 mt-lg-0">
                <h4 className="mb-3">Cart Summary</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Items:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal:</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleCheckout}
                  className="w-100 d-flex align-items-center justify-content-center"
                >
                  Proceed to Checkout <FaArrowRight className="ms-2" />
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />

      <style>
        {`
          .cart-table th, .cart-table td {
            padding: 15px;
            vertical-align: middle;
          }
          .cart-table tr:hover {
            background-color: #f8f9fa;
          }
          .btn-primary, .btn-success {
            transition: all 0.3s ease;
          }
          .btn-primary:hover, .btn-success:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          @media (max-width: 768px) {
            .cart-table {
              font-size: 14px;
            }
            .cart-table img {
              width: 60px;
              height: 40px;
            }
            .cart-summary {
              margin-top: 20px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Cart;
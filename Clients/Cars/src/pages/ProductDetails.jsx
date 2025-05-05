import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Container, Row, Col, Image, Button, Carousel, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://garage-75.onrender.com/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          setCar(data);
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setError("Error fetching product details");
      });
  }, [id]);

  // ✅ Function to check login status and add to cart
  const addToCart = () => {
    const token = localStorage.getItem("token"); // Check if user is logged in
  
    if (!token) {
      toast.error("❌ Please log in to buy this car!", {
        position: "top-center",
        autoClose: 2000, // Closes after 2s
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
  
      localStorage.setItem("redirectAfterLogin", "/checkout"); // Save redirect path
  
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2s
      return;
    }
  
    const storedCart = JSON.parse(localStorage.getItem("cart")) || []; 
    const updatedCart = [...storedCart, car];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    toast.success("✅ Car added to cart successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
  
    setTimeout(() => navigate("/checkout"), 2000); // Redirect to checkout after success
  };
  

  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!car) return <p className="text-center">Loading...</p>;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Carousel>
            {car.images.map((img, index) => (
              <Carousel.Item key={index}>
                <Image 
                  src={img} 
                  alt={`Image ${index + 1}`} 
                  fluid 
                  style={{ width: "100%", height: "400px", objectFit: "cover" }} 
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={6}>
          <h2>{car.name}</h2>
          <p>{car.description}</p>
          <h5>Category: {car.category}</h5>
          <h4>Price: ₹{car.price}</h4>
          <ListGroup variant="flush" className="mt-3">
            <ListGroup.Item><strong>Condition:</strong> Excellent</ListGroup.Item>
            <ListGroup.Item><strong>Mileage:</strong> 25,000 km</ListGroup.Item>
            <ListGroup.Item><strong>Fuel Type:</strong> Petrol</ListGroup.Item>
            <ListGroup.Item><strong>Transmission:</strong> Automatic</ListGroup.Item>
            <ListGroup.Item><strong>Location:</strong> Mumbai, India</ListGroup.Item>
          </ListGroup>
          <Button variant="success" className="mt-3" onClick={addToCart}>Buy Now</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetails;

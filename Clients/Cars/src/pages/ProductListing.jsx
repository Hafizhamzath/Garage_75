import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSort } from "react-icons/fa"; // Import sorting icon

function ProductListing() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // State for sorting

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://garage-75.onrender.com/api/products")
      .then((response) => response.json())
      .then((data) => {
        setCars(data);
        setFilteredCars(data);
      })
      .catch((error) => console.error("Error fetching cars:", error));
  }, []);

  // 🔍 Filter & Search Function
  useEffect(() => {
    let filtered = cars.filter((car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting Logic
    if (sortOrder === "low-to-high") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredCars(filtered);
  }, [searchTerm, sortOrder, cars]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Used Cars for Sale</h2>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "200px" }}
          />
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <FaSort />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortOrder("low-to-high")}>
                Price: Low to High
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortOrder("high-to-low")}>
                Price: High to Low
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Car Listing */}
      <Row>
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <Col key={car._id} md={4} sm={6} xs={12} className="mb-4">
              <Card style={{ height: "100%" }} className="d-flex flex-column">
              <Card.Img 
  variant="top" 
  src={car.images && car.images.length > 0 ? car.images[0] : "/default-image.jpg"} 
  alt={car.name} 
  style={{ height: "200px", objectFit: "cover" }} 
/>

                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{car.name}</Card.Title>
                    <Card.Text>{car.description}</Card.Text>
                  </div>
                  <div>
                    <Card.Text><strong>Price: ₹{car.price}</strong></Card.Text>
                    <Button variant="primary" onClick={() => navigate(`/product/${car._id}`)}>View Details</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No cars match your criteria.</p>
        )}
      </Row>
    </Container>
  );
}

export default ProductListing;

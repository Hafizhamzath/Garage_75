import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import API from "../services/api";
import Footer from "../components/Footer";


function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const deleteProduct = (id) => {
    API.delete(`/products/${id}`)
      .then(() => setProducts(products.filter(product => product._id !== id)))
      .catch(error => console.error("Error deleting product:", error));
  };

  return (
    <div>
      <Container className="mt-4">
        <h2>Admin Dashboard</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>
                  <Button variant="danger" onClick={() => deleteProduct(product._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <Footer />
    </div>
  );
}

export default AdminDashboard;

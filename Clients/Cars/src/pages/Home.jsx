import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Footer from "../components/Footer";

function Home() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((response) => {
        setCars(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setCars([]);
      });
  }, []);

  return (
    <div>
      {/* Carousel Section */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://res.cloudinary.com/dc54r1zx9/image/upload/v1739987077/ow824lmbijzgagqawf3u.jpg" className="d-block w-100 custom-img" alt="Ford Mustang" style={{ height: "500px", objectFit: "cover" }}/>
          </div>
          <div className="carousel-item">
            <img src="https://res.cloudinary.com/dc54r1zx9/image/upload/v1739987078/anfxbc5e0zvzg3mb8x8j.jpg" className="d-block w-100" alt="BMW" style={{ height: "500px", objectFit: "cover" }} />
          </div>
          <div className="carousel-item">
            <img src="https://res.cloudinary.com/dc54r1zx9/image/upload/v1739987077/tbdhci6yargj7p0shagb.jpg" className="d-block w-100" alt="Porsche"  style={{ height: "500px", objectFit: "cover" }} />
          </div>
          <div className="carousel-item">
            <img src="https://res.cloudinary.com/dc54r1zx9/image/upload/v1739987078/v2rru137b8scalwhofym.jpg" className="d-block w-100" alt="Urus" style={{ height: "500px", objectFit: "cover" }} />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container mt-5 text-center">
        <h2 className="text-center" style={{ textDecoration: 'underline' }}>CAR OF THE DAY</h2>
        <div className="row mt-4">
          <div className="col-md-6">
            <img src="https://res.cloudinary.com/dc54r1zx9/image/upload/v1739987077/kbxnfdwsojjh0n2yy7dl.jpg" className="img-fluid" alt="Bugatti" />
          </div>
          <div className="col-md-6">
            <h4>Bugatti</h4>
            <p>
              Bugatti is synonymous with unparalleled luxury and extraordinary performance. Known for producing some of the fastest cars in the world, Bugatti combines cutting-edge engineering with stunning design.
            </p>
            <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#descriptionModal">More Info</button>
          </div>
        </div>
        {/* Watch Our Collection Button */}
        <div className="mt-4">
          <Link to="/products" className="btn btn-danger btn-lg">Watch Our Collection</Link>
        </div>
      </div>

      <div className="container-fluid bg-light mt-5 py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <h3 className="mb-4">Get in Touch</h3>
              <div className="d-flex mb-3">
                <i className="bi bi-geo-alt-fill text-primary me-3"></i>
                <div>
                  <h5 className="mb-1">Our Location</h5>
                  <p>123 Car Plaza, Andheri West<br />Mumbai, Maharashtra 400053</p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <i className="bi bi-telephone-fill text-primary me-3"></i>
                <div>
                  <h5 className="mb-1">Contact Numbers</h5>
                  <p>Sales: +91 98765 43210<br />Service: +91 98765 43211</p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <i className="bi bi-envelope-fill text-primary me-3"></i>
                <div>
                  <h5 className="mb-1">Email Address</h5>
                  <p>info@garage75.com<br />support@garage75.com</p>
                </div>
              </div>
              <div className="d-flex">
                <i className="bi bi-clock-fill text-primary me-3"></i>
                <div>
                  <h5 className="mb-1">Working Hours</h5>
                  <p>Monday - Saturday: 9:00 AM - 8:00 PM<br />Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="map-container rounded shadow-sm overflow-hidden">
                <iframe src="https://www.google.com/maps/embed?..." width="100%" height="400" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;

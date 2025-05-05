import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Car, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../services/api"; // Ensure this points to your axios API instance
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect to homepage if already logged in
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await API.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });
  
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("localStorageChange")); // 🔁 Trigger update
        toast.success("✅ Login successful! Redirecting...");
  
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
  
        setTimeout(() => navigate(redirectPath), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="app">
      <div className="car-background"></div>
      <div className="registration-container">
        <div className="form-side">
          <div className="brand">
            <Car size={32} className="brand-icon" />
            <h1>Garage_Customs</h1>
          </div>

          <h2>Login to Your Account</h2>
          <p className="subtitle">Welcome back! Please enter your credentials.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : "Login"}
            </button>
          </form>

          <div className="secure-note">
            <ShieldCheck size={16} />
            <span>Your data is securely encrypted</span>
          </div>

          <p className="login-link">
            Don't have an account? <a href="/register">Sign Up</a>
          </p>
        </div>

        <div className="image-side">
          <div className="feature-list">
            <h3>Why Choose Garage_Customs?</h3>
            <ul>
              <li>✓ Access to exclusive car listings</li>
              <li>✓ Verified sellers and buyers</li>
              <li>✓ Secure transactions</li>
              <li>✓ Expert automotive advice</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ShieldCheck, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../services/api"; // Ensure this points to your axios API instance
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        toast.success("✅ Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login page after success
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Registration failed. Try again.");
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

          <h2>Create Your Account</h2>
          <p className="subtitle">Join the premium automotive marketplace</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="terms-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <span className="checkmark"></span>
                <span className="terms-text">
                  I agree to the <a href="/terms">Terms of Service</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="loading-spinner"></span> : "Create Account"}
            </button>
          </form>

          <div className="secure-note">
            <ShieldCheck size={16} />
            <span>Your data is securely encrypted</span>
          </div>

          <p className="login-link">
            Already have an account? <a href="/login">Sign In</a>
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

export default Register;

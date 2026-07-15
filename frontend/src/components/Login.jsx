
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../App.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4888/user/login", formData);

      if (res.data.success) {
        console.log("Backend Response:", res.data);

        const token = res.data.token;
        const userId = res.data.userId || res.data.user?._id;
        
        // 🔥 SABSE SAFEST CHECK: Backend jis bhi format me role de, ye pakad lega
        const role = res.data.role || res.data.user?.role || "user"; 

        if (token && userId) {
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("role", role); 
          
          Swal.fire("Success", `Login Successfully as ${role}!`, "success");

          if (role === "admin") {
            // Admin panel folder par jump karega jo port 3000 par chal raha hai
            window.location.href = "http://localhost:3000/admin"; 
          } else {
            // Normal user ko frontend ke products page par rakhega
            navigate("/Products"); 
            window.location.reload(); 
          }
        } else {
          console.error("Token ya UserId missing!");
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid Email or Password',
        icon: 'error',
        confirmButtonColor: '#1a1a1a'
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Visual Side */}
        <div className="auth-image login-bg">
          <div className="auth-overlay">
            <h2>Welcome Back</h2>
            <p>Login to manage your furniture orders and explore our latest wooden designs.</p>
          </div>
        </div>
        
        {/* Form Side */}
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Login</h1>
            <p>Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="main-auth-form">
            <div className="auth-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="example@wood.com" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Checking..." : "Login Now"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
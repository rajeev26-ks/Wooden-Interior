import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../App.css";

const Checkout = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [productCatalog, setProductCatalog] = useState([]); // Fallback catalog
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!userId) return;
      try {
        const [cartRes, catalogRes] = await Promise.all([
          axios.get(`http://localhost:4888/cart/get/${userId}`).catch(() => ({ data: [] })),
          axios.get(`http://localhost:4888/product/all`).catch(() => ({ data: [] }))
        ]);
        setCartItems(cartRes.data || []);
        setProductCatalog(catalogRes.data || []);
      } catch (err) {
        console.error("Fetch checkout data error:", err);
      }
    };
    fetchCheckoutData();
  }, [userId]);

  // Helper utility to resolve dynamic prices
  const getItemPrice = (item) => {
    if (item.price && Number(String(item.price).replace(/[^\d.]/g, '')) > 0) {
      return Number(String(item.price).replace(/[^\d.]/g, ''));
    }
    if (productCatalog.length > 0) {
      const itemTitleClean = String(item.title || item.name || "").trim().toLowerCase();
      const matchedProduct = productCatalog.find(p => 
        String(p.name || p.title || "").trim().toLowerCase().includes(itemTitleClean)
      );
      if (matchedProduct?.price) {
        return Number(String(matchedProduct.price).replace(/[^\d.]/g, '')) || 0;
      }
    }
    if (String(item.title).toLowerCase().includes("kitchen")) return 670;
    return 500; // Base safe fallback
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((acc, item) => acc + (getItemPrice(item) * (item.quantity || 1)), 0);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      Swal.fire('Empty Cart', 'Aapka cart khali hai, please browse products.', 'warning');
      return;
    }
    
    setLoading(true);

    // Attach accurate values matching your exact backend array destructuring layout
    const preparedCartItems = cartItems.map(item => ({
      ...item,
      price: getItemPrice(item) // Injects actual dynamic pricing inside schema payload arrays
    }));

    const finalPayload = {
      userId: userId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      cartItems: preparedCartItems, // Direct payload mapping
      totalAmount: calculateTotalAmount()
    };

    try {
      const res = await axios.post("http://localhost:4888/order/place", finalPayload);

      if (res.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Order inquiry sent! Check your email.',
          icon: 'success',
          confirmButtonColor: '#a66d3b'
        });

        // Clear cart globally on screen post layout validation
        try {
          await axios.delete(`http://localhost:4888/cart/clear/${userId}`);
          window.dispatchEvent(new Event('cartUpdated'));
        } catch (clearErr) {
          console.error("Cart clear error:", clearErr);
        }

        navigate('/');
      }
    } catch (err) {
      console.error("Order complete failure logic trace:", err);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Mail send  error !',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h2 className="checkout-title">Finalize Your Selection</h2>
        
        <div className="checkout-layout">
          {/* Left: Shipping Form */}
          <form className="shipping-form" onSubmit={handlePlaceOrder}>
            <h3>Shipping Details</h3>
            <div className="form-grid">
              <input type="text" name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
              <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} />
              <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} />
              <input type="text" name="pincode" placeholder="Pincode" required value={formData.pincode} onChange={handleChange} />
              <textarea name="address" placeholder="Full Address" rows="3" required value={formData.address} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? "PROCESSING..." : "SEND ORDER INQUIRY"}
            </button>
          </form>

          {/* Right: Order Summary */}
          <div className="order-summary-sidebar">
            <h3>Your Selection ({cartItems.length})</h3>
            <div className="summary-items-list">
              {cartItems.map(item => (
                <div key={item.productId} className="summary-item">
                  <img src={item.img} alt={item.title} />
                  <div>
                    <p className="item-name">{item.title}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                    <p className="item-price" style={{color: '#a66d3b', fontSize: '0.9rem'}}>
                    ${getItemPrice(item).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="total-divider"></div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span style={{color: '#a66d3b', fontWeight: '700'}}>${calculateTotalAmount().toLocaleString()}</span>
            </div>
            <p className="note">* Our team will contact you for precise pricing and wood quality options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
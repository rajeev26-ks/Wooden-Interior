
import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../App.css";

// 🔥 CRITICAL FIXED BASE ENDPOINT
const API_BASE_URL = "http://localhost:4888";

const Products = () => {
  const navigate = useNavigate();
  
  // 1. Dynamic States Management
  const [filter, setFilter] = useState('All');
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 2. Fetch Live Products Data from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/product/all`);
        setProducts(res.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
        Swal.fire({
          icon: 'error',
          title: 'Sync Error',
          text: 'Backend database se dynamic contents fetch nahi ho paye!',
          confirmButtonColor: '#a66d3b'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', 'Doors', 'Interior', 'Panels', 'Louvers', 'Exterior', 'Mandir', 'Sofa', 'Kitchen'];

  // 3. Client Side Filter Pipe
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(item => item.category === filter);

  // 4. Handle Add To Cart with Dynamic Parameters
  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Please Login', 
        text: 'To order products You need to login first!', 
        confirmButtonColor: '#a66d3b' 
      });
      navigate("/login");
      return;
    }

    try {
      const cartRes = await axios.post(`${API_BASE_URL}/cart/add`, {
        userId,
        productId: String(product._id), 
        title: product.title,
        category: product.category,
        img: product.img, 
        price: product.price || 0, 
        quantity: 1
      });

      if (cartRes.data.success || cartRes.status === 201) {
        window.dispatchEvent(new Event('cartUpdated')); 
        Swal.fire({ 
          icon: 'success', 
          title: 'Added!', 
          text: 'Added to cart Successfully.', 
          timer: 1500, 
          showConfirmButton: false 
        });
      }
    } catch (error) {
      console.error("Cart error trace:", error);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Database error while cart sync!' });
    }
  };

  return (
    <section className="products-section">
      <div className="products-container">
        
        <div className="section-header">
          <span className="subtitle">Our Craftsmanship</span>
          <h2 className="title">Popular Wooden Solutions</h2>

          {/* 🔥 FIX 1: Categories Filter text configuration injected */}
          <div className="category-filter-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button 
                key={cat} 
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat} {/* 👈 Yahan text missing tha jiski wajah se buttons blank the! */}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Conditional Rendering Loop */}
        {loading ? (
          <div className="loading-container" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#a66d3b', fontWeight: '500' }}>Loading premium furniture solutions...</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                
                // SMART IMAGE RESOLVER CHECK
                const absoluteImgUrl = product.img && (product.img.startsWith('http') || product.img.startsWith('data:'))
                  ? product.img
                  : `${API_BASE_URL}/${product.img}`;

                return (
                  <div key={product._id} className="product-card"> 
                    <div className="product-image">
                      <img 
                        src={absoluteImgUrl} 
                        alt={product.title} 
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=500";
                        }}
                      />
                      <div className="product-overlay">
                        <button className="view-details" onClick={() => handleAddToCart(product)}>
                          Add to Cart 🛒
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <span className="cat-tag">{product.category}</span>
                      {/* Displaying product.title dynamically */}
                      <h3>{product.title || "Premium Wooden Craft"}</h3>
                      
                      {/* Dynamic Price Render Layer */}
                      <p className="product-price" style={{ fontWeight: '600', color: '#a66d3b', margin: '5px 0 0 0' }}>
                        ${product.price || 0}
                      </p>
                      
                      <img 
                        src="https://cdn-icons-png.flaticon.com/128/11906/11906637.png" 
                        style={{ width: '20px', marginTop: '5px' }} 
                        alt="rating" 
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-products" style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: '#666' }}>
                No bespoke wooden designs found in this category.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
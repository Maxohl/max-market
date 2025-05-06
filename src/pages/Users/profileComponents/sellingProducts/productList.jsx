import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductForm from "./productForm";
import "./productList.css";

//Show all products registered under the UserID

const ProductList = ({ userID }) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // ✅ Move fetchProducts outside useEffect so it can be reused
  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:3000/product/user/${userID}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userID]);

  return (
    <div className="product-list-container">
      {!showForm && (
        <>
          <button className="add-product-button" onClick={() => setShowForm(true)}>
            Add New Product
          </button>
          <Link to="/manage-offers">
            <button className="manage-offers-button">
              Manage Offers
            </button>
        </Link>
      </>
      )}
  
      {showForm ? (
        <ProductForm userID={userID} onClose={() => setShowForm(false)} onProductAdded={fetchProducts} />
      ) : (
        <>
          {products.length === 0 ? (
            <p className="no-products">You have no products listed for sale.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <Link to={`/edit/${product._id}`} key={product._id} className="product-card-link">
                  <div className="product-card">
                    <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};  

export default ProductList;

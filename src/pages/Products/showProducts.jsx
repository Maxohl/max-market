import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../../utils/Contexts/searchContext";
import { useOffers } from "../../utils/Contexts/offersContext";
import "./showProducts.css";

const ShowProducts = () => {  
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const showOffersOnly = params.get("offers") === "true";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = showOffersOnly
          ? "http://localhost:3000/product/discounted"
          : "http://localhost:3000/product/products";
  
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Database unavailable");
        }
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (error) {
        setError("Database unavailable. Please try again later.");
      }
    };
  
    fetchProducts();
  }, [showOffersOnly]);
  

  // Filter products based on searchTerm
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = product.categories.some((category) =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return nameMatch || categoryMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="show-product-container">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="show-product-grid">
            {currentProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="show-product-block"
                  onClick={() => navigate(`/view/${product._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="image-wrapper">
                    {product.discountValue && new Date(product.discountExpiresAt) > new Date() && (
                      <div className="ribbon-discount">-{product.discountValue}%</div>
                    )}
                    <img src={product.imageUrls[0]} alt={product.name} className="show-product-image" />
                  </div>
                  <div className="show-product-info">
                    <h3 className="show-product-name">{product.name}</h3>
                    {product.discountValue &&
                      new Date(product.discountExpiresAt) > new Date() ? (
                        <p className="show-product-price">
                          <span className="original-price">
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          <span className="discounted-price">
                            ${(
                              parseFloat(product.price) *
                              (1 - product.discountValue / 100)
                            ).toFixed(2)}
                          </span>
                        </p>
                      ) : (
                        <p className="show-product-price">
                          ${parseFloat(product.price).toFixed(2)}
                        </p>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !error && (
            <div className="pagination">
              {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)} className="pagination-btn">
                  Previous
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                >
                  {page}
                </button>
              ))}
              {currentPage < totalPages && (
                <button onClick={() => setCurrentPage(currentPage + 1)} className="pagination-btn">
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShowProducts;

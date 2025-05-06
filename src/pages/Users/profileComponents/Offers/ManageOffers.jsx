import React, { useState, useEffect } from 'react';
import './manageOffers.css';

const ManageOffers = ({ userID }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState('');
  const [expireDate, setExpireDate] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/product/user/${userID}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, [userID]);

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product._id));
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleApplyOffer = async () => {
    if (!discount || selectedProducts.length === 0 || !expireDate) return;
  
    try {
      const response = await fetch('http://localhost:3000/product/apply-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProducts,
          discount: parseFloat(discount),
          expireDate,
        }),
      });
  
      const result = await response.json();
      alert(result.message || 'Offer applied successfully!');
    } catch (error) {
      console.error('Error applying offer:', error);
    }
  };
  

  return (
    <div className="manage-offers-container">
      <h2>Manage Offers</h2>
  
      <div className="select-all">
        <label>
            <input
            type="checkbox"
            checked={selectedProducts.length === products.length}
            onChange={handleSelectAll}
            />
            <span>Select All</span>
        </label>
      </div>
  
      <div className="product-list">
        {products.map((product) => (
          <div
            className={`product-item ${selectedProducts.includes(product._id) ? "checked" : ""}`}
            key={product._id}
            >
            <input
                type="checkbox"
                checked={selectedProducts.includes(product._id)}
                onChange={() => handleCheckboxChange(product._id)}
            />
            {product.imageUrls?.[0] && (
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="product-image"
              />
            )}
            <label>{product.name} — ${product.price}</label>
          </div>
        ))}
      </div>
  
      <div className="offer-controls">
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <label htmlFor="expire-date">Expiration Date:</label>
        <input
          type="date"
          className="expire-date-input"
          placeholder='Data expiração'
          value={expireDate}
          onChange={(e) => setExpireDate(e.target.value)}
          min={getTomorrowDate()}
          required
        />
        
        <button onClick={handleApplyOffer}>Apply Offer</button>
      </div>
    </div>
  );
  
};

export default ManageOffers;

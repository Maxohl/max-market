import React, { useState, useEffect } from "react";
import "./purchasedItems.css";

const PurchasedItems = ({ userID }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      console.log("userID:", userID);
      try {
        const response = await fetch(`http://localhost:3000/orders/user/${userID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch purchases");
        }
        const data = await response.json();
        setPurchases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchPurchases();
    }
  }, [userID]);

  if (loading) return <p className="purchase-loading">Loading...</p>;
  if (purchases.length === 0) return <p className="purchase-empty">You have no purchased items at the moment.</p>;
  if (error) return <p className="purchase-error">Error: {error}</p>;
  

  return (
    <div className="purchase-container">
      <h2 className="purchase-title">My Purchases</h2>
      <div className="purchase-list">
        {purchases.map((purchase, index) => (
          <div key={index} className="purchase-card">
            {purchase.items.map((item, itemIndex) => (
              <div key={itemIndex} className="purchase-item">
                {/* Product Image */}
                <img src={item.imageUrl} alt={item.name} className="purchase-image" />

                {/* Product Details */}
                <div className="purchase-info">
                  <p className="purchase-name">
                    {item.name} <span className="purchase-quantity">x {item.quantity}</span>
                  </p>
                  <p className="purchase-price">Total: ${purchase.totalPrice.toFixed(2)}</p>
                  <p className="purchase-status">Status: {purchase.status}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasedItems;

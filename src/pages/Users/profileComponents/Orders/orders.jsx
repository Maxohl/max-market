import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./orders.css";

const OrderedProducts = ({ userID }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("userID:", userID);
      try {
        const response = await fetch(`http://localhost:3000/orders/${userID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userID) {
      fetchOrders();
    }
  }, [userID]);

  if (loading) return <p className="order-loading">Loading...</p>;
  if (orders.length === 0) return <p className="order-empty">No orders found.</p>;
  if (error) return <p className="order-error">Error: {error}</p>;
  console.log(orders);

  return (
    <div className="order-container">
      <h2 className="order-title">Orders</h2>
      <div className="order-list">
        {orders.map((order) => (
          <div
            key={order._id}
            className="order-card"
            onClick={() => navigate(`/vieworder/${order.orderId}`, { state: { order } })} // Sending the complete order
          >
            {order.items.map((item, itemIndex) => (
              <div key={itemIndex} className="order-item">
                <img src={item.imageUrl} alt={item.name} className="order-image" />
                <div className="order-info">
                  <p className="order-name">
                    {item.name} <span className="order-quantity">x {item.quantity}</span>
                  </p>
                  <p className="order-price">Total: ${order.totalPrice.toFixed(2)}</p>
                  <p className="order-status">Status: {order.status}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderedProducts;

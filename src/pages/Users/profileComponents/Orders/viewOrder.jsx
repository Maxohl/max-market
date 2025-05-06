import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./viewOrder.css"; // Import the CSS file

const ViewOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {}; // Receives order's data

  // If user accesses without data, redirect to home
  if (!order) {
    navigate("/");
    return null;
  }

  // State for enabling editing Status
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/orders/${order.orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-order-container">
      <h2 className="view-order-title">Order Details</h2>
      <div className="view-order-details">
        <p><strong>Order ID:</strong> {order.orderId}</p>

        <h3 className="view-order-items-title">Items</h3>
        <ul className="view-order-items-list">
          {order.items.map((item, index) => (
            <li key={index} className="view-order-item">
              <img src={item.imageUrl} alt={item.name} className="view-order-item-image" />
              <span className="view-order-item-info">
                {item.name} - {item.quantity}x
              </span>
            </li>
          ))}
          <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
        </ul>

        {/* Editable Status */}
        <div className="view-order-status">
          <label><strong>Status:</strong></label>
          <select
            className="view-order-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Button to save changes */}
        <button
          className="view-order-save-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ViewOrder;

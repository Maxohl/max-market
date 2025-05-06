import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../utils/Contexts/cartContext";
import { useNavigate } from "react-router-dom";
import "./checkout.css"; // CSS file for styling

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;
  const address = userData?.address;

  const totalPrice = cart.reduce((acc, item) => {
    const isDiscountValid =
      item.discountValue &&
      new Date(item.discountExpiresAt) > new Date();
  
    const effectivePrice = isDiscountValid
      ? item.price * (1 - item.discountValue / 100)
      : item.price;
  
    return acc + effectivePrice * item.quantity;
  }, 0);
  

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handlePurchase = async () => {
    const purchaseData = {
      userId,
      items: cart.map((item) => {
        const cartItem = { 
          productId: item._id, 
          quantity: item.quantity,
          sellerId: item.sellerId
        };
  
        if (item.size) cartItem.size = item.size;
        if (item.color) cartItem.color = item.color;
  
        return cartItem;
      }),
      totalPrice,
      status: "Pending",
      shippingAddress: address,
      createdAt: new Date().toISOString(),
    };
  
    try {
      const response = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });
      if (response.ok) {
        alert("Purchase successful!");
        clearCart();
        navigate("/");
      } else {
        alert("Error processing purchase");
      }
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };
  

  return (
    <div className="checkout-container">
      {/* Step 1: Confirm Purchase */}
      {step === 1 && (
        <div className="checkout-step">
          <h2>Confirm Your Purchase</h2>
          <ul>
          {cart.map((item) => {
            const isDiscountValid =
              item.discountValue &&
              new Date(item.discountExpiresAt) > new Date();

            const effectivePrice = isDiscountValid
              ? item.price * (1 - item.discountValue / 100)
              : item.price;

            return (
              <li key={item._id}>
                {item.name} - ${effectivePrice.toFixed(2)} x {item.quantity}
              </li>
            );
          })}

          </ul>
          <p><strong>Total: ${totalPrice.toFixed(2)}</strong></p>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {/* Step 2: Confirm Address */}
      {step === 2 && (
        <div className="checkout-step">
          <h2>Confirm Shipping Address</h2>
          {address ? (
            <div className="address-info">
              <p><strong>Street:</strong> {address.street}</p>
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>State:</strong> {address.state}</p>
              <p><strong>ZIP Code:</strong> {address.zipCode}</p>
              <p><strong>Country:</strong> {address.country}</p>
            </div>
          ) : (
            <p>No address found</p>
          )}
          <button onClick={handlePrev}>Back</button>
          <button onClick={handleNext}>Next</button>
        </div>
      )}

      {/* Step 3: Select Payment Method */}
      {step === 3 && (
        <div className="checkout-step">
          <h2>Select Payment Method</h2>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Choose...</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          <button onClick={handlePrev}>Back</button>
          <button onClick={handleNext} disabled={!paymentMethod}>Next</button>
        </div>
      )}

      {/* Step 4: Finalize Purchase */}
      {step === 4 && (
        <div className="checkout-step">
          <h2>Finalize Purchase</h2>
          {address && (
            <div className="address-info">
              <p><strong>Shipping Address:</strong> {address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}</p>
            </div>
          )}
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          <p><strong>Total: ${totalPrice.toFixed(2)}</strong></p>
          <button onClick={handlePrev}>Back</button>
          <button onClick={handlePurchase}>Confirm Purchase</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../utils/Contexts/cartContext";
import "./cart.css";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleProceedPayment = (product) => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((product) => {
            const isDiscountValid =
              product.discountValue &&
              new Date(product.discountExpiresAt) > new Date();

            const discountedUnitPrice = isDiscountValid
              ? product.price * (1 - product.discountValue / 100)
              : product.price;

            const totalPrice = discountedUnitPrice * product.quantity;

            return (
              <li key={product._id} className="cart-item">
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <p>
                    <strong>Unit Price:</strong> ${parseFloat(product.price).toFixed(2)}
                  </p>
                  {isDiscountValid && (
                    <p className="discounted-price-info">
                      <strong>Discounted Price:</strong>{" "}
                      ${discountedUnitPrice.toFixed(2)}
                    </p>
                  )}
                  <p>
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> ${totalPrice.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleProceedPayment(product)}
                    className="buy-now-btn"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Cart;

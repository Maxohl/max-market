import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../utils/Contexts/cartContext";
import "./viewProduct.css";

const ViewProduct = () => {
  const { productID } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/product/${productID}`);
        const data = await response.json();
        setProduct(data);
        if (data.imageUrls && data.imageUrls.length > 0) {
          setSelectedImage(data.imageUrls[0]);
        }
        // Set default selections
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productID]);

  if (!product) return <p>Loading...</p>;

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  // add product to the cart, if there is a valid discount, include it too.
  const handleAddToCart = () => {
    const isDiscountValid =
      product.discountValue && new Date(product.discountExpiresAt) > new Date();
  
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrls: product.imageUrls,
      size: selectedSize,
      color: selectedColor,
      quantity,
      sellerId: product.userID,
      ...(isDiscountValid && {
        discountValue: product.discountValue,
        discountExpiresAt: product.discountExpiresAt,
      }),
    };
  
    addToCart(cartItem);
    alert(`${product.name} added to cart!`);
  };
  

  return (
    <div className="product-container">
      <div className="image-gallery">
        {product.imageUrls.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index}`}
            className={`thumbnail ${selectedImage === img ? "selected" : ""}`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      <div className="main-image-wrapper">
        {product.discountValue && new Date(product.discountExpiresAt) > new Date() && (
          <div className="discount-badge">-{product.discountValue}% OFF</div>
        )}
        <div className="main-image">
          <img src={selectedImage} alt={product.name} className="large-image" />
        </div>
      </div>

      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        {product.discountValue && new Date(product.discountExpiresAt) > new Date() ? (
          <p className="product-price">
            <span className="original-price">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <span className="discounted-price">
              ${ (parseFloat(product.price) * (1 - product.discountValue / 100)).toFixed(2) }
            </span>
          </p>
        ) : (
          <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
        )}
        <p className="product-description">{product.description}</p>

        {product.sizes && product.sizes.length > 0 && (
          <div className="size-section">
            <h4>Size</h4>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="color-section">
            <h4>Color</h4>
            <div className="color-options">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="quantity-section">
          <h4>Quantity</h4>
          <div className="quantity-controls">
            <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>−</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ViewProduct;
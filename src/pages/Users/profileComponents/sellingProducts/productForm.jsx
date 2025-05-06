import React, { useState } from "react";
import "./productForm.css";

const ProductForm = ({ userID, onClose, onProductAdded }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    imageUrls: [],
    colors: [],
    sizes: [],
    stock: ""
  });

  const [newCategory, setNewCategory] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ 
      ...product, 
      [name]: name === "stock" || name === "price" ? parseFloat(value) || "" : value
    });
  };

  const handleAddCategory = () => {
    if (newCategory) {
      setProduct({ ...product, categories: [...product.categories, newCategory] });
      setNewCategory("");
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl) {
      setProduct({ ...product, imageUrls: [...product.imageUrls, newImageUrl] });
      setNewImageUrl("");
    }
  };

  const handleAddColor = () => {
    if (newColor) {
      setProduct({ ...product, colors: [...product.colors, newColor] });
      setNewColor(""); // Resetar o input após adicionar
    }
  };

  const handleAddSize = () => {
    if (newSize && !product.sizes.includes(newSize)) {
      setProduct({ ...product, sizes: [...product.sizes, newSize] });
      setNewSize("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...product, userID };
    try {
      const response = await fetch("http://localhost:3000/product/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      if (response.ok) {
        alert("Product added successfully!");
        onProductAdded();
        onClose();
      } else {
        alert("Error adding product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="product-form-container">
      <h2 className="form-title">Add New Product</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={product.description} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} required />

        <label>Categories:</label>
        <div className="input-group">
          <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <button className="add-button" type="button" onClick={handleAddCategory}>Add</button>
        </div>
        <div className="tag-list">
          {product.categories.map((cat, index) => <span key={index} className="tag">{cat}</span>)}
        </div>

        <label>Image URLs:</label>
        <div className="input-group">
          <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
          <button className="add-button" type="button" onClick={handleAddImageUrl}>Add</button>
        </div>
        <div className="image-list">
          {product.imageUrls.map((url, index) => (
            <div key={index} className="image-item">
              <img src={url} alt={`Product ${index + 1}`} className="preview-image" />
            </div>
          ))}
        </div>

        <label>Colors:</label>
          <div className="input-group">
            <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
              <div>
                <button className="add-button" type="button" onClick={handleAddColor}> Add </button>
              </div>
          </div>

          <div className="color-list">
            {product.colors.map((color, index) => (
              <span
                key={index}
                className="color-box"
                style={{ backgroundColor: color }}
              ></span>
            ))}
          </div>

        <label>Sizes:</label>
        <div className="input-group">
          <input type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} />
          <button className="add-button" type="button" onClick={handleAddSize}>Add</button>
        </div>
        <div className="tag-list">
          {product.sizes.map((size, index) => <span key={index} className="tag">{size}</span>)}
        </div>

        <label>Stock:</label>
        <input type="number" name="stock" value={product.stock} onChange={handleChange} required />

        <div className="form-actions button-group">
          <button className="submit-button" type="submit">Submit</button>
          <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./productEdit.css";

const ProductEdit = () => {
  const { productID } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    imageUrls: [],
    colors: [],
    sizes: [],
    stock: "",
  });
  
  const [newCategory, setNewCategory] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newColor, setNewColor] = useState("#000000");
  const [newSize, setNewSize] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/product/${productID}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productID]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    if (newCategory) {
      setProduct({ ...product, categories: [...product.categories, newCategory] });
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (index) => {
    setProduct({ ...product, categories: product.categories.filter((_, i) => i !== index) });
  };

  const handleAddImageUrl = () => {
    if (newImageUrl) {
      setProduct({ ...product, imageUrls: [...product.imageUrls, newImageUrl] });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setProduct({ ...product, imageUrls: product.imageUrls.filter((_, i) => i !== index) });
  };

  const handleAddColor = () => {
    if (newColor && !product.colors.includes(newColor)) {
      setProduct({ ...product, colors: [...product.colors, newColor] });
    }
  };

  const handleRemoveColor = (index) => {
    setProduct({ ...product, colors: product.colors.filter((_, i) => i !== index) });
  };

  const handleAddSize = () => {
    if (newSize && !product.sizes.includes(newSize)) {
      setProduct({ ...product, sizes: [...product.sizes, newSize] });
      setNewSize("");
    }
  };

  const handleRemoveSize = (index) => {
    setProduct({ ...product, sizes: product.sizes.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/product/update/${productID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        alert("Product updated successfully!");
        navigate(`/${JSON.parse(localStorage.getItem("user"))?.id}/Profile`);
      } else {
        alert("Error updating product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  return (
    <div className="product-edit-form-container">
      <h2 className="form-title">Edit Product</h2>
      <form className="product-edit-form" onSubmit={handleSubmit}>
        
        <label>Name:</label>
        <input type="text" className="input-edit-group" name="name" value={product.name} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" className="input-edit-group" value={product.description} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" className="input-edit-group" name="price" value={product.price} onChange={handleChange} required />

        <label>Stock:</label>
        <input type="number" className="input-edit-group" name="stock" value={product.stock} onChange={handleChange} required />

        <label>Categories:</label>
        <input type="text" className="input-edit-group" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        <button type="button" className="add-button" onClick={handleAddCategory}>Add</button>
        <div className="tag-list">
          {product.categories.map((cat, index) => (
            <span className="tag" key={index}>{cat} <button onClick={() => handleRemoveCategory(index)}>X</button></span>
          ))}
        </div>

        <label>Image URLs:</label>
        <input type="text" className="input-edit-group" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
        <button type="button" className="add-button" onClick={handleAddImageUrl}>Add</button>
        <div className="image-edit-container">
          {product.imageUrls.map((url, index) => (
            <div key={index} className="image-wrapper">
              <img src={url} alt="Product" width="50" />
              <button className="remove-image" onClick={() => handleRemoveImage(index)}>X</button>
            </div>
          ))}
        </div>

        <label>Colors:</label>
        <input type="color" className="input-edit-color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
        <button type="button" className="add-button" onClick={handleAddColor}>Add</button>
        <div className="product-edit-color-list">
          {product.colors.map((color, index) => {
            return (
              <span 
                className="product-edit-color-box" 
                key={index} 
                style={{ 
                  backgroundColor: color.trim(), // Ensure no extra spaces
                }}
              >
                <button className="remove-tag" onClick={() => handleRemoveColor(index)}>X</button>
              </span>
            );
          })}
        </div>


        <label>Sizes:</label>
        <input type="text" className="input-edit-group" value={newSize} onChange={(e) => setNewSize(e.target.value)} />
        <button type="button" className="add-button" onClick={handleAddSize}>Add</button>
        <div className="tag-list">
          {product.sizes.map((size, index) => (
            <span className="tag" key={index}>{size} <button className="remove-tag" onClick={() => handleRemoveSize(index)}>X</button></span>
          ))}
        </div>
        <div className="button-edit-group">
          <button className="submit-button" type="submit">Save</button>
          <button className="remove-button">Remove</button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;

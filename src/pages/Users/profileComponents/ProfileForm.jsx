import React from "react";
import { FiEdit } from "react-icons/fi";

const ProfileForm = ({ user, isEditing, handleEditToggle, handleChange, handleAddressChange, handleSave }) => {
  if (!user) return <p>Loading user data...</p>;

  // Ensure address exists even if it's undefined
  const address = user.address || { street: "", city: "", state: "", zipCode: "", country: "" };

  return (
    <div className="profile-info">
      <h2>Account Information</h2>
      <div className="edit-icon" onClick={handleEditToggle}>
        <FiEdit size={20} />
      </div>
      <div className="profile-form">
        <label>Name:</label>
        <input type="text" name="firstName" value={user.firstName} onChange={handleChange} disabled={!isEditing} />
        
        <label>Last Name:</label>
        <input type="text" name="lastName" value={user.lastName} onChange={handleChange} disabled={!isEditing} />
        
        <label>Email:</label>
        <input type="email" name="email" value={user.email} onChange={handleChange} disabled={!isEditing} />

        {/* Show address fields if user has an address OR is in edit mode */}
        {(user.address || isEditing) && (
          <>
            <h3>Address</h3>
            <label>Street:</label>
            <input type="text" name="street" value={address.street} onChange={handleAddressChange} disabled={!isEditing} />
            
            <label>City:</label>
            <input type="text" name="city" value={address.city} onChange={handleAddressChange} disabled={!isEditing} />
            
            <label>State:</label>
            <input type="text" name="state" value={address.state} onChange={handleAddressChange} disabled={!isEditing} maxLength="2" />
            
            <label>Zip Code:</label>
            <input type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange} disabled={!isEditing} />
            
            <label>Country:</label>
            <input type="text" name="country" value={address.country} onChange={handleAddressChange} disabled={!isEditing} />
          </>
        )}

        <button className={`save-button ${isEditing ? "" : "disabled"}`} onClick={handleSave} disabled={!isEditing}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;

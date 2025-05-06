import React, { useState, useEffect } from "react";
import UserMenu from "../../utils/userMenu";
import ProfileForm from "./profileComponents/ProfileForm";
import { updateProfile } from "./profileComponents/profileApi";
import ProductList from "./profileComponents/sellingProducts/productList";
import PurchasedItems from "./profileComponents/Purchases/purchasedItems";
import Orders from "./profileComponents/Orders/orders"

import "./Profile.css";

const Profile = () => {
  const [selectedSection, setSelectedSection] = useState("account");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);
  
  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleAddressChange = (e) => {
    setUser({ ...user, address: { ...user.address, [e.target.name]: e.target.value } });
  };

  const handleSave = async () => {
    if (!user.firstName || !user.lastName || !user.email || !user.address?.street || !user.address?.city || 
        !user.address?.state || !user.address?.zipCode || !user.address?.country) {
      alert("All fields must be filled out!");
      return;
    }

    try {
      await updateProfile(user);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      alert("An error occurred while updating the profile.");
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "account":
        return (
          <ProfileForm 
            user={user} 
            isEditing={isEditing} 
            handleEditToggle={handleEditToggle} 
            handleChange={handleChange} 
            handleAddressChange={handleAddressChange} 
            handleSave={handleSave} 
          />
        );
      case "purchases":
        return <PurchasedItems userID={user?.id} />;
      case "selling":
        return <ProductList userID={user?.id} />;
      case "orders":
        return <Orders userID={user?.id} />;
      default:
        return <div className="profile-section">Select an option from the menu</div>;
    }
  };
  
  

  return (
    <div className="profile-container">
      <UserMenu setSelectedSection={setSelectedSection} />
      <div className="profile-content">{renderContent()}</div>
    </div>
  );
};

export default Profile;

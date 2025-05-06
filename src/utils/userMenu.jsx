import React from 'react';
import './userMenu.css';

function UserMenu({ setSelectedSection }) {
  return (
    <div className="side-menu">
      <ul>
        <li onClick={() => setSelectedSection("account")}>Profile</li>
        <li onClick={() => setSelectedSection("purchases")}>Purchases</li>
        <li onClick={() => setSelectedSection("selling")}>My Products</li>
        <li onClick={() => setSelectedSection("orders")}>Sales</li>
      </ul>
    </div>
  );
}

export default UserMenu;


import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import Cookies from 'js-cookie';
import { useCart } from './Contexts/cartContext';
import { useSearch } from './Contexts/searchContext';
import "./navbar.css";
import TopCategoriesDropdown from './TopCategoriesDropdown';

function Navbar({ onSearch }) {  // Accept onSearch prop
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState(null); 
  const { searchTerm, setSearchTerm } = useSearch(); 
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => { 
    const token = Cookies.get('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserID(decodedToken.userID);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
        setUserID(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserID(null);
    }
  }, [location]); 

  const handleLogout = () => {
    Cookies.remove('token');
    setIsLoggedIn(false);
    setUserID(null); 
    navigate("/");
  };

  return (
    <nav className="navbar">
      
      <div className="navbar-home">
        <Link to="/">
          <span className="home-icon" role="img" aria-label="home">🏠</span>
        </Link>
      </div>

      <div className="searchBar">
      <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            if (location.pathname !== "/") {
              navigate("/", { replace: true }); // navigate to home if not already
            }
            setSearchTerm(value); // then update search term
          }}
        />
      </div>
      <div className="navbar-main">
        <TopCategoriesDropdown />
        <button onClick={() => navigate("/?offers=true")}>Offers</button>
        <Link to="/contact"><button>Contact</button></Link>
      </div>
      <div className="navbar-sub">
        {isLoggedIn ? (
          <>
            <Link to="/cart">
              <button className="cart-button">
                🛒 Cart {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
              </button>
            </Link>
            <Link to={`/${userID}/profile`}><button>Profile</button></Link>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/signup"><button>Sign up</button></Link>
            <Link to="/login"><button>Sign in</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'

import Navbar from "./utils/navbar"; 
import CartProvider from "./utils/Contexts/cartContext";
import { SearchProvider } from "./utils/Contexts/searchContext";
import { OffersProvider } from "./utils/Contexts/offersContext";
import Home from "./pages/Home"; 
import SignUp from "./pages/SignUp"; 
import Login from "./pages/Login"; 
import Logout from "./pages/Logout";
import Profile from "./pages/Users/Profile"; 
import Contact from "./pages/Contact/contact";
import ViewProduct from "./pages/Products/viewProduct";
import ProductEdit from "./pages/Users/profileComponents/sellingProducts/productEdit";
import Cart from "./pages/Cart/cart";
import Checkout from "./pages/Transaction/Checkout";
import ViewOrder from "./pages/Users/profileComponents/Orders/viewOrder";
import ManageOffers from "./pages/Users/profileComponents/Offers/ManageOffers";


function App() {
  console.log("Rendering App component"); // Add this console.log to verify if App component is rendered
  const userData = JSON.parse(localStorage.getItem("user"));
  const userID = userData?.id;
  
  return (
    <CartProvider>
    <SearchProvider>
      <OffersProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/view/:productID" element={<ViewProduct />} />
              <Route path="/edit/:productID" element={<ProductEdit />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/:userID/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/vieworder/:orderId" element={<ViewOrder />} />
              <Route path="/manage-offers" element={<ManageOffers userID={userID} />} />
            </Routes>
          </div>
        </Router>
      </OffersProvider>
    </SearchProvider>
  </CartProvider>
  );
}

export default App;


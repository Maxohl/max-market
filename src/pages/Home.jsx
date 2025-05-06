import React from 'react';
import ShowProducts from '../pages/Products/showProducts';
import "./Home.css";

function Home() {
  return (
    <div className='pageTitle'>
      <h1>MAX OHL Market</h1>
      <ShowProducts /> {/* Display products below the title */}
    </div>
  );
}

export default Home;
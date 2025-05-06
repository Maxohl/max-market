import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from './Contexts/searchContext';
import './TopCategoriesDropdown.css';

function TopCategoriesDropdown() {
  const [topCategories, setTopCategories] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const { setSearchTerm } = useSearch();

  useEffect(() => {
    fetch('http://localhost:3000/top-categories')
      .then((res) => res.json())
      .then((data) => setTopCategories(data))
      .catch((err) => console.error('Error fetching top categories:', err));
  }, []);

  const handleCategoryClick = (category) => {
    setSearchTerm(category); // just updates the search, same as search bar
    setIsHovered(false);     // optional: closes the dropdown after clicking
  };

  return (
    <div
      className="dropdown-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="dropdown-button">Categories</button>
      {isHovered && (
        <div className="dropdown-box">
          {topCategories.map((category, index) => {
            const formattedCategory = category._id.charAt(0).toUpperCase() + category._id.slice(1);
            return (
              <Link
                to={`/`}
                key={index}
                className="dropdown-item"
                onClick={() => handleCategoryClick(category._id)}
              >
                {formattedCategory}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopCategoriesDropdown;

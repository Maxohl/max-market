import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the token cookie when the component mounts
    Cookies.remove('token');
    // Redirect to the home page after logout
    navigate('/');
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
      {/* Optionally, you can display a message or spinner here while logging out */}
    </div>
  );
};

export default Logout;

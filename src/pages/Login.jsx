import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      const { message, token, user } = response.data;

      if (message === 'Login successful' && token && user) {
        // Save token as a cookie
        Cookies.set('token', token, { expires: 7 });
        localStorage.setItem('user', JSON.stringify(user))
        // Decode token to grab user ID
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.userID; 

        if(userID){
          navigate(`/${userID}/profile`); // Redirect to trigger navbar update
        } else {
          console.error("User id is undefined in decoded token")
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Incorrect Username or Password');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <p>{errorMessage}</p>
        </div>
        <button type="submit" className='btn-login'>Login</button>
      </form>
    </div>
  );
}

export default Login;

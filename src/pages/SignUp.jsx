import React, { useState } from 'react';
import axios from 'axios';
import './signUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any input field is empty
    const isAnyEmpty = Object.values(formData).some(value => value === '');
    if (isAnyEmpty) {
      setErrorMessage("Please fill in all inputs.");
      return; // Stop form submission
    }

    // Compare password and confirmPassword
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password and confirm password don't match.");
      return; // Stop form submission
    }

    // Reset error message if passwords match and all inputs are filled
    setErrorMessage('');

    try {
      // Send form data to backend for registration
      const response = await axios.post('http://localhost:3000/signup', formData, { withCredentials: true ,
        headers: {
          'Content-Type': 'application/json', // Set the content type header
        },
      });
      console.log(response.data); // Log the response from the backend
      // Optionally, you can perform additional actions here, such as showing a success message
    } catch (error) {
      console.error('Error registering user:', error);
      // Optionally, you can handle errors here, such as showing an error message to the user
    }
    
  };

  return (
    <div className="signup-container">
      <h2>Registration</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div>
          <p className="error-message">{errorMessage}</p>
        </div>
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}

export default SignUp;

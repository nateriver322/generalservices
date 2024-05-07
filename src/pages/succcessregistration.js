import React from 'react';
import '../css/successregistration.css'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

const Successregistration = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div>
      <header>
        <div className="header-content">
          <img src="images/logo.png" className="logo" alt="CIT-U Logo" />
          <h1 className="h1">CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY</h1>
        </div>
      </header>
      <h2 className="h2">General Services Portal</h2>
      <div className="container">
        <div className="form-container">
          <form className="login-form">
            <h3 className="h3">Account Successfully Created!</h3>
            <button className="button" id="signup-button" onClick={handleLoginClick}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Successregistration;
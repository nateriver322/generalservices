import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SuccessTicket.css';
import logo from '../images/logo.png'; // Adjust the path as necessary

function SuccessTicket() {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <div>
      <header>
        <div className="header-content">
          <img src={logo} className="logo" alt="CIT-U Logo" />
          <h1 className="h1">CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY</h1>
        </div>
      </header>
      <h2 className="h2">General Services Portal</h2>
      <div className="container">
        <div className="form-container">
          <h3 className="h3">Ticket Successfully Submitted!</h3>
          <div className="button_container">
            <button className="back-button" onClick={handleBackButtonClick}>
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessTicket;

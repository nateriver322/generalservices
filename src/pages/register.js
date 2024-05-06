import React from 'react';
import '../css/register.css';

function Register() {
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
            <div className="registration-form">
              <h3 className="h3">Create Account</h3>
              <div className="input-container">
                <input type="text" id="username" placeholder="Username" name="username" className="input-field" required />
                <input type="text" id="email" placeholder="Email" name="email" className="input-field" required />
                <input type="password" id="password" placeholder="Password" name="pass" className="input-field" required />
                <input type="text" id="contactnum" placeholder="Contact Number" name="contact" className="input-field" required />
              </div>
              <div className="buttoncontainer">
                <input type="submit" id="signup" name="Signup" value="Sign up" className="signup-button" />
                <input type="submit" id="login" name="Login" value="Login" className="login-button" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Register;
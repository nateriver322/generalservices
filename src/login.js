import React from 'react';
import './login.css'; // Ensure this path is correct

const LoginPage = () => {
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
            <h3 className="h3">Sign in</h3>
            <div className="input-container">
              <div className="inputs">
                <input type="email" id="email" placeholder="Email" name="user" className="input-field" required />
                <input type="password" id="password" placeholder="Password" name="pass" className="input-field" required />
              </div>
              <div className="buttoncontainer">
                <input type="submit" id="submit" name="Login" value="Login" className="login-button" />
              </div>
            </div>
            <p className="forgot-password"><a href="changepass.html">Forgot password? Click here</a></p>
            <button className="button" id="signup-button">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
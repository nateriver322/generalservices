import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; // Assuming similar styling to register.css

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });
            if (response.ok) {
                console.log('Login successful');
                navigate('/dashboard'); // Navigate to dashboard or another appropriate route
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSignUpClick = () => {
        navigate('/register'); // Navigate back to the registration page
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
                    <form className="login-form" onSubmit={handleLoginSubmit}>
                        <h3 className="h3">Login</h3>
                        <div className="input-container">
                            <input type="email" placeholder="Email" name="email" className="input-field" required onChange={handleInputChange} />
                            <input type="password" placeholder="Password" name="password" className="input-field" required onChange={handleInputChange} />
                        </div>
                        <div className="buttoncontainer">
                            <input type="submit" value="Login" className="login-button" />
                            <button type="button" onClick={handleSignUpClick} className="signup-button">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
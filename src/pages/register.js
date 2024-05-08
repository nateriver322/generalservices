import React, { useState } from 'react';
import '../css/register.css';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        contactNumber: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page
        try {
            const response = await fetch('http://localhost:8080/user/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    contactNumber: userData.contactNumber
                })
            });
            if (response.ok) {
                console.log('Registration successful');
                navigate('/successregistration'); // Navigate to home page or wherever you want after registration
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // New function to handle navigation to the login page
    const handleLoginClick = (event) => {
        event.preventDefault(); // Prevent the default action
        navigate('/'); // Navigate to the login page
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
                    <form className="registration-form" onSubmit={handleFormSubmit}>
                        <h3 className="h3">Create Account</h3>
                        <div className="input-container">
                            <input type="text" placeholder="Username" name="username" className="input-field" required onChange={handleInputChange} />
                            <input type="email" placeholder="Email" name="email" className="input-field" required onChange={handleInputChange} />
                            <input type="password" placeholder="Password" name="password" className="input-field" required onChange={handleInputChange} />
                            <input type="text" placeholder="Contact Number" name="contactNumber" className="input-field" required onChange={handleInputChange} />
                        </div>
                        <div className="buttoncontainer">
                            <input type="submit" value="Sign up" className="signup-button" />
                            <button className="login-button" onClick={handleLoginClick}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;

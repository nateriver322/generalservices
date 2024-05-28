import React, { useState } from 'react';
import '../css/register.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        contactNumber: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let updatedValue = value;

        if (name === 'contactNumber') {
            // Restrict input to numbers only and limit length to 11 characters
            updatedValue = value.replace(/[^0-9]/g, '').slice(0, 11);
        }

        setUserData({
            ...userData,
            [name]: updatedValue
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation: only accept valid email address
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Password validation: minimum 8 characters with letters, numbers, at least one symbol, and one capital letter
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordPattern.test(userData.password)) {
            newErrors.password = "Password must be 8 characters long and include at least 1 number and 1 capital letter.";
        }

        // Contact number validation: should not accept letters
        const contactNumberPattern = /^\d+$/;
        if (!contactNumberPattern.test(userData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be a valid number and should not contain letters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page

        if (!validateForm()) {
            return;
        }

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
                    <img src={logo} className="logo" alt="CIT-U Logo" />
                    <h1 className="h1">CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY</h1>
                </div>
            </header>
            <h2 className="h2">General Services Portal</h2>
            <div className="container">
                <div className="form-container">
                    <form className="registration-form" onSubmit={handleFormSubmit}>
                        <h3 className="h3">Create Account</h3>
                        <div className="input-container">
                            <div className="input-group">
                                <input type="text" placeholder="Username" name="username" className="input-field" required onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <input type="email" placeholder="Email" name="email" className="input-field" required onChange={handleInputChange} />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>
                            <div className="input-group">
                                <input type="password" placeholder="Password" name="password" className="input-field" required onChange={handleInputChange} />
                                {errors.password && <span className="error">{errors.password}</span>}
                                <span className="pass-guide">Must be 8 characters with 1 capital letter and numerical value.</span>
                            </div>
                            <div className="input-group">
                                <input type="text" placeholder="Contact Number" name="contactNumber" className="input-field" pattern="[0-9]*" maxLength="11" required onChange={handleInputChange} />
                                {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
                            </div>
                        </div>
                        <div className="buttoncontainer">
                            <input type="submit" value="Sign up" className="signup-button" />
                            <button className="signup-button" onClick={handleLoginClick}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;

import React, { useState } from 'react';
import '../css/register.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        contactNumber: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let updatedValue = value;

        if (name === 'contactNumber') {
            // Restrict input to numbers only and limit length to 11 characters
            updatedValue = value.replace(/[^0-9]/g, '').slice(0, 11);
        }

        // Clear email error when user starts editing email field
        if (name === 'email' && emailError) {
            setEmailError('');
        }

        setUserData({
            ...userData,
            [name]: updatedValue
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = async () => {
        const newErrors = {};

        // Email validation: only accept valid email address
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            newErrors.email = "Please enter a valid email address.";
        } else {
            // Check if email is already registered
            const isRegistered = await isEmailAlreadyRegistered(userData.email);
            if (isRegistered) {
                setEmailError("This email is already registered.");
                newErrors.email = "This email is already registered.";
            }
        }

        // Password validation: minimum 8 characters with letters, numbers, at least one symbol, and one capital letter
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordPattern.test(userData.password)) {
            newErrors.password = "Password must be 8 characters long and include at least 1 number.";
        }

        // Contact number validation: should not accept letters and must be exactly 11 digits
        const contactNumberPattern = /^\d{11}$/;
        if (!contactNumberPattern.test(userData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be exactly 11 digits.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page

        if (!await validateForm()) {
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

    const isEmailAlreadyRegistered = async (email) => {
        try {
            const response = await fetch(`http://localhost:8080/user/checkEmail?email=${encodeURIComponent(email)}`);
            const result = await response.json();
            return result.exists;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
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
                                {emailError && <span className="error">{emailError}</span>}
                            </div>
                            <div className="input-group"> <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" className="input-field" required onChange={handleInputChange} />
                                <div className="eye-icon" onClick={togglePasswordVisibility}>
                                    {showPassword ? (
                                        <AiOutlineEye />
                                    ) : (
                                        <AiOutlineEyeInvisible />
                                    )}
                                </div>
                                {errors.password && <span className="error">{errors.password}</span>}
                                <span className="pass-guide">Must be 8 characters with numerical values.</span>
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


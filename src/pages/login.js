import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../css/login.css';
import logo from '../images/logo.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { loginRequest } from "../AuthConfig"; // Import AuthConfig for Microsoft login
import { useMsal } from "@azure/msal-react"; // Import useMsal hook
import { microsoftLogin } from '../AuthContext'; // Import microsoftLogin function

const Login = () => {
    const navigate = useNavigate();
    const { login, microsoftLogin } = useAuth();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { instance } = useMsal();

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
            const userData = await login(credentials.email, credentials.password);
            navigate('/dashboard', { state: { username: userData.username } }); // Navigate with username
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const handleMicrosoftLogin = async () => {
        try {
            const result = await instance.loginPopup(loginRequest);
            const userData = await microsoftLogin(result.accessToken);
            navigate('/dashboard', { state: { username: userData.username } });
        } catch (error) {
            console.error('Microsoft login error:', error);
            setError('Microsoft login failed');
        }
    };

    const handleSignUpClick = () => {
        navigate('/register'); // Navigate back to the registration page
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    <form className="login-form" onSubmit={handleLoginSubmit}>
                        <h3 className="h3-login">Log in</h3>
                        {error && <p className="error-message">{error}</p>} {/* Display error message */}
                        <div className="input-container">
                            <input type="email" placeholder="Email" name="email" className="input-field" required onChange={handleInputChange} />
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    name="password"
                                    className="input-field"
                                    required
                                    onChange={handleInputChange}
                                />
                                <div className="eye-icon-login" onClick={togglePasswordVisibility}>
                                    {showPassword ? (
                                        <AiOutlineEye />
                                    ) : (
                                        <AiOutlineEyeInvisible />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="buttoncontainer">
                            <input type="submit" value="Login" className="log_in-button" />
                            <button type="button" onClick={handleSignUpClick} className="signup-button">Sign Up</button>
                            <button type="button" onClick={handleMicrosoftLogin} className="microsoft-login-button">Login with Microsoft</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

import React, { useState } from 'react';
import './login.css'; // Ensure the CSS file is in the same directory
import logo from './images/logo.png'; // Importing the logo image

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:', username, 'Password:', password);
        // Add your login logic here
    };

    return (
        <div className="login-container">
            <header className="login-header">
                <img src={logo}/>
                <h1>Cebu Institute of Technology - University</h1>
            </header>
            <div className="login-form">
                <h2>General Services Portal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="username"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="password"
                            required
                        />
                    </div>
                    <button type="submit">LOGIN</button>
                </form>
                <div className="links">
                    <a href="#">forgot password? click here</a>
                    <a href="#">create account</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
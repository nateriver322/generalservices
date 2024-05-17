import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/dashboard.css';
import logo from '../images/logo.png';

function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // Get username from localStorage

    useEffect(() => {
        if (!username) {
            console.log('No user data found, redirecting to login');
            navigate('/'); // Adjust this if your login route is different
        }
    }, [navigate, username]);

    const handleTicketButtonClick = () => {
        navigate("/ticket"); 
    };

    const handleViewButtonClick = () => {
        // Logic to handle view button click
        // For example, navigate to the tickets viewing page
        navigate("/myTickets"); 
        console.log("View Tickets button clicked");
    };

    const handleLogoutButtonClick = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <>
            <header>
                <div className="header-content">
                <img src={logo} className="logo" alt="Logo" />
                    <h1 className="h1">CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY</h1>
                </div>
            </header>
            <h2 className="h2">General Services Portal</h2>
            <div className="user-info">
                <h3>Welcome, {username}!</h3>
            </div>
            <div className="container">
                <div className="buttoncontainer">
                    <button className="ticket-button" onClick={handleTicketButtonClick}>Submit Ticket</button>
                    <button className="view-button" onClick={handleViewButtonClick}>View Tickets</button>
                </div>
                <button className="logout-button" onClick={handleLogoutButtonClick}>Logout</button>
            </div>
        </>
    );
}

export default Dashboard;

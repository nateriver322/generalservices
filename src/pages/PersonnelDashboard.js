import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/staffDashboard.css';
import logo from '../images/logo.png';

function StaffDashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // Get username from localStorage

    useEffect(() => {
        if (!username) {
            console.log('No user data found, redirecting to login');
            navigate('/'); // Adjust this if your login route is different
        }
    }, [navigate, username]);

    const handleTicketButtonClick = () => {
        navigate("/PersonnelTickets"); 
        console.log("Tickets assigned button clicked");
    };

    const handleViewButtonClick = () => {
        navigate("/ticketsHistory"); 
        console.log("Fixed Tickets button clicked");
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
                <h3>Welcome Personnel {username}!</h3>
            </div>
            <div className="container">
                <div className="buttoncontainer">
                    <button className="tickets-created" onClick={handleTicketButtonClick}>Tickets Assigned</button>
                    <button className="tickets-fixed" onClick={handleViewButtonClick}>Tickets History</button>
                </div>
                <button className="logout-button" onClick={handleLogoutButtonClick}>Logout</button>
            </div>
        </>
    );
}

export default StaffDashboard;

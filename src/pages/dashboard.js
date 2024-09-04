import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/dashboard.css';
import logo from '../images/logo.png';
import ResponsiveAppBar from './ResponsiveAppBar';

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
        navigate("/myTickets"); 
        console.log("View Tickets button clicked");
    };

    const handleLogoutButtonClick = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <>
            <ResponsiveAppBar />
            
            <h2 className="h2">General Services Portal</h2>
            <div className="user-info">
                <h3>Welcome, {username}!</h3>
            </div>
            <div className="container">
                <div className="buttoncontainer">
                    <button className="ticket-button" onClick={handleTicketButtonClick}>Submit Ticket</button>
                    <button className="view-button" onClick={handleViewButtonClick}>View Tickets</button>
                </div>
               
            </div>
        </>
    );
}

export default Dashboard;

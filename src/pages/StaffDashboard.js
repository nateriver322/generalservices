import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/staffDashboard.css';
import logo from '../images/logo.png';
import ResponsiveAppBar from './ResponsiveAppBar';

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
        navigate("/ticketsCreated"); 
        console.log("Ticket Created button clicked");
    };

    const handleViewButtonClick = () => {

        navigate("/ticketsFixed"); 
        console.log("Fixed Tickets button clicked");
    };

    const handleLogoutButtonClick = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <>
            <ResponsiveAppBar/>
            <h2 className="h2">General Services Portal</h2>
            <div className="user-info">
                <h3>Welcome Staff {username}!</h3>
            </div>
            <div className="container">
                <div className="buttoncontainer">
                    <button className="tickets-created" onClick={handleTicketButtonClick}>Tickets Created</button>
                    <button className="tickets-fixed" onClick={handleViewButtonClick}>Tickets Fixed</button>
                </div>
            
            </div>
        </>
    );
}

export default StaffDashboard;

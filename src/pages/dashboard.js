import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/dashboard.css'; 

function Dashboard() {
    /*const [greeting, setGreeting] = useState('');*/
    const navigate = useNavigate();

    /*// Function to get current user's greeting
    const getGreeting = () => {
        // Logic to get user's greeting
        // For example, you can get it from local storage or fetch it from an API
        return 'Hello, User!'; // Placeholder greeting
    };*/

    useEffect(() => {
        // Set the greeting when the component mounts
        //setGreeting(getGreeting());
    }, []);

    const handleTicketButtonClick = () => {
        // Logic to navigate to the ticket submission page
        navigate("/ticket"); 
    };

    const handleViewButtonClick = () => {
        // Logic to handle view button click
        // For example, navigate to the tickets viewing page
        navigate("/myTickets"); 
        console.log("View Tickets button clicked");
    };

    const handleLogoutButtonClick = () => {
        // Logic to handle logout button click
        // For example, logout the user and redirect to the login page
        console.log("Logout button clicked");
    };

    return (
        <>
            <header>
                <div className="header-content">
                    <img src="C:\Users\ajceq\OneDrive\Desktop\Capstone\joborder\Capstone\images\logo.png" className="logo" alt="Logo" />
                    <h1 className="h1">CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY</h1>
                </div>
            </header>
            {/*<div className="user-info">
                <h3 id="greet">{greeting}</h3>
            </div>*/}
            <h2 className="h2">General Services Portal</h2>
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

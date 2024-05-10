import React from 'react';
import '../css/myTickets.css';
import { useNavigate } from 'react-router-dom'; 

function MyTickets() {
    const navigate = useNavigate();

    const handleHomeButtonClick = () => {
        // Logic to navigate to the ticket submission page
        navigate("/dashboard"); 
    };

    return (
        <>
            <header>
                <div className="header-content">
                    <img src="images/logo.png" className="logo" alt="Logo" />
                    <h1 className="h1">CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY</h1>
                </div>
            </header>
            <h2 className="h2">General Services Portal</h2>
            <div className="container">
                <div className="view-container">
                    <div className="buttoncontainer">
                    <button 
                        className="home-button"
                        onClick={handleHomeButtonClick}
                        style={{
                            backgroundColor: '#800000',
                            color: '#ffffff',
                            transition: 'background-color 0.3s ease',
                            borderRadius: '5px',
                            padding: '10px 20px',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#922B21'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#800000'; }}
                    >
                        Home
                        </button>
                    </div>
                    <h3 className="h3_tickets">My Tickets</h3>
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Priority</th>
                                <th>Location</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Rows will be added here dynamically */}
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="ticketModal" className="modal">
                <div className="modal-content">
                    <span className="close-button">×</span>
                    <h2>Ticket Details</h2>
                    <p id="ticketPriority">Priority: </p>
                    <p id="ticketWorkType">Work Type: </p>
                    <p id="ticketRequestType">Request Type: </p>
                    <p id="ticketLocation">Location: </p>
                    <p id="ticketDate">Date: </p>
                    <p id="ticketDescription">Description: </p>
                    <img id="ticketImage" src="" style={{ width: '100%', height: 'auto' }} alt="Ticket" /> {/* Image will be shown here */}
                </div>
            </div>
        </>
    );
}

export default MyTickets;

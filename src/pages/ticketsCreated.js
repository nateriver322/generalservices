import React, { useEffect, useState } from 'react';
import '../css/ticketsCreated.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

function TicketsCreated() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        } else {
            fetchTickets();
        }
    }, [navigate]);

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/tickets');
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                console.error('Failed to fetch tickets');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
    };

    const closeModal = () => {
        setSelectedTicket(null);
    };

    const handleHomeButtonClick = () => {
        navigate("/dashboard");
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
            <div className="container">
                <div className="view-container">
                    <div className="button-myTicketcontainer">
                        <button onClick={handleHomeButtonClick} className="home-ticket-button">Home</button>
                    </div>
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Ticket Number</th>
                                <th>Status</th>
                                <th>Reported By</th>
                                <th>Date Created</th>
                                <th>Staff Assigned</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket, index) => (
                                <tr key={index}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.status}</td>
                                    <td>{ticket.username}</td>
                                    <td>{ticket.datetime}</td>
                                    <td>{/* Leave this column blank for now */}</td>
                                    <td>
                                        <div className="button-group">
                                            <button onClick={() => handleViewTicket(ticket)} className="view-details-button">View Details</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedTicket && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={closeModal}>&times;</span>
                                <h2>Ticket Details</h2>
                                <p><strong>Description:</strong> {selectedTicket.description}</p>
                                <p><strong>Priority:</strong> {selectedTicket.priority}</p>
                                <p><strong>Request Type:</strong> {selectedTicket.requestType}</p>
                                <p><strong>Work Type:</strong> {selectedTicket.workType}</p>
                                <p><strong>Location:</strong> {selectedTicket.location}</p>
                                <p><strong>Date:</strong> {selectedTicket.datetime}</p>
                                {selectedTicket.imageBase64 && (
                                    <img src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`} alt="Uploaded Ticket" style={{ width: '100%' }} />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default TicketsCreated;

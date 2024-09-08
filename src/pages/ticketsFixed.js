import React, { useEffect, useState } from 'react';
import '../css/ticketsFixed.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import { Container } from '@mui/material';

function TicketsDone() {
    const navigate = useNavigate();
    const [doneTickets, setDoneTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        } else {
            fetchDoneTickets();
        }
    }, [navigate]);

    const fetchDoneTickets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/tickets');
            if (response.status === 200) {
                const doneTix = response.data.filter(ticket => ticket.status === 'Done');
                setDoneTickets(doneTix);
            } else {
                console.error('Failed to fetch tickets');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleHomeButtonClick = () => {
        navigate("/dashboard");
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
    };

    const closeModal = () => {
        setSelectedTicket(null);
    };

    return (
        <>
            <StaffAppBar/>
            <h2 className="h2">General Services Portal</h2>
            <Container fixed>
    <div className="container">
        <div className="view-container">
            
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
            {doneTickets.length > 0 ? (
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Ticket Number</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Reported By</th>
                            <th>Date Created</th>
                            <th>Personnel Assigned</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doneTickets.map((ticket, index) => (
                            <tr key={index}>
                                <td>{ticket.id}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.priority}</td>
                                <td>{ticket.username}</td>
                                <td>{ticket.datetime}</td>
                                <td>{ticket.assignedPersonnel || 'N/A'}</td>
                                <td>
                                    <div className="button-group">
                                        <button onClick={() => handleViewTicket(ticket)} className="view-details-button">View Details</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No Tickets Completed Yet</p>
            )}
        </div>
    </div>
</Container>
        </>
    );
}

export default TicketsDone;

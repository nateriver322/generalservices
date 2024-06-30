import React, { useEffect, useState } from 'react';
import '../css/personnelTicket.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

function PersonnelTickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [isTicketDetailsModalOpen, setIsTicketDetailsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
    const [feedbackError, setFeedbackError] = useState('');
    

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        } else {
            fetchTickets(username);
        }
    }, [navigate]);

    const fetchTickets = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tickets/personnel/${username}`);
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

    const openFeedbackModal = (ticket) => {
        setFeedbackModalTicket(ticket);
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsTicketDetailsModalOpen(true);
    };


    const closeTicketDetailsModal = () => {
        setSelectedTicket(null);
        setIsTicketDetailsModalOpen(false);
    };

    const handleHomeButtonClick = () => {
        navigate("/dashboard");
    };

    const handleDoneClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsFeedbackModalOpen(true);
    };

    const closeFeedbackModal = () => {
        setFeedbackModalTicket(null);
        setFeedbackError('');
    };

    const handleFeedbackSubmit = async (ticketId, feedback) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/feedback?feedback=${encodeURIComponent(feedback)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (response.ok) {
                setFeedback('');
                setIsFeedbackModalOpen(false);
                fetchTickets(localStorage.getItem('username')); // Refresh the ticket list
            } else {
                console.error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
                                <th>Priority</th>
                                <th>Reported By</th>
                                <th>Date Created</th>
                                <th>Scheduled Repair Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket, index) => (
                                <tr key={index}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.status}</td>
                                    <td>{ticket.priority}</td>
                                    <td>{ticket.username}</td>
                                    <td>{ticket.datetime}</td>
                                    <td>{ticket.scheduledRepairDate || 'Not scheduled'}</td>
                                    <td>
                                    <div className="button-group">
                                            {ticket.status === 'Done' ? (
                                                <button className="Finish-button" disabled>Finished</button>
                                            ) : (
                                                <button onClick={() => handleDoneClick(ticket)} className="done-button">Done</button>
                                            )}
                                            {ticket.feedback && (
                                                    <button onClick={() => openFeedbackModal(ticket)} className="view-feedback-button">View Feedback</button>)}
                                            <button onClick={() => handleViewTicket(ticket)} className="view-details-button">View Details</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    
                    
                    {isTicketDetailsModalOpen && selectedTicket && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={closeTicketDetailsModal}>&times;</span>
                                <h2>Ticket Details</h2>
                                <p><strong>Description:</strong> {selectedTicket.description}</p>
                                <p><strong>Priority:</strong> {selectedTicket.priority}</p>
                                <p><strong>Request Type:</strong> {selectedTicket.requestType}</p>
                                <p><strong>Work Type:</strong> {selectedTicket.workType}</p>
                                <p><strong>Location:</strong> {selectedTicket.location}</p>
                                <p><strong>Date Created:</strong> {selectedTicket.datetime}</p>
                                <p><strong>Scheduled Repair Date:</strong> {selectedTicket.scheduledRepairDate}</p>
                                {selectedTicket.imageBase64 && (
                                    <img src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`} alt="Uploaded Ticket" style={{ width: '100%' }} />
                                )}
                            </div>
                        </div>
                    )}
                    {isFeedbackModalOpen && selectedTicket && (
                        <div className="modal">
                            <div className="modal-content" style={{ width: '600px' }}>
                                <span className="close" onClick={() => setIsFeedbackModalOpen(false)}>&times;</span>
                                <h2>Provide Feedback</h2>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Enter your feedback here..."
                                    style={{ width: '100%', height: '150px' }}
                                />
                                <button className="confirm-button" onClick={() => handleFeedbackSubmit(selectedTicket.id, feedback)}>Confirm</button>
                            </div>
                        </div>
                    )}

                    {feedbackModalTicket && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={closeFeedbackModal}>&times;</span>
                                <h2>Feedback</h2>
                                {feedbackModalTicket.feedback && (
                                    <p>Personnel/Staff Feedback: {feedbackModalTicket.feedback}</p>
                                )}
                                {feedbackModalTicket.userFeedback ? (
                                    <p>User Feedback: {feedbackModalTicket.userFeedback}</p>
                                ) : (
                                    <>
                                    
                                        {feedbackError && <p className="error-message">{feedbackError}</p>}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default PersonnelTickets;
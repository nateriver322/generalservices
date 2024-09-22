import React, { useEffect, useState } from 'react';
import '../css/myTickets.css';
import { useNavigate } from 'react-router-dom';
import TicketAppBar from './TicketAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import { Box, Typography } from '@mui/material';

function MyTickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
    const [userFeedback, setUserFeedback] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [feedbackSuccessModalOpen, setFeedbackSuccessModalOpen] = useState(false); // New state for feedback success modal

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        } else {
            fetchTickets(username);
            fetchNotifications(username);
        }
    }, [navigate]);

    const fetchTickets = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tickets/user/${username}`);
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

    const fetchNotifications = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${username}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            } else {
                console.error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
                method: 'PUT',
            });
            if (response.ok) {
                setNotifications(notifications.filter(n => n.id !== notificationId));
            } else {
                console.error('Failed to mark notification as read');
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

    const openDeleteModal = (ticket) => {
        setTicketToDelete(ticket);
    };

    const closeDeleteModal = () => {
        setTicketToDelete(null);
    };

    const confirmDeleteTicket = async () => {
        if (ticketToDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/tickets/${ticketToDelete.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setTickets(tickets.filter(ticket => ticket.id !== ticketToDelete.id));
                    closeDeleteModal();
                    setSuccessModalOpen(true); // Open success modal after deletion
                } else {
                    alert('Failed to delete the ticket.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the ticket.');
            }
        }
    };

    const openFeedbackModal = (ticket) => {
        setFeedbackModalTicket(ticket);
        setUserFeedback('');
        setFeedbackError('');
    };

    const closeFeedbackModal = () => {
        setFeedbackModalTicket(null);
        setUserFeedback('');
        setFeedbackError('');
    };

    const handleSendFeedback = async (ticketId) => {
        if (!userFeedback.trim()) {
            setFeedbackError('Please enter your feedback before submitting.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/user-feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feedback: userFeedback }),
            });

            if (response.ok) {
                setUserFeedback('');
                closeFeedbackModal();
                setFeedbackSuccessModalOpen(true); // Open feedback success modal
                fetchTickets(localStorage.getItem('username'));
            } else if (response.status === 400) {
                const errorData = await response.json();
                setFeedbackError(errorData.message || 'Failed to send feedback. It may have already been submitted.');
            } else {
                setFeedbackError('Failed to send feedback. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            setFeedbackError('An error occurred while sending feedback. Please try again later.');
        }
    };

    return (
        <>
            <TicketAppBar/>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    marginTop: '30px' // Move the form down
                }}
            >
                <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
                <Typography
                    variant="h4"
                    component="h2"
                    
                   
                >
                    JobTrack
                </Typography>
            </Box>
            <div className="container">
                <div className="view-ticket-container">
                    <div className="notifications">
                        {notifications.map((notification, index) => (
                            <div key={index} className="notification">
                                <p>{notification.message}</p>
                                <button onClick={() => markNotificationAsRead(notification.id)}>Mark as Read</button>
                            </div>
                        ))}
                    </div>
                    {tickets.length === 0 ? (
                        <p className="no-tickets-message">No Tickets Submitted</p>
                    ) : (
                        <table className="ticket-table">
                            <thead>
                                <tr>
                                    <th>Ticket Number</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Location</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket, index) => (
                                    <tr key={index}>
                                        <td>{ticket.id}</td>
                                        <td>{ticket.status}</td>
                                        <td>{ticket.priority}</td>
                                        <td>{ticket.location}</td>
                                        <td>{ticket.description}</td>
                                        <td>
                                            <div className="button-group">
                                                <button onClick={() => handleViewTicket(ticket)} className="view-details-button">View Details</button>
                                                {ticket.feedback && (
                                                    <button onClick={() => openFeedbackModal(ticket)} className="view-feedback-button">View Feedback</button>)}
                                                <button onClick={() => openDeleteModal(ticket)} className="delete-button">Cancel</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
                    {ticketToDelete && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Confirm Cancelation</h2>
                                <p>Are you sure you want to cancel this ticket?</p>
                                <button onClick={confirmDeleteTicket} className="confirm-delete-button">Yes</button>
                                <button onClick={closeDeleteModal} className="cancel-delete-button">No</button>
                            </div>
                        </div>
                    )}
                    {successModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Success</h2>
                                <p>Ticket Cancelled</p>
                                <button onClick={() => setSuccessModalOpen(false)} className="user-close-button">Close</button>
                            </div>
                        </div>
                    )}
                    {feedbackModalTicket && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={closeFeedbackModal}>&times;</span>
                                <h2>Feedback</h2>
                                {feedbackModalTicket.feedback && (
                                    <>
                                        <p>Personnel/Staff Feedback:</p>
                                        <textarea className="user-feedback" readOnly value= {feedbackModalTicket.feedback}/>
                                    </>
                                )}
                                {feedbackModalTicket.userFeedback ? (
                                    <>
                                    <p>Your Feedback:</p>
                                    <textarea className="user-feedback" readOnly value= {feedbackModalTicket.userFeedback}/>
                                    </>
                                ) : (
                                    <>
                                        <textarea className="user-feedback"
                                            value={userFeedback}
                                            onChange={(e) => setUserFeedback(e.target.value)}
                                            placeholder="Enter your feedback for personnel/staff."
                                        />
                                        {feedbackError && <p className="error-message">{feedbackError}</p>}
                                        <button onClick={() => handleSendFeedback(feedbackModalTicket.id)} className="send-feedback-button">
                                            Send feedback
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {feedbackSuccessModalOpen && ( // Feedback success modal
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Success</h2>
                                <p>Feedback submitted successfully!</p>
                                <button onClick={() => setFeedbackSuccessModalOpen(false)} className="user-close-button">Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default MyTickets;

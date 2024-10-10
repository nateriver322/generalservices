import React, { useEffect, useState } from 'react';
import '../css/myTickets.css';
import { useNavigate } from 'react-router-dom';
import TicketAppBar from './TicketAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import {
    Box,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
} from '@mui/material';

function MyTickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
    const [userFeedback, setUserFeedback] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [feedbackSuccessSnackbarOpen, setFeedbackSuccessSnackbarOpen] = useState(false);

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

    const openDeleteModal = (ticket) => {
        setTicketToDelete(ticket);
    };

    const confirmDeleteTicket = async () => {
        if (ticketToDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/tickets/${ticketToDelete.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setTickets(tickets.filter(ticket => ticket.id !== ticketToDelete.id));
                    setSuccessSnackbarOpen(true);
                } else {
                    alert('Failed to delete the ticket.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the ticket.');
            } finally {
                setTicketToDelete(null);
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
                closeFeedbackModal();
                setFeedbackSuccessSnackbarOpen(true);
                fetchTickets(localStorage.getItem('username'));
            } else {
                const errorData = await response.json();
                setFeedbackError(errorData.message || 'Failed to send feedback.');
            }
        } catch (error) {
            console.error('Error:', error);
            setFeedbackError('An error occurred while sending feedback. Please try again later.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved':
                return 'green';
            case 'Ongoing':
                return 'orange';
            case 'Pending':
                return 'red';
            case 'Cancelled':
                return 'red';
            default:
                return 'black';
        }
    };

    return (
        <>
            <TicketAppBar />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px',
                    
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
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
                    
                <Box sx={{ width: '100%', maxWidth: 1450 }}>
                    <Box sx={{
                    maxHeight: '100px', // Set the max height of the notification container
                 overflowY: 'auto',  // Enable vertical scrolling when content overflows
  }}>
                        {notifications.map((notification) => (
                            <Box key={notification.id} sx={{ p: 1, border: '1px solid gray', mb: 1 }}>
                                <Typography>{notification.message}</Typography>
                                <Button onClick={() => markNotificationAsRead(notification.id)}>Mark as Read</Button>
                            </Box>
                        ))}
                    </Box>
                    {tickets.length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
              No Tickets submitted.
            </Typography>
                    ) : (
                        <Box sx={{ maxHeight: '600px', overflowY: 'auto', border: '1.5px solid #800000', borderRadius: '4px' }}>
                            <Table sx={{ margin: 0, padding: 0 }} >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ticket Number</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell>{ticket.id}</TableCell>
                                            <TableCell sx={{ color: getStatusColor(ticket.status) }}>
                                                {ticket.status}
                                            </TableCell>
                                            <TableCell>{ticket.priority}</TableCell>
                                            <TableCell>{ticket.location}</TableCell>
                                            <TableCell>{ticket.description}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button 
                                                        variant="outlined" 
                                                         color="warning"
                                                        onClick={() => handleViewTicket(ticket)}
                                                        sx={{ width: '120px', height: '60px' }}
                                                    >
                                                        View Details
                                                    </Button>
                                                    {ticket.feedback && (
                                                        <Button 
                                                            variant="outlined" 
                                                             color="success"
                                                            onClick={() => openFeedbackModal(ticket)}
                                                            sx={{ width: '120px' }}
                                                        >
                                                            View Feedback
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        variant="contained" 
                                                        color="error" 
                                                        onClick={() => openDeleteModal(ticket)}
                                                        sx={{ width: '120px' }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </Box>
            </Box>

            {selectedTicket && (
                <Dialog open={Boolean(selectedTicket)} onClose={() => setSelectedTicket(null)} maxWidth="md" fullWidth>
                <DialogTitle>Ticket Details</DialogTitle>
                <DialogContent>
                    <Typography><strong>Description:</strong> {selectedTicket.description}</Typography>
                    <Typography><strong>Priority:</strong> {selectedTicket.priority}</Typography>
                    <Typography><strong>Request Type:</strong> {selectedTicket.requestType}</Typography>
                    <Typography><strong>Work Type:</strong> {selectedTicket.workType}</Typography>
                    <Typography><strong>Location:</strong> {selectedTicket.location}</Typography>
                    <Typography><strong>Date:</strong> {selectedTicket.datetime}</Typography>
                    {selectedTicket.imageBase64 && (
                        <img src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`} alt="Uploaded Ticket" style={{ width: '100%' }} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedTicket(null)}>Close</Button>
                </DialogActions>
            </Dialog>
            )}
            <Dialog open={Boolean(ticketToDelete)} onClose={() => setTicketToDelete(null)}>
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to cancel this ticket?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDeleteTicket} color="error">Yes</Button>
                    <Button onClick={() => setTicketToDelete(null)}>No</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSuccessSnackbarOpen(false)}
                message="Ticket Cancelled"
            />
            <Snackbar
                open={feedbackSuccessSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setFeedbackSuccessSnackbarOpen(false)}
                message="Feedback submitted successfully!"
            />
            {feedbackModalTicket && (
                <Dialog open={Boolean(feedbackModalTicket)} onClose={closeFeedbackModal} maxWidth="md" fullWidth>
                <DialogTitle>Feedback</DialogTitle>
                <DialogContent>
                    {feedbackModalTicket.feedback && (
                        <Typography sx={{ mb: '20px' }}><strong>Personnel/Staff Feedback:</strong> {feedbackModalTicket.feedback}</Typography>
                    )}
                    {feedbackModalTicket.userFeedback ? (
                        <Typography><strong>Your Feedback:</strong> {feedbackModalTicket.userFeedback}</Typography>
                    ) : (
                        <TextField
                            
                            label="Enter your feedback"
                            multiline
                            fullWidth
                            value={userFeedback}
                            onChange={(e) => setUserFeedback(e.target.value)}
                            error={!!feedbackError}
                            helperText={feedbackError}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleSendFeedback(feedbackModalTicket.id)} color="primary">Send feedback</Button>
                    <Button onClick={closeFeedbackModal}>Cancel</Button>
                </DialogActions>
            </Dialog>
            )}
        </>
    );
}

export default MyTickets;
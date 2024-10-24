import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketAppBar from './TicketAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
    Badge,
    IconButton,
    Popover,
} from '@mui/material';

function MyTickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
    const [userFeedback, setUserFeedback] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [feedbackSuccessSnackbarOpen, setFeedbackSuccessSnackbarOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

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
            setLoading(true); // Set loading to true before fetching
            const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/user/${username}`);
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                console.error('Failed to fetch tickets');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const fetchNotifications = async (username) => {
        try {
            const response = await fetch(`https://generalservicescontroller.onrender.com/api/notifications/${username}`);
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
            const response = await fetch(`https://generalservicescontroller.onrender.com/api/notifications/${notificationId}`, {
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
                const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/${ticketToDelete.id}`, {
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
            const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/${ticketId}/user-feedback`, {
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

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

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
                    <Typography variant="h4" component="h2">
                        JobTrack
                    </Typography>
                </Box>

                <Box sx={{ width: '100%', maxWidth: 1450 }}>
                    <Box sx={{
                        maxHeight: '100px', 
                        overflowY: 'auto',  
                    }}>
                    </Box>
                    {loading ? (
                        <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
                            Loading...
                        </Typography>
                    ) : tickets.length === 0 ? (
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
                                                    {ticket.status === 'Resolved' ? (
                                                        <Button 
                                                            variant="contained" 
                                                            color="error" 
                                                            onClick={() => openDeleteModal(ticket)}
                                                            sx={{ width: '120px' }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    ) : ticket.status === 'Ongoing' ? (
                                                        <Button 
                                                            variant="contained" 
                                                            color="error" 
                                                            disabled
                                                            sx={{ width: '120px' }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="contained" 
                                                            color="error" 
                                                            disabled
                                                            sx={{ width: '120px' }}
                                                        >
                                                            Cancelled
                                                        </Button>
                                                    )}
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
        </>
    );
}

export default MyTickets;

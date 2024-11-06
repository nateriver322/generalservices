import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketAppBar from './TicketAppBar';
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
    IconButton,
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { memo } from 'react';

// Memoize the app bar since it doesn't depend on any dynamic data
const MemoizedTicketAppBar = memo(TicketAppBar);

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
        const username = sessionStorage.getItem('username');
        if (!username) {
            navigate('/');
        } else {
            fetchTickets(username);
            fetchNotifications(username);
        }
    }, [navigate]);

    const fetchTickets = useCallback(async (username) => {
        try {
            const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/user/${username}`);
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                console.error('Failed to fetch tickets');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }, []);

    const fetchNotifications = useCallback(async (username) => {
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
    }, []);

    const handleDeleteTicket = async () => {
        if (!ticketToDelete) return;

        try {
            const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/${ticketToDelete.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketToDelete.id));
                setSuccessSnackbarOpen(true);
            } else {
                console.error('Failed to delete ticket');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setTicketToDelete(null);
        }
    };

    const handleSendFeedback = async (ticketId) => {
        if (!userFeedback.trim()) {
            setFeedbackError('Please enter your feedback before submitting.');
            return;
        }

        try {
            const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/${ticketId}/user-feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback: userFeedback }),
            });
            if (response.ok) {
                setFeedbackModalTicket(null);
                setFeedbackSuccessSnackbarOpen(true);
                fetchTickets(sessionStorage.getItem('username'));
            } else {
                const errorData = await response.json();
                setFeedbackError(errorData.message || 'Failed to send feedback.');
            }
        } catch (error) {
            console.error('Error:', error);
            setFeedbackError('An error occurred while sending feedback.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'green';
            case 'Ongoing': return 'orange';
            case 'Pending': return 'red';
            case 'Cancelled': return 'red';
            default: return 'black';
        }
    };

    return (
        <>
            <MemoizedTicketAppBar />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
                    <Typography variant="h4">JobTrack</Typography>
                </Box>

                {tickets.length === 0 ? (
                    <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>No Tickets submitted.</Typography>
                ) : (
                    <Box sx={{ maxHeight: '600px', overflowY: 'auto', border: '1.5px solid #800000', borderRadius: '4px' }}>
                        <Table>
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
                                        <TableCell sx={{ color: getStatusColor(ticket.status) }}>{ticket.status}</TableCell>
                                        <TableCell>{ticket.priority}</TableCell>
                                        <TableCell>{ticket.location}</TableCell>
                                        <TableCell>{ticket.description}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" color="warning" onClick={() => setSelectedTicket(ticket)}>View Details</Button>
                                            {ticket.status === 'Resolved' && (
                                                <Button variant="contained" color="error" onClick={() => setTicketToDelete(ticket)}>Delete</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Box>

            {/* Dialogs */}
            {selectedTicket && (
                <Dialog open={!!selectedTicket} onClose={() => setSelectedTicket(null)} maxWidth="md" fullWidth>
                    <DialogTitle>Ticket Details</DialogTitle>
                    <DialogContent>
                        <Typography><strong>Description:</strong> {selectedTicket.description}</Typography>
                        <Typography><strong>Priority:</strong> {selectedTicket.priority}</Typography>
                        <Typography><strong>Location:</strong> {selectedTicket.location}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedTicket(null)}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}

            {ticketToDelete && (
                <Dialog open={!!ticketToDelete} onClose={() => setTicketToDelete(null)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete this ticket?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteTicket} color="error">Yes</Button>
                        <Button onClick={() => setTicketToDelete(null)}>No</Button>
                    </DialogActions>
                </Dialog>
            )}

            <Snackbar
                open={successSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSuccessSnackbarOpen(false)}
                message="Ticket Deleted"
            />
            <Snackbar
                open={feedbackSuccessSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setFeedbackSuccessSnackbarOpen(false)}
                message="Feedback submitted successfully!"
            />
        </>
    );
}

export default MyTickets;

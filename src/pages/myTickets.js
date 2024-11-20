import React, { useEffect, useState, useCallback, memo } from 'react';
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
    Paper,
} from '@mui/material';

// Memoized TableRow component for better performance
const TicketRow = memo(({ ticket, onViewDetails, onViewFeedback, onDelete }) => {
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
    <TableRow>
      <TableCell>{ticket.id}</TableCell>
      <TableCell sx={{ color: getStatusColor(ticket.status) }}>{ticket.status}</TableCell>
      <TableCell>{ticket.priority}</TableCell>
      <TableCell>{ticket.location}</TableCell>
      <TableCell>{ticket.description}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => onViewDetails(ticket)}
            sx={{ width: '120px', height: '60px' }}
          >
            View Details
          </Button>
          {ticket.feedback && (
            <Button
              variant="outlined"
              color="success"
              onClick={() => onViewFeedback(ticket)}
              sx={{ width: '120px' }}
            >
              View Feedback
            </Button>
          )}
          {ticket.status === 'Resolved' ? (
            <Button
              variant="contained"
              color="error"
              onClick={() => onDelete(ticket)}
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
              onClick={() => onDelete(ticket)}
              sx={{ width: '120px' }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
});

const MyTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
  const [userFeedback, setUserFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [feedbackSuccessSnackbarOpen, setFeedbackSuccessSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Memoized API calls
  const fetchTickets = useCallback(async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/user/${username}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSendFeedback = useCallback(async (ticketId) => {
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
        const username = sessionStorage.getItem('username');
        fetchTickets(username);
      }
    } catch (error) {
      setFeedbackError('Failed to send feedback');
    }
  }, [userFeedback, fetchTickets]);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchTickets(username);
    }
  }, [navigate, fetchTickets]);

  const confirmDeleteTicket = async () => {
    if (ticketToDelete) {
      try {
        const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/${ticketToDelete.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setTickets(prev => prev.filter(ticket => ticket.id !== ticketToDelete.id));
          setSuccessSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
      setTicketToDelete(null);
    }
  };

  return (
    <>
      <TicketAppBar />
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
            <Typography variant="h4" component="h2">
              JobTrack
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}>
              <CircularProgress />
            </Box>
          ) : (

          <Paper sx={{ width: '100%', maxWidth: 1450, p: 2 }}>
            {tickets.length === 0 ? (
              <Typography variant="h6" align="center">
                No Tickets submitted.
              </Typography>
            ) : (
              <Box sx={{ maxHeight: '600px', overflowY: 'auto', border: '1.5px solid #800000', borderRadius: '4px' }}>
                <Table stickyHeader>
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
                      <TicketRow
                        key={ticket.id}
                        ticket={ticket}
                        onViewDetails={setSelectedTicket}
                        onViewFeedback={setFeedbackModalTicket}
                        onDelete={setTicketToDelete}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
           )}
        </Box>

        {/* Details Dialog */}
        <Dialog open={Boolean(selectedTicket)} onClose={() => setSelectedTicket(null)} maxWidth="md" fullWidth>
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogContent>
            {selectedTicket && (
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Description:</strong> {selectedTicket.description}</Typography>
                <Typography><strong>Priority:</strong> {selectedTicket.priority}</Typography>
                <Typography><strong>Request Type:</strong> {selectedTicket.requestType}</Typography>
                <Typography><strong>Work Type:</strong> {selectedTicket.workType}</Typography>
                <Typography><strong>Location:</strong> {selectedTicket.location}</Typography>
                <Typography><strong>Date:</strong> {selectedTicket.datetime}</Typography>
                {selectedTicket.imageBase64 && (
                  <img
                    src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`}
                    alt="Ticket"
                    style={{ width: '100%', marginTop: '16px' }}
                  />
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedTicket(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete/Cancel Dialog */}
        <Dialog open={Boolean(ticketToDelete)} onClose={() => setTicketToDelete(null)}>
          <DialogTitle>
            {ticketToDelete?.status === 'Resolved' ? 'Confirm Deletion' : 'Confirm Cancellation'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {ticketToDelete?.status === 'Resolved'
                ? 'Are you sure you want to delete this resolved ticket?'
                : 'Are you sure you want to cancel this ticket?'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteTicket} color="error">Yes</Button>
            <Button onClick={() => setTicketToDelete(null)}>No</Button>
          </DialogActions>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={Boolean(feedbackModalTicket)} onClose={() => setFeedbackModalTicket(null)} maxWidth="md" fullWidth>
          <DialogTitle>Feedback</DialogTitle>
          <DialogContent>
            {feedbackModalTicket?.feedback && (
              <Typography sx={{ mb: 2 }}><strong>Staff Feedback:</strong> {feedbackModalTicket.feedback}</Typography>
            )}
            {feedbackModalTicket?.userFeedback ? (
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
                sx={{ mt: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleSendFeedback(feedbackModalTicket?.id)} color="primary">
              Send feedback
            </Button>
            <Button onClick={() => setFeedbackModalTicket(null)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbars */}
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
      </Box>
    </>
  );
};

export default MyTickets; 
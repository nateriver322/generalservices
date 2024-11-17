import React, { useEffect, useState, useMemo } from 'react';
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
  const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
  const [userFeedback, setUserFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [feedbackSuccessSnackbarOpen, setFeedbackSuccessSnackbarOpen] = useState(false);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchTickets(username);
    }
  }, [navigate]);

  const fetchTickets = async (username) => {
    try {
      const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/user/${username}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleSendFeedback = async (ticketId) => {
    if (!userFeedback.trim()) {
      setFeedbackError('Please enter your feedback before submitting.');
      return;
    }

    try {
      const response = await fetch(
        `https://generalservicescontroller.onrender.com/api/tickets/${ticketId}/user-feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feedback: userFeedback }),
        }
      );

      if (response.ok) {
        closeFeedbackModal();
        setFeedbackSuccessSnackbarOpen(true);
        fetchTickets(sessionStorage.getItem('username'));
      } else {
        const errorData = await response.json();
        setFeedbackError(errorData.message || 'Failed to send feedback.');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      setFeedbackError('An error occurred while sending feedback. Please try again later.');
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

  const getStatusColor = useMemo(
    () => (status) => {
      switch (status) {
        case 'Resolved':
          return 'green';
        case 'Ongoing':
          return 'orange';
        case 'Pending':
        case 'Cancelled':
          return 'red';
        default:
          return 'black';
      }
    },
    []
  );

  const renderedTickets = useMemo(() => {
    return tickets.map((ticket) => (
      <TableRow key={ticket.id}>
        <TableCell>{ticket.id}</TableCell>
        <TableCell style={{ color: getStatusColor(ticket.status) }}>{ticket.status}</TableCell>
        <TableCell>{ticket.priority}</TableCell>
        <TableCell>{ticket.location}</TableCell>
        <TableCell>{ticket.description}</TableCell>
        <TableCell>
          <Button onClick={() => openFeedbackModal(ticket)} variant="contained">
            Feedback
          </Button>
        </TableCell>
      </TableRow>
    ));
  }, [tickets, getStatusColor]);

  return (
    <>
      <TicketAppBar />
      <Box sx={{ padding: '30px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <ConstructionIcon sx={{ fontSize: 60, marginRight: 2 }} />
          <Typography variant="h4">JobTrack</Typography>
        </Box>
        <Box sx={{ border: '1.5px solid #800000', borderRadius: '4px', overflowY: 'auto', maxHeight: '600px' }}>
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
            <TableBody>{renderedTickets}</TableBody>
          </Table>
        </Box>
      </Box>

      <Dialog open={Boolean(feedbackModalTicket)} onClose={closeFeedbackModal}>
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <TextField
            label="Your Feedback"
            fullWidth
            multiline
            rows={4}
            value={userFeedback}
            onChange={(e) => setUserFeedback(e.target.value)}
            error={!!feedbackError}
            helperText={feedbackError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSendFeedback(feedbackModalTicket.id)} color="primary">
            Submit
          </Button>
          <Button onClick={closeFeedbackModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbarOpen(false)}
        message="Action completed successfully!"
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

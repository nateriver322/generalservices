import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewDetailsModal from './ViewDetailsModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  Typography,
  Box,
  TextField
} from '@mui/material';
import PersonnelResponsiveAppBar from './PersonnelResponsiveAppBar';
import axios from 'axios';

const API_BASE_URL = 'https://generalservicescontroller.onrender.com/api';

function PersonnelTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

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
      const response = await axios.get(`${API_BASE_URL}/tickets/personnel/${username}`);
      const data = response.data;
      const normalizedUsername = username.trim().toLowerCase();

      const ongoingAndPendingTickets = data.filter(ticket => {
        const personnelList = ticket.assignedPersonnel.split(',')
          .map(personnel => personnel.trim().toLowerCase());
        return (ticket.status === 'Pending' || ticket.status === 'Ongoing') &&
          personnelList.includes(normalizedUsername);
      });

      setTickets(ongoingAndPendingTickets);
      setError(null);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets. Please try again later.');
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedTicket(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Resolved': 'green',
      'Ongoing': 'orange',
      'Pending': 'red',
      'Cancelled': 'red',
      'default': 'black'
    };
    return colors[status] || colors.default;
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    minWidth: 300,
    maxWidth: '90%'
  };

  const handleAssessTicket = (ticket) => {
    setSelectedTicket(ticket);
    setFeedback(''); // Clear previous feedback
    setFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      setError('Please enter feedback before submitting');
      return;
    }

    try {
      const username = sessionStorage.getItem('username'); // Changed from localStorage to sessionStorage
      if (!username) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(
        `${API_BASE_URL}/tickets/${selectedTicket.id}/personnel-feedback`,
        { feedback },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          params: { personnelUsername: username }
        }
      );

      if (response.status === 200) {
        setFeedbackModalOpen(false);
        setSuccessMessage('Feedback submitted successfully!');
        setSuccessModalOpen(true);
        setFeedback('');
        await fetchTickets(username); // Refresh tickets
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
    }
  };

  const hasSubmittedFeedback = (ticket) => {
    const username = sessionStorage.getItem('username');
    return ticket.personnelFeedbacks && ticket.personnelFeedbacks[username];
  };

  return (
    <>
      <PersonnelResponsiveAppBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ width: '100%', maxWidth: 1450 }}>
          {tickets.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
              No ongoing or pending tickets assigned
            </Typography>
          ) : (
            <Box sx={{ maxHeight: '520px', overflowY: 'auto', border: '1.5px solid #800000', borderRadius: '4px' }}>
              <Table sx={{ margin: 0, padding: 0 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Reported By</TableCell>
                    <TableCell>Date Created</TableCell>
                    <TableCell>Scheduled Repair Date</TableCell>
                    <TableCell>Assigned Personnel</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell style={{ color: getStatusColor(ticket.status) }}>
                        {ticket.status}
                      </TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                      <TableCell>{ticket.username}</TableCell>
                      <TableCell>{ticket.datetime}</TableCell>
                      <TableCell>{ticket.scheduledRepairDate || 'Not scheduled'}</TableCell>
                      <TableCell>{ticket.assignedPersonnel}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleAssessTicket(ticket)}
                          variant="outlined"
                          color="success"
                          sx={{ marginRight: 1, width: '120px', height: '60px' }}
                          disabled={hasSubmittedFeedback(ticket)}
                        >
                          {hasSubmittedFeedback(ticket) ? 'Assessed' : 'Assess'}
                        </Button>
                        <Button
                          onClick={() => handleViewTicket(ticket)}
                          variant="outlined"
                          color="warning"
                          sx={{ marginRight: 1, width: '120px', height: '60px' }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Box>

      <ViewDetailsModal
        open={detailsModalOpen}
        onClose={closeDetailsModal}
        ticket={selectedTicket}
      />

      <Modal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6">Submit Feedback for Ticket #{selectedTicket?.id}</Typography>
          <TextField
            label="Feedback"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ width: '100%', mt: 2 }}
            error={!!error && !feedback.trim()}
            helperText={error && !feedback.trim() ? 'Feedback is required' : ''}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim()}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal 
        open={successModalOpen} 
        onClose={() => setSuccessModalOpen(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6">Success</Typography>
          <Typography>{successMessage}</Typography>
          <Button 
            onClick={() => setSuccessModalOpen(false)} 
            color="primary"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default PersonnelTickets;
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
  CircularProgress,
  Box,
  TextField
} from '@mui/material';
import PersonnelResponsiveAppBar from './PersonnelResponsiveAppBar';
import axios from 'axios';

function PersonnelTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchTickets(username);
    }
  }, [navigate]);

  const fetchTickets = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/personnel/${username}`);
      if (response.ok) {
        const data = await response.json();
        const normalizedUsername = username.trim().toLowerCase();
  
        // Filter tickets for the logged-in personnel and with "Pending" or "Ongoing" statuses
        const ongoingAndPendingTickets = data.filter(ticket => {
          const personnelList = ticket.assignedPersonnel.split(',').map(personnel => personnel.trim().toLowerCase());
          return (ticket.status === 'Pending' || ticket.status === 'Ongoing') &&
            personnelList.includes(normalizedUsername);
        });
  
        setTickets(ongoingAndPendingTickets);
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };
 
  const handleAssessTicket = (ticket) => {
    setSelectedTicket(ticket);
    setFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      const username = sessionStorage.getItem('username')?.trim();  // Trim whitespace just in case
      console.log(`Submitting feedback for ticket ${selectedTicket.id} by user: ${username}`);

      const response = await axios.post(
        `https://generalservicescontroller.onrender.com/api/tickets/${selectedTicket.id}/personnel-feedback`,
        { feedback },
        { params: { personnelUsername: username } }
      );

      if (response.status === 200) {
        setFeedbackModalOpen(false);
        setSuccessMessage('Feedback submitted successfully!');
        setSuccessModalOpen(true);
        setFeedback('');
        fetchTickets(username);  // Refresh tickets to update the UI
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <>
      <PersonnelResponsiveAppBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '30px',
        }}
      >
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

        <Box sx={{ width: '100%', maxWidth: 1450 }}>
          {tickets.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
              No ongoing or pending tickets assigned
            </Typography>
          ) : (
            <Box sx={{ maxHeight: '520px', overflowY: 'auto', border: '1.5px solid #800000', borderRadius: '4px' }}>
              <Table sx={{ margin: 0, padding: 0 }} >
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
  {tickets.map((ticket, index) => (
    <TableRow key={index}>
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
        >
          Assess
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
       )}
     </Box>

      <ViewDetailsModal
        open={detailsModalOpen}
        onClose={closeDetailsModal}
        ticket={selectedTicket}
      />

      {feedbackModalOpen && selectedTicket && (
        <Modal
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6">Submit Feedback for Ticket #{selectedTicket.id}</Typography>
            {/* Existing Personnel Feedbacks Section */}
      {selectedTicket.personnelFeedbacks && Object.keys(selectedTicket.personnelFeedbacks).length > 0 && (
        <>
          {Object.entries(selectedTicket.personnelFeedbacks).map(([personnel, feedback]) => (
            <Typography key={personnel} sx={{ mb: 1 }}>
               <Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Task update:</strong></Typography> {feedback}
            </Typography>
          ))}
        </>
      )}

      {/* Feedback Submission Textfield */}
      <TextField
        label="Submit New Feedback"
        multiline
        rows={4}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        sx={{ width: '100%', mt: 2 }}
        placeholder="Enter your feedback here..."
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
)}

      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Success</Typography>
          <Typography>The ticket was successfully assessed!</Typography>
          <Button onClick={() => setSuccessModalOpen(false)} color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default PersonnelTickets;
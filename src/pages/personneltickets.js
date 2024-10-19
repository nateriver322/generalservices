import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
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

function PersonnelTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      const username = localStorage.getItem('username');
      const response = await axios.post(`http://localhost:8080/api/tickets/${selectedTicket.id}/personnel-feedback`, 
        { feedback },
        { params: { personnelUsername: username } }
      );
      if (response.status === 200) {
        setFeedbackModalOpen(false);
        setSuccessMessage('Feedback submitted successfully!');
        setSuccessModalOpen(true);
        setFeedback('');
        fetchTickets(username); // Refresh tickets to update the UI
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const hasSubmittedFeedback = (ticket) => {
    const username = localStorage.getItem('username');
    return ticket.feedback && ticket.feedback[username];
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
                        {!hasSubmittedFeedback(ticket) && (
                          <Button
                            onClick={() => handleAssessTicket(ticket)}
                            variant="outlined"
                            color="success"
                            sx={{ marginRight: 1, width: '120px', height: '60px' }}
                          >
                            Assess
                          </Button>
                        )}
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

      {detailsModalOpen && selectedTicket && (
        <Modal
          open={detailsModalOpen}
          onClose={closeDetailsModal}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Box sx={{
            ...modalStyle,
            width: '80%',
            maxWidth: '800px',
            maxHeight: '800px',
          }}>
            <Typography variant="h6">Ticket Details</Typography>
            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Typography variant="body1"><strong>Ticket Number:</strong> {selectedTicket.id}</Typography>
              <Typography variant="body1"><strong>Date Created:</strong> {selectedTicket.datetime}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {selectedTicket.status}</Typography>
              <Typography variant="body1"><strong>Priority:</strong> {selectedTicket.priority}</Typography>
              <Typography variant="body1"><strong>Reported By:</strong> {selectedTicket.username}</Typography>
              <Typography variant="body1"><strong>Scheduled Repair Date:</strong> {selectedTicket.scheduledRepairDate || 'Not scheduled'}</Typography>
              <Typography variant="body1"><strong>Assigned Personnel:</strong> {selectedTicket.assignedPersonnel}</Typography>
              <Typography variant="body1"><strong>Description:</strong> {selectedTicket.description}</Typography>
              <Typography variant="body1"><strong>Request Type:</strong> {selectedTicket.requestType}</Typography>
              <Typography variant="body1"><strong>Work Type:</strong> {selectedTicket.workType}</Typography>
              <Typography variant="body1"><strong>Location:</strong> {selectedTicket.location}</Typography>

              {selectedTicket.imageBase64 && (
                <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
                  <img
                    src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`}
                    alt="Uploaded Ticket"
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={closeDetailsModal}>Close</Button>
            </Box>
          </Box>
        </Modal>
      )}

      {feedbackModalOpen && selectedTicket && (
        <Modal
          open={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Box sx={modalStyle}>
            <Typography variant="h6">Submit Feedback for Ticket #{selectedTicket.id}</Typography>
            <TextField
              label="Feedback"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ width: '100%', mt: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSubmitFeedback}>
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

<Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
          <Box sx={{ ...modalStyle }}>
            <Typography variant="h6">Success</Typography>
            <Typography>The ticket was successfully assessed !</Typography>
            <Button onClick={() => setSuccessModalOpen(false)} color="primary">
              Close
            </Button>
          </Box>
        </Modal>
    </>
  );
}

export default PersonnelTickets;

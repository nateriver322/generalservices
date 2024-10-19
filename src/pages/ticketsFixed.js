import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import { Box, Typography, Button, Modal, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function TicketsDone() {
  const navigate = useNavigate();
  const [doneTickets, setDoneTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [feedbackSuccessSnackbarOpen, setFeedbackSuccessSnackbarOpen] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchDoneTickets();
    }
  }, [navigate]);

  const fetchDoneTickets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tickets');
      if (response.status === 200) {
        const doneTix = response.data.filter(ticket => ticket.status === 'Resolved');
        setDoneTickets(doneTix);
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

  const handleOpenFeedbackModal = (ticket) => {
    setSelectedTicket(ticket);
    setFeedback('');
    setFeedbackError('');
    setFeedbackModalOpen(true);
  };

  const confirmDeleteTicket = async () => {
    if (ticketToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/tickets/${ticketToDelete.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setDoneTickets(doneTickets.filter(ticket => ticket.id !== ticketToDelete.id));
          closeDeleteModal();
          setSuccessSnackbarOpen(true);
        } else {
          alert('Failed to delete the ticket.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the ticket.');
      }
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      setFeedbackError('Please enter your feedback before submitting.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/tickets/${selectedTicket.id}/user-feedback`, { feedback });
      setFeedbackModalOpen(false);
      setFeedbackSuccessSnackbarOpen(true);
      fetchDoneTickets();
    } catch (error) {
      setFeedbackError(error.response ? error.response.data : 'Error submitting feedback');
    }
  };

  const handleViewFeedback = (ticket) => {
    setSelectedTicket(ticket);
    setFeedbackModalOpen(true);
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

  const closeDeleteModal = () => {
    setTicketToDelete(null);
  };

  return (
    <>
      <StaffAppBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
        

        <Box sx={{ width: '100%', maxWidth: 1450 }}>
          {doneTickets.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>No tickets resolved</Typography>
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
                    <TableCell>Personnel Assigned</TableCell>
                    <TableCell>Scheduled Repair Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doneTickets.map((ticket, index) => (
                    <TableRow key={index}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell style={{ color: ticket.status === 'Resolved' ? 'green' : 'black' }}>{ticket.status}</TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                      <TableCell>{ticket.username}</TableCell>
                      <TableCell>{ticket.datetime}</TableCell>
                      <TableCell>{ticket.assignedPersonnel || 'None'}</TableCell>
                      <TableCell>{ticket.scheduledRepairDate || 'Not scheduled'}</TableCell>
                      <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button onClick={() => handleViewTicket(ticket)} variant="outlined" color="warning" sx={{ marginRight: 1, width: '120px', height: '60px' }}>View Details</Button>
                          <Button onClick={() => handleViewFeedback(ticket)} variant="outlined" color="primary" sx={{ marginRight: 1, width: '120px', height: '60px' }}>
                  View Feedback
                </Button>
                          <Button onClick={() => setTicketToDelete(ticket)} variant="contained" color="error" sx={{ width: '120px', height: '60px' }}>Delete</Button>
                          </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>

        {/* Delete Confirmation Modal */}
        {ticketToDelete && (
          <Modal open={!!ticketToDelete} onClose={closeDeleteModal}>
            <Box sx={{ ...modalStyle }}>
              <Typography variant="h6">Confirm Deletion</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>Are you sure you want to delete this ticket?</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={confirmDeleteTicket} variant="contained" color="error" sx={{ marginRight: 1 }}>Yes</Button>
                <Button onClick={closeDeleteModal} variant="outlined" color="secondary">Cancel</Button>
              </Box>
            </Box>
          </Modal>
        )}

        {/* Ticket Details Modal */}
        {detailsModalOpen && selectedTicket && (
          <Modal open={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ ...modalStyle, width: '80%', maxWidth: '800px', maxHeight: '800px' }}>
              <DialogTitle>Ticket Details</DialogTitle>
              <DialogContent sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Typography variant="body1"><strong>Ticket Number:</strong> {selectedTicket.id}</Typography>
                <Typography variant="body1"><strong>Date Created:</strong> {selectedTicket.datetime}</Typography>
                <Typography variant="body1"><strong>Status:</strong> {selectedTicket.status}</Typography>
                <Typography variant="body1"><strong>Priority:</strong> {selectedTicket.priority}</Typography>
                <Typography variant="body1"><strong>Reported By:</strong> {selectedTicket.username}</Typography>
                <Typography variant="body1"><strong>Assigned Personnel:</strong> {selectedTicket.assignedPersonnel || 'Not assigned'}</Typography>
                <Typography variant="body1"><strong>Scheduled Repair Date:</strong> {selectedTicket.scheduledRepairDate || 'Not scheduled'}</Typography>
                <Typography variant="body1"><strong>Work Type:</strong> {selectedTicket.workType}</Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}><strong>Description:</strong> {selectedTicket.description}</Typography>
                {selectedTicket.imageBase64 && (
                  <img src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`} alt="Ticket" style={{ marginTop: '20px', maxWidth: '100%', height: 'auto' }} />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsModalOpen(false)} variant="contained" color="secondary">Close</Button>
              </DialogActions>
            </Box>
          </Modal>
        )}

       {/* Feedback Modal */}
      <Modal open={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)}>
        <Box sx={{ ...modalStyle, width: '400px' }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Feedback</Typography>
          {selectedTicket && selectedTicket.feedback && (
            <Typography sx={{ mb: 2 }}><strong>Staff Feedback:</strong> {selectedTicket.feedback}</Typography>
          )}
          {selectedTicket && selectedTicket.userFeedback && (
            <Typography sx={{ mb: 2 }}><strong>User Feedback:</strong> {selectedTicket.userFeedback}</Typography>
          )}
          {selectedTicket && selectedTicket.personnelFeedbacks && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Personnel Feedback:</strong></Typography>
              {Object.entries(selectedTicket.personnelFeedbacks).map(([personnel, feedback]) => (
                <Typography key={personnel} sx={{ mb: 1 }}>
                  <strong>{personnel}:</strong> {feedback}
                </Typography>
              ))}
            </>
          )}
          {(!selectedTicket?.feedback && !selectedTicket?.userFeedback && (!selectedTicket?.personnelFeedbacks || Object.keys(selectedTicket.personnelFeedbacks).length === 0)) && (
            <Typography>No feedback available for this ticket.</Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setFeedbackModalOpen(false)} variant="contained" color="primary">Close</Button>
          </Box>
        </Box>
      </Modal>

        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSuccessSnackbarOpen(false)}
          message="Ticket Terminated Successfully"
        />
      </Box>
    </>
  );
}
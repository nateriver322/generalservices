import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import { Box, Typography, Button, Modal, Snackbar,  } from '@mui/material';
import ViewDetailsModal from './ViewDetailsModal';
import CircularProgress from '@mui/material/CircularProgress';


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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchDoneTickets();
    }
  }, [navigate]);

  const fetchDoneTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://generalservicescontroller.onrender.com/api/tickets');
      if (response.status === 200) {
        const doneTix = response.data.filter(ticket => ticket.status === 'Resolved');
        setDoneTickets(doneTix);
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading
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
        const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/${ticketToDelete.id}`, {
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
      const response = await axios.post(`https://generalservicescontroller.onrender.com/api/tickets/${selectedTicket.id}/user-feedback`, { feedback });
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

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedTicket(null);
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
        
      {loading ? ( <Box sx={{ 
    position: 'fixed',  // This ensures it's positioned relative to the viewport
    top: '50%',         // Center vertically
    left: '50%',        // Center horizontally
    transform: 'translate(-50%, -50%)', // Offset the element by half its size
    zIndex: 1000        // Ensure it appears above other content
  }}>
    <CircularProgress />
  </Box>
      ) : (

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
                    <TableCell>Resolved Date</TableCell>
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
                      <TableCell>{ticket.resolvedDatetime || 'Not available'}</TableCell> 
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
         )}

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

<ViewDetailsModal
  open={detailsModalOpen}
  onClose={closeDetailsModal}
  ticket={selectedTicket}
/>


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
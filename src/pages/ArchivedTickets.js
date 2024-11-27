import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import { Box, Typography, Button, Modal, Snackbar } from '@mui/material';
import ViewDetailsModal from './ViewDetailsModal';
import CircularProgress from '@mui/material/CircularProgress';

export default function ArchivedTickets() {
  const navigate = useNavigate();
  const [archivedTickets, setArchivedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToUnarchive, setTicketToUnarchive] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [unarchiveModalOpen, setUnarchiveModalOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchArchivedTickets();
    }
  }, [navigate]);

  const fetchArchivedTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://generalservicescontroller-sq7n.onrender.com/api/tickets/archived');
      if (response.status === 200) {
        setArchivedTickets(response.data);
      } else {
        console.error('Failed to fetch archived tickets');
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

  const handleViewFeedback = (ticket) => {
    setSelectedTicket(ticket);
    setFeedbackModalOpen(true);
  };

  const handleUnarchive = (ticket) => {
    setTicketToUnarchive(ticket);
    setUnarchiveModalOpen(true);
  };

  const confirmUnarchive = async () => {
    if (ticketToUnarchive) {
      try {
        const response = await axios.post(
          `https://generalservicescontroller-sq7n.onrender.com/api/tickets/${ticketToUnarchive.id}/unarchive`
        );
        if (response.status === 200) {
          setArchivedTickets(archivedTickets.filter(ticket => ticket.id !== ticketToUnarchive.id));
          setUnarchiveModalOpen(false);
          setSuccessMessage('Ticket successfully unarchived');
          setSuccessSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while unarchiving the ticket.');
      }
    }
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

  return (
    <>
      <StaffAppBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
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
            {archivedTickets.length === 0 ? (
              <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>No archived tickets</Typography>
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
                    {archivedTickets.map((ticket, index) => (
                      <TableRow key={index}>
                        <TableCell>{ticket.id}</TableCell>
                        <TableCell>{ticket.status}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.username}</TableCell>
                        <TableCell>{ticket.datetime}</TableCell>
                        <TableCell>{ticket.assignedPersonnel || 'None'}</TableCell>
                        <TableCell>{ticket.scheduledRepairDate || 'Not scheduled'}</TableCell>
                        <TableCell>{ticket.resolvedDatetime || 'Not available'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button 
                              onClick={() => handleViewTicket(ticket)} 
                              variant="outlined" 
                              color="warning" 
                              sx={{ marginRight: 1, width: '120px', height: '60px' }}
                            >
                              View Details
                            </Button>
                            <Button 
                              onClick={() => handleViewFeedback(ticket)} 
                              variant="outlined" 
                              color="primary" 
                              sx={{ marginRight: 1, width: '120px', height: '60px' }}
                            >
                              View Feedback
                            </Button>
                            <Button 
                              onClick={() => handleUnarchive(ticket)} 
                              variant="contained" 
                              color="success" 
                              sx={{ width: '120px', height: '60px' }}
                            >
                              Unarchive
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
            {(!selectedTicket?.feedback && !selectedTicket?.userFeedback && 
              (!selectedTicket?.personnelFeedbacks || Object.keys(selectedTicket.personnelFeedbacks).length === 0)) && (
              <Typography>No feedback available for this ticket.</Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => setFeedbackModalOpen(false)} variant="contained" color="primary">
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Unarchive Confirmation Modal */}
        <Modal open={unarchiveModalOpen} onClose={() => setUnarchiveModalOpen(false)}>
          <Box sx={{ ...modalStyle }}>
            <Typography variant="h6">Confirm Unarchive</Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Are you sure you want to unarchive this ticket? It will be visible to users and personnel again.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={confirmUnarchive} variant="contained" color="success" sx={{ marginRight: 1 }}>
                Yes
              </Button>
              <Button onClick={() => setUnarchiveModalOpen(false)} variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        <Snackbar
          open={successSnackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSuccessSnackbarOpen(false)}
          message={successMessage}
        />
      </Box>
    </>
  );
}
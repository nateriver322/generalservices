import React, { useEffect, useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketAppBar from './TicketAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    Paper,
    IconButton,
} from '@mui/material';

const ArchivedTicketRow = memo(({ ticket, onViewDetails, onViewFeedback }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Archived': return 'gray';
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
        </Box>
      </TableCell>
    </TableRow>
  );
});

const ArchivedTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchArchivedTickets = useCallback(async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/user/${username}`);
      if (response.ok) {
        const data = await response.json();
        // Filter only archived tickets
        const archivedTickets = data.filter(ticket => 
          ticket.status === 'Archived' || ticket.status === 'Cancelled'
        );
        setTickets(archivedTickets);
      }
    } catch (error) {
      console.error('Error fetching archived tickets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchArchivedTickets(username);
    }
  }, [navigate, fetchArchivedTickets]);

  const handleBack = () => {
    navigate('/tickets');
  };

  return (
    <>
      <TicketAppBar />
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Header with back button */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3, 
            width: '100%',
            maxWidth: 1450,
            justifyContent: 'space-between'
          }}>
            <IconButton 
              onClick={handleBack}
              sx={{ mr: 2 }}
              aria-label="back to active tickets"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
              <Typography variant="h4" component="h2">
                Archived Tickets
              </Typography>
            </Box>
            <Box sx={{ width: 48 }} /> {/* Spacer to balance the back button */}
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
                  No archived tickets found.
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
                        <ArchivedTicketRow
                          key={ticket.id}
                          ticket={ticket}
                          onViewDetails={setSelectedTicket}
                          onViewFeedback={setFeedbackModalTicket}
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
          <DialogTitle>Archived Ticket Details</DialogTitle>
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

        {/* Feedback Dialog */}
        <Dialog open={Boolean(feedbackModalTicket)} onClose={() => setFeedbackModalTicket(null)} maxWidth="md" fullWidth>
          <DialogTitle>Ticket Feedback</DialogTitle>
          <DialogContent>
            {feedbackModalTicket?.feedback && (
              <Typography sx={{ mb: 2 }}><strong>Staff Feedback:</strong> {feedbackModalTicket.feedback}</Typography>
            )}
            {feedbackModalTicket?.userFeedback && (
              <Typography><strong>Your Feedback:</strong> {feedbackModalTicket.userFeedback}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFeedbackModalTicket(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ArchivedTickets;
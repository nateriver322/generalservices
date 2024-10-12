import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Modal, DialogTitle,
  DialogContent,
  DialogActions, } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function TicketsDone() {
  const navigate = useNavigate();
  const [doneTickets, setDoneTickets] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

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

  const confirmDeleteTicket = async () => {
    if (ticketToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/tickets/${ticketToDelete.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Update doneTickets by removing the deleted ticket
          setDoneTickets(doneTickets.filter(ticket => ticket.id !== ticketToDelete.id));
          closeDeleteModal();
        } else {
          alert('Failed to delete the ticket.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the ticket.');
      }
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

  const handleSort = (event) => {
    setSortBy(event.target.value);
    // Add sorting logic if needed
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  const closeDeleteModal = () => {
    setTicketToDelete(null);
};

  return (
    <>
      <StaffAppBar />
      <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px',
                    
                }}
            >
      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}
                >
        <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
        <Typography variant="h4" component="h2">
          JobTrack
        </Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 1450 }}>

      {doneTickets.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
              No tickets resolved
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
                <TableCell>Personnel Assigned</TableCell>
                <TableCell>Scheduled Repair Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doneTickets.map((ticket, index) => (
                <TableRow key={index}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell style={{ color: ticket.status === 'Resolved' ? 'green' : 'black' }}>
                    {ticket.status}
                  </TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>{ticket.username}</TableCell>
                  <TableCell>{ticket.datetime}</TableCell>
                  <TableCell>{ticket.assignedPersonnel || 'None'}</TableCell>
                  <TableCell>{ticket.scheduledRepairDate || 'Not scheduled'}</TableCell>
                  <TableCell>
                    <div className="button-group">
                      <Button
                        onClick={() => handleViewTicket(ticket)}
                        variant="outlined"
                        color="warning"
                        sx={{ marginRight: 1, width: '120px', height: '60px' }}
                      >
                        View Details
                      </Button>
                      <Button
                          onClick={() => setTicketToDelete(ticket)}
                          variant="contained"
                          color="error"
                          sx={{ width: '120px', height: '60px' }}
                        >
                          Terminate
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
          )}
        </Box>

        {ticketToDelete && (
  <Modal open={!!ticketToDelete} onClose={closeDeleteModal}>
    <Box sx={{ ...modalStyle }}>
      <Typography variant="h6">Confirm Termination</Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Are you sure you want to terminate this ticket?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={confirmDeleteTicket}
          variant="contained"
          color="error"
          sx={{ marginRight: 1 }}
        >
          Yes, Terminate
        </Button>
        <Button
          onClick={closeDeleteModal}
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
      </Box>
    </Box>
  </Modal>
)}

{detailsModalOpen && selectedTicket && (
  <Modal
    open={detailsModalOpen}
    onClose={() => setDetailsModalOpen(false)}
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} // Centers the modal
  >
    <Box sx={{ 
      ...modalStyle, 
      width: '80%',   // Adjust width (e.g., 80% of the screen width)
      maxWidth: '800px', // You can set a max-width for larger screens
        // Adjust height if there's an image
      maxHeight: '800px', // Set a max-height if you want to limit the size
    }}>
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
        
        {/* Display image if available */}
        {selectedTicket.imageBase64 && (
          <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
            <img
              src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`}
              alt="Uploaded Ticket"
              style={{  maxWidth: '700px', height: 'auto' }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDetailsModalOpen(false)}>Close</Button>
      </DialogActions>
    </Box>
  </Modal>
)}

       </Box>
       
    </>
  );
}

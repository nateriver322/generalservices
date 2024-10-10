import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Modal,
  Typography,
  Box,
  Select,
  Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from '@mui/material';


function TicketsCreated() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [personnelList, setPersonnelList] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState('');
  const [scheduledRepairDate, setScheduledRepairDate] = useState('');
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [assessModalOpen, setAssessModalOpen] = useState(false);
  const [staffFeedback, setStaffFeedback] = useState('');
  const [sortBy, setSortBy] = useState('id'); // Sorting criteria
  const [assessedModalOpen, setAssessedModalOpen] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchTickets();
      fetchPersonnel();
    }
  }, [navigate]);
  
  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tickets');
      if (response.ok) {
        const data = await response.json();
        // Filter tickets to include those with status "Pending" or "Ongoing"
        const ongoingAndPendingTickets = data.filter(ticket => 
          ticket.status === 'Pending' || ticket.status === 'Ongoing'
        );
        setTickets(ongoingAndPendingTickets);
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPersonnel = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/personnel');
      setPersonnelList(response.data);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setDetailsModalOpen(true);
  };

    const handleAssessTicket = (ticket) => {
        setSelectedTicket(ticket);
        setAssessModalOpen(true);
    };

    const closeFeedbackModal = () => {
        setFeedbackModalTicket(null);
        setFeedbackError('');
    };

    const handleStaffFeedbackSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/tickets/${selectedTicket.id}/staff-feedback`, {
                feedback: staffFeedback
            });
            if (response.status === 200) {
                setAssessModalOpen(false);
                setSuccessModalOpen(true);
                fetchTickets(); // Re-fetch tickets to update the state
            } else {
                alert('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback');
        }
    };
    
    const closeDetailsModal = () => {
        setDetailsModalOpen(false);
        setSelectedTicket(null);
    };

    const openDeleteModal = (ticket) => {
        setTicketToDelete(ticket);
    };

    const closeDeleteModal = () => {
        setTicketToDelete(null);
    };

    const openFeedbackModal = (ticket) => {
        setFeedbackModalTicket(ticket);
    };

  const confirmDeleteTicket = async () => {
    if (ticketToDelete) {
        try {
            const response = await fetch(`http://localhost:8080/api/tickets/${ticketToDelete.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setTickets(tickets.filter(ticket => ticket.id !== ticketToDelete.id));
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

  const handleStaffFeedbackSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/tickets/${selectedTicket.id}/staff-feedback`, {
        feedback: staffFeedback,
        status: 'Resolved' // Mark the status as Resolved
      });
      if (response.status === 200) {
        // Update the ticket's status in the local state
        setTickets(prevTickets => prevTickets.map(ticket =>
          ticket.id === selectedTicket.id
            ? { ...ticket, status: 'Resolved' }
            : ticket
        ));
        setAssessModalOpen(false); // Close the modal
        setAssessedModalOpen(true); // Show success modal
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
    }
  };

  const handleAssignPersonnel = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/tickets/assign', null, {
        params: {
          ticketId: selectedTicket.id,
          personnelUsername: selectedPersonnel,
          scheduledRepairDate: scheduledRepairDate,
        },
      });
      if (response.status === 200) {
        setAssignModalOpen(false);
        setSuccessModalOpen(true);
        fetchTickets();
      } else {
        alert('Failed to assign ticket');
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      alert('Error assigning ticket');
    }
  };

  const handleSort = (e) => {
    const selectedColumn = e.target.value;
    setSortBy(selectedColumn);
  };

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      } else if (sortBy === 'priority') {
        return a.priority.localeCompare(b.priority);
      } else if (sortBy === 'reportedBy') {
        return a.username.localeCompare(b.username);
      } else if (sortBy === 'dateCreated') {
        return new Date(a.datetime) - new Date(b.datetime);
      } else if (sortBy === 'personnelAssigned') {
        return (a.assignedPersonnel || '').localeCompare(b.assignedPersonnel || '');
      } else if (sortBy === 'scheduledRepairDate') {
        return new Date(a.scheduledRepairDate) - new Date(b.scheduledRepairDate);
      } else {
        return a.id - b.id;
      }
    });
  }, [tickets, sortBy]);

  // Function to determine the color based on status
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

  
const closeDeleteModal = () => {
    setTicketToDelete(null);
};

  // Modal style for centering and padding
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
    setSelectedTicket(ticket); // Set the selected ticket to assess
    setAssessModalOpen(true); // Open the assessment modal
  };

  return (
    <>
      <StaffAppBar/>
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
                    <Typography
                        variant="h4"
                        component="h2"
                    >
                        JobTrack
                    </Typography>
                </Box>

                <Box sx={{ width: '100%', maxWidth: 1450 }}>
                {sortedTickets.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
              No tickets submitted
            </Typography>
          ) : (
            <>
          <FormControl variant="outlined" sx={{ marginBottom: 2,  }}>
            <InputLabel htmlFor="sortBy">Sort By</InputLabel>
            <Select
              id="sortBy"
              value={sortBy}
              onChange={handleSort}
              label="Sort By"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="id">Ticket Number</MenuItem>
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="reportedBy">Reported By</MenuItem>
              <MenuItem value="dateCreated">Date Created</MenuItem>
              <MenuItem value="personnelAssigned">Personnel Assigned</MenuItem>
              <MenuItem value="scheduledRepairDate">Scheduled Repair Date</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ maxHeight: '520px', overflowY: 'auto', border: '1.5px solid #800000', borderRadius: '4px' }}>
                            <Table sx={{ margin: 0, padding: 0 }} >
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
                {sortedTickets.map((ticket, index) => (
                  <TableRow key={index}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell style={{ color: getStatusColor(ticket.status) }}>
                      {ticket.status}
                    </TableCell>
                    <TableCell>{ticket.priority}</TableCell>
                    <TableCell>{ticket.username}</TableCell>
                    <TableCell>{ticket.datetime}</TableCell>
                    <TableCell>{ticket.assignedPersonnel || 'None'}</TableCell>
                    <TableCell>{ticket.scheduledRepairDate || 'Not scheduled'}</TableCell>
                    <TableCell>
                      <div className="button-group">
                        {ticket.status !== 'Ongoing' && ticket.status !== 'Resolved' && (
                          <Button
                          onClick={() => handleAssignTicket(ticket)} // Show the assign modal
                          variant="outlined"
                          sx={{ marginRight: 1,  width: '120px', height: '60px' }}
                        >
                          Assign
                        </Button>
                        )}
                        {ticket.status !== 'Resolved' && (
                          <Button
                          onClick={() => handleAssessTicket(ticket)} // Show the assess modal
                          variant="outlined"
                          color="success" // Change color to "success"
                          sx={{ marginRight: 1,  width: '120px', height: '60px' }}
                        >
                          Assess
                        </Button>
                        )}
                        <Button
                          onClick={() => handleViewTicket(ticket)}
                          variant="outlined"
                          color="warning"
                          sx={{ marginRight: 1,  width: '120px', height: '60px' }}
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
          </>
           )}
          </Box>
          </Box>
          

          {/* Assign Personnel Modal */}
          {assignModalOpen && (
            <Modal open={assignModalOpen} onClose={() => setAssignModalOpen(false)}>
              <Box sx={{ ...modalStyle }}>
                <Typography variant="h6">Assign Personnel</Typography>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel htmlFor="personnel">Select Personnel</InputLabel>
                  <Select
                    value={selectedPersonnel}
                    onChange={(e) => setSelectedPersonnel(e.target.value)}
                  >
                    {personnelList.map((personnel) => (
                      <MenuItem key={personnel.id} value={personnel.username}>
                        {personnel.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Scheduled Repair Date"
                  type="date"
                  value={scheduledRepairDate}
                  onChange={(e) => setScheduledRepairDate(e.target.value)}
                  fullWidth             
                  sx={{ marginBottom: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
               
                <Button
                  onClick={handleAssignPersonnel}
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 1 }}
                >
                  Assign
                </Button>
                <Button
                  onClick={() => setAssignModalOpen(false)}
                  variant="outlined"
                  color="secondary"

                >
                  Cancel
                </Button>
           
              </Box>
            </Modal>
          )}

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

                    
          {/* Success Modal */}
          {successModalOpen && (
            <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
              <Box sx={{ ...modalStyle }}>
                <Typography variant="h6">Success</Typography>
                <Typography>The ticket was successfully assigned!</Typography>
                <Button onClick={() => setSuccessModalOpen(false)} color="primary">
                  Close
                </Button>
              </Box>
            </Modal>
          )}

{assessedModalOpen && (
  <Modal open={assessedModalOpen} onClose={() => setAssessedModalOpen(false)}>
    <Box sx={{ ...modalStyle }}>
      <Typography variant="h6">Success</Typography>
      <Typography>The ticket was successfully assessed!</Typography>
      <Button onClick={() => setAssessedModalOpen(false)} color="primary">
        Close
      </Button>
    </Box>
  </Modal>
)}



{assessModalOpen && selectedTicket && (
  <Modal
    open={assessModalOpen}
    onClose={() => setAssessModalOpen(false)} // Close modal on outside click
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: 500,
        backgroundColor: 'white',
        padding: '2rem',
        boxShadow: 24,
        borderRadius: '8px',
      }}
    >
      <Typography variant="h6" id="modal-modal-title">
        Assess Ticket {selectedTicket.id}
      </Typography>
      <Typography variant="body2" id="modal-modal-description" sx={{ marginBottom: 2 }}>
        Submitting feedback will mark the ticket as Resolved.
      </Typography>
      <TextField
        label="Staff Feedback"
        multiline
        rows={4}
        fullWidth
        value={staffFeedback}
        onChange={(e) => setStaffFeedback(e.target.value)}
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStaffFeedbackSubmit} // Handle the feedback submission
          sx={{
            marginRight: 1,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
          disabled={!staffFeedback}
        >
          Submit Feedback
        </Button>
        <Button
          onClick={() => setAssessModalOpen(false)} // Cancel button
          variant="outlined"
          color="secondary"
          
        >
          Cancel
        </Button>
      </Box>
    </div>
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
        <Typography variant="body1" sx={{ marginTop: 2 }}><strong>Description:</strong> {selectedTicket.description}</Typography>
        
        {/* Display image if available */}
        {selectedTicket.imageBase64 && (
          <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
            <img
              src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`}
              alt="Uploaded Ticket"
              style={{ maxWidth: '700px', height: 'auto' }}
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




    </>
  );
}

export default TicketsCreated;

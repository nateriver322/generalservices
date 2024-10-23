import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import qs from 'qs';
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Checkbox,
  ListItemText,
} from '@mui/material';

const TicketRow = React.memo(({ 
  ticket, 
  getStatusColor, 
  onAssign, 
  onAssess, 
  onViewFeedback, 
  onViewDetails, 
}) => (
<TableRow>
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
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {ticket.status !== 'Ongoing' && ticket.status !== 'Resolved' && (
        <Button
          onClick={() => onAssign(ticket)}
          variant="outlined"
          color="secondary"
          sx={{ marginRight: 1, width: '120px', height: '60px' }}
        >
          Assign
        </Button>
      )}
      {ticket.status !== 'Resolved' && (
        <Button
          onClick={() => onAssess(ticket)}
          variant="outlined"
          color="success"
          sx={{ marginRight: 1, width: '120px', height: '60px' }}
        >
          Resolve
        </Button>
      )}
      <Button 
        onClick={() => onViewFeedback(ticket)} 
        variant="outlined" 
        color="info" 
        sx={{ marginRight: 1, width: '120px', height: '60px' }}>
        View Feedback
      </Button>
      <Button
        onClick={() => onViewDetails(ticket)}
        variant="outlined"
        color="warning"
        sx={{ marginRight: 1, width: '120px', height: '60px' }}
      >
        View Details
      </Button>
      <Button
        onClick={() => onDelete(ticket)}
        variant="contained"
        color="error"
        sx={{ width: '120px', height: '60px' }}
      >
        Terminate
      </Button>
    </Box>
  </TableCell>
</TableRow>
));

const STATUS_COLORS = {
  'Resolved': 'green',
  'Ongoing': 'orange',
  'Pending': 'red',
  'Cancelled': 'red'
};

const MODAL_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
function TicketsCreated() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [personnelList, setPersonnelList] = useState([]);
  const [modals, setModals] = useState({
    assign: false,
    details: false,
    success: false,
    assess: false,
    assessed: false,
    feedback: false
  });
  const [selectedPersonnel, setSelectedPersonnel] = useState([]);
  const [scheduledRepairDate, setScheduledRepairDate] = useState('');
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [staffFeedback, setStaffFeedback] = useState('');
  const [sortBy, setSortBy] = useState('status');
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const username = sessionStorage.getItem('username');
  const [personnelWorkload, setPersonnelWorkload] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const [ticketsRes, personnelRes, workloadRes] = await Promise.all([
        fetch('https://generalservicescontroller.onrender.com/api/tickets'),
        axios.get('https://generalservicescontroller.onrender.com/user/personnel'),
        axios.get('https://generalservicescontroller.onrender.com/api/personnel/workload')
      ]);

      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        const filteredTickets = data.filter(ticket =>
          ticket.status === 'Pending' || ticket.status === 'Ongoing'
        );
        setTickets(filteredTickets);
      }

      setPersonnelList(personnelRes.data);
      setPersonnelWorkload(workloadRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);
 
    
  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [navigate, fetchData]);


  const fetchTickets = async () => {
    try {
      const response = await fetch('https://generalservicescontroller.onrender.com/api/tickets');
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

  const handleViewFeedback = (ticket) => {
    setSelectedTicket(ticket);
    setFeedbackModalOpen(true);
  };

  const fetchPersonnel = async () => {
    try {
      const response = await axios.get('https://generalservicescontroller.onrender.com/user/personnel');
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

  const fetchPersonnelWorkload = async () => {
    try {
      const response = await axios.get('https://generalservicescontroller.onrender.com/api/personnel/workload');
      setPersonnelWorkload(response.data);
    } catch (error) {
      console.error('Error fetching personnel workload:', error);
    }
  };
  const handleAssignTicket = (ticket) => {
    setSelectedTicket(ticket);
    setAssignModalOpen(true);
    const workTypes = ticket.workType.split(',');
    setFilteredPersonnel(personnelList.filter(personnel => workTypes.includes(personnel.subrole)));
    setSelectedPersonnel([]);
    fetchPersonnelWorkload(); // Fetch updated workload when opening the modal
  };
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedTicket(null);
  };

  const openDeleteModal = (ticket) => {
    setTicketToDelete(ticket);
  };

  const openFeedbackModal = (ticket) => {
    setFeedbackModalTicket(ticket);
  };

  const confirmDeleteTicket = async () => {
    if (ticketToDelete) {
      try {
        const response = await fetch(`https://generalservicescontroller.onrender.com/api/tickets/${ticketToDelete.id}`, {
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
      const response = await axios.post(`https://generalservicescontroller.onrender.com/api/tickets/${selectedTicket.id}/staff-feedback`, {
        feedback: staffFeedback,
        status: 'Resolved'
      });
      if (response.status === 200) {
        setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== selectedTicket.id));
        setAssessModalOpen(false);
        setAssessedModalOpen(true);
        setStaffFeedback(''); // Clear the feedback after successful submission
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
    }
  };

    const handleAssignPersonnel = useCallback(async () => {
    if (!selectedTicket?.id) return;
    
    try {
      const response = await axios.post('https://generalservicescontroller.onrender.com/api/tickets/assign', null, {
        params: {
          ticketId: selectedTicket.id,
          personnelUsernames: selectedPersonnel,
          scheduledRepairDate: scheduledRepairDate,
        },
        paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
      });
      
      if (response.status === 200) {
        setModals(prev => ({ ...prev, assign: false, success: true }));
        fetchData();
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  }, [selectedTicket, selectedPersonnel, scheduledRepairDate, fetchData]);


  const handleSort = (event) => {
    setSortBy(event.target.value);
  };

  const sortedTickets = useMemo(() => {
    const defaultSorted = [...tickets].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    
    if (sortBy === 'status') {
      const statusOrder = { 'Pending': 1, 'Ongoing': 2, 'Completed': 3 };
      return defaultSorted.sort((a, b) => (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999));
    }
    return sortBy === 'priority' 
      ? defaultSorted.sort((a, b) => a.priority.localeCompare(b.priority))
      : defaultSorted;
  }, [tickets, sortBy]);

  const getStatusColor = useCallback((status) => STATUS_COLORS[status] || 'black', []);
  

 



  const closeDeleteModal = () => {
    setTicketToDelete(null);
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setFilteredPersonnel([]);
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
       
        <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    }}
  >
    
    <Typography variant="h3" sx={{ fontSize: '20px', textAlign: 'center' }}>
      Welcome staff, {username}!
    </Typography>
  </Box>

  <Box sx={{ width: '100%', maxWidth: 1450 }}>
    {sortedTickets.length === 0 ? (
      <Typography variant="h6" align="center" sx={{ marginTop: 3 }}>
        No tickets submitted
      </Typography>
    ) : (
      <>
        {/* Sort By dropdown remains here, now below the Welcome message */}
        <FormControl variant="outlined" sx={{ marginBottom: 2 }}>
                <InputLabel htmlFor="sortBy">Sort By</InputLabel>
                <Select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSort}
                  label="Sort By"
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="status">Status</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                </Select>
              </FormControl>

        <Box sx={{ maxHeight: '520px', overflowY: 'auto', border: '1 .5px solid #800000', borderRadius: '4px' }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {ticket.status !== 'Ongoing' && ticket.status !== 'Resolved' && (
                        <Button
                          onClick={() => handleAssignTicket(ticket)}
                          variant="outlined"
                          color="secondary"
                          sx={{ marginRight: 1, width: '120px', height: '60px' }}
                        >
                          Assign
                        </Button>
                      )}
                      {ticket.status !== 'Resolved' && (
                        <Button
                          onClick={() => handleAssessTicket(ticket)}
                          variant="outlined"
                          color="success"
                          sx={{ marginRight: 1, width: '120px', height: '60px' }}
                        >
                          Resolve
                        </Button>
                      )}

                <Button 
                onClick={() => handleViewFeedback(ticket)} 
                variant="outlined" 
                color="info" 
                sx={{ marginRight: 1, width: '120px', height: '60px' }}>
                  View Feedback
                </Button>
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
                      </Box>
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

{assignModalOpen && (
        <Modal open={assignModalOpen} onClose={closeAssignModal}>
          <Box sx={{ ...modalStyle, width: '80%', maxWidth: 500 }}>
            <Typography variant="h6">Assign Personnel</Typography>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="multiple-personnel-label">Select Personnel</InputLabel>
              <Select
                labelId="multiple-personnel-label"
                multiple
                value={selectedPersonnel}
                onChange={(e) => setSelectedPersonnel(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {filteredPersonnel.map((personnel) => (
          <MenuItem key={personnel.id} value={personnel.username}>
            <Checkbox checked={selectedPersonnel.indexOf(personnel.username) > -1} />
            <ListItemText 
              primary={
                <Box display="flex" alignItems="center">
                  <Typography>{personnel.username}</Typography>
                  <Typography
                    component="span"
                    sx={{
                      marginLeft: 1,
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: 'maroon',
                      padding: '2px 6px',
                      borderRadius: '12px',
                      fontSize: '0.80rem'
                    }}
                  >
                    {personnelWorkload[personnel.username] || 0} tickets assigned
                  </Typography>
                </Box>
              }
            />
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
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssignPersonnel}
                disabled={selectedPersonnel.length === 0 || !scheduledRepairDate}
                sx={{
                  marginRight: 1,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Assign
              </Button>
              <Button
                onClick={closeAssignModal}
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
            <Typography>The ticket was successfully assessed !</Typography>
            <Button onClick={() => setAssessedModalOpen(false)} color="primary">
              Close
            </Button>
          </Box>
        </Modal>
      )}

{assessModalOpen && selectedTicket && (
        <Modal
          open={assessModalOpen}
          onClose={() => {
            setAssessModalOpen(false);
            setStaffFeedback('');
            setSelectedTicket(null);
          }}
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
  onChange={(e) => {
    const input = e.target.value;
    const wordCount = input.trim().split(/\s+/).length;

    if (wordCount <= 50) {
      setStaffFeedback(input);
    }
  }}
  variant="outlined"
  sx={{ marginBottom: 2 }}
/>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStaffFeedbackSubmit}
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
                onClick={() => {
                  setAssessModalOpen(false);
                  setStaffFeedback('');
                  setSelectedTicket(null);
                }}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
            </Box>
          </div>
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
          
          {selectedTicket && selectedTicket.personnelFeedbacks && Object.keys(selectedTicket.personnelFeedbacks).length > 0 && (
      <>
        <Typography variant="subtitle1" sx={{ mb: 1 }}><strong>Personnel Feedback/s:</strong></Typography>
        {Object.entries(selectedTicket.personnelFeedbacks).map(([personnel, feedback]) => (
          <Typography key={personnel} sx={{ mb: 1 }}>
            <strong>{personnel}:</strong> {feedback}
          </Typography>
        ))}
      </>
    )}

    {(!selectedTicket?.feedback && (!selectedTicket?.personnelFeedbacks || Object.keys(selectedTicket.personnelFeedbacks).length === 0)) && (
      <Typography>No feedback available for this ticket.</Typography>
    )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setFeedbackModalOpen(false)} variant="contained" color="primary">Close</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default React.memo(TicketsCreated);
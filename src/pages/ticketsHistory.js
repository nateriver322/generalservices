import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PersonnelResponsiveAppBar from './PersonnelResponsiveAppBar';
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
} from '@mui/material';

function TicketsHistory() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
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
        
        // Normalize the username for comparison
        const normalizedUsername = username.trim().toLowerCase();
        
        // Filter tickets to include those with status "Pending" or "Ongoing"
        // and where the current user is in the list of assigned personnel
        const ongoingAndPendingTickets = data.filter(ticket => {
          const personnelList = ticket.assignedPersonnel.split(',').map(personnel => personnel.trim().toLowerCase());
          return ticket.status === 'Resolved' && personnelList.includes(normalizedUsername);
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
              No ticket history available
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
                    <TableCell>Date Resolved</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket, index) => (
                    <TableRow key={index}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell style={{ color: getStatusColor(ticket.status) }}>{ticket.status}</TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                      <TableCell>{ticket.username}</TableCell>
                      <TableCell>{ticket.datetime}</TableCell>
                      <TableCell>{ticket.dateResolved || 'Not resolved'}</TableCell>
                      <TableCell>
                      <Button
                          onClick={() => handleViewTicket(ticket)}
                          variant="outlined"
                          color="warning"
                          sx={{ marginRight: 1,  width: '120px', height: '60px' }}
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
    </>
  );
}

export default TicketsHistory;

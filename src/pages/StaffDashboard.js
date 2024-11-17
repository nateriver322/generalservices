import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';

// Memoized row component to prevent unnecessary re-renders
const TicketRow = React.memo(({ ticket, onAssign, onResolve, onViewFeedback, onViewDetails, onTerminate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return '#4caf50';
      case 'Ongoing': return '#ff9800';
      case 'Pending': return '#f44336';
      case 'Cancelled': return '#f44336';
      default: return 'black';
    }
  };

  return (
    <TableRow>
      <TableCell>{ticket.id}</TableCell>
      <TableCell sx={{ color: getStatusColor(ticket.status) }}>{ticket.status}</TableCell>
      <TableCell>{ticket.priority}</TableCell>
      <TableCell>{ticket.username}</TableCell>
      <TableCell>{ticket.datetime}</TableCell>
      <TableCell>{ticket.assignedPersonnel || 'None'}</TableCell>
      <TableCell>{ticket.scheduledRepairDate || 'Not scheduled'}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {ticket.status !== 'Ongoing' && ticket.status !== 'Resolved' && (
            <Button 
              onClick={() => onAssign(ticket)}
              variant="outlined"
              color="secondary"
              sx={{ width: '120px', height: '60px' }}
            >
              Assign
            </Button>
          )}
          {ticket.status !== 'Resolved' && (
            <Button
              onClick={() => onResolve(ticket)}
              variant="outlined"
              color="success"
              sx={{ width: '120px', height: '60px' }}
            >
              Resolve
            </Button>
          )}
          <Button
            onClick={() => onViewFeedback(ticket)}
            variant="outlined"
            color="info"
            sx={{ width: '120px', height: '60px' }}
          >
            Feedback
          </Button>
          <Button
            onClick={() => onViewDetails(ticket)}
            variant="outlined"
            color="warning"
            sx={{ width: '120px', height: '60px' }}
          >
            Details
          </Button>
          <Button
            onClick={() => onTerminate(ticket)}
            variant="contained"
            color="error"
            sx={{ width: '120px', height: '60px' }}
          >
            Terminate
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
});

const TicketsCreated = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [sortBy, setSortBy] = useState('status');
  const [loading, setLoading] = useState(true);
  const username = sessionStorage.getItem('username');

  // Memoized fetch function
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://generalservicescontroller.onrender.com/api/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.filter(ticket => 
          ticket.status === 'Pending' || ticket.status === 'Ongoing'
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!username) {
      navigate('/');
    } else {
      fetchTickets();
    }
  }, [username, navigate, fetchTickets]);

  // Memoized sorted tickets
  const sortedTickets = useMemo(() => {
    const defaultSorted = [...tickets].sort((a, b) => 
      new Date(b.datetime) - new Date(a.datetime)
    );
    
    if (sortBy === 'status') {
      const statusOrder = { 'Pending': 1, 'Ongoing': 2, 'Completed': 3 };
      return defaultSorted.sort((a, b) => 
        (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999)
      );
    }
    if (sortBy === 'priority') {
      return defaultSorted.sort((a, b) => a.priority.localeCompare(b.priority));
    }
    return defaultSorted;
  }, [tickets, sortBy]);

  // Memoized handlers
  const handleSort = useCallback((event) => {
    setSortBy(event.target.value);
  }, []);

  if (loading) {
    return (
      <Box sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>
        Welcome staff, {username}!
      </Typography>

      <Box sx={{ maxWidth: '1450px', mx: 'auto' }}>
        {sortedTickets.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 3 }}>
            No tickets submitted
          </Typography>
        ) : (
          <>
            <FormControl sx={{ mb: 2 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSort}
                label="Sort By"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>

            <TableContainer sx={{ 
              maxHeight: '520px', 
              overflowY: 'auto',
              border: '1.5px solid #800000',
              borderRadius: '4px'
            }}>
              <Table>
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
                  {sortedTickets.map((ticket) => (
                    <TicketRow
                      key={ticket.id}
                      ticket={ticket}
                      onAssign={(t) => console.log('Assign:', t)}
                      onResolve={(t) => console.log('Resolve:', t)}
                      onViewFeedback={(t) => console.log('View Feedback:', t)}
                      onViewDetails={(t) => console.log('View Details:', t)}
                      onTerminate={(t) => console.log('Terminate:', t)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TicketsCreated;
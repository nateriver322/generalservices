import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import { Container } from '@mui/material';

const columns = [
  { width: 100, label: 'Ticket Number', dataKey: 'id' },
  { width: 100, label: 'Status', dataKey: 'status' },
  { width: 100, label: 'Priority', dataKey: 'priority' },
  { width: 150, label: 'Reported By', dataKey: 'username' },
  { width: 150, label: 'Date Created', dataKey: 'datetime' },
  { width: 150, label: 'Personnel Assigned', dataKey: 'assignedPersonnel' },
  { width: 100, label: 'Actions', dataKey: 'actions' },
];

function rowContent(_index, row, handleViewTicket) {
  return (
    <>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align="left" style={{ color: 'maroon' }}>
          {column.dataKey === 'actions' ? (
            <button onClick={() => handleViewTicket(row)}>View Details</button>
          ) : (
            row[column.dataKey] || 'N/A'
          )}
        </TableCell>
      ))}
    </>
  );
}

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

export default function TicketsDone() {
  const navigate = useNavigate();
  const [doneTickets, setDoneTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

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
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  return (
    <>
      <StaffAppBar />
      <h2 className="h2">General Services Portal</h2>
      <Container fixed sx={{ height: '90vh' }}>
        <Paper style={{ height: '70vh', width: '100%' }}>
          <TableVirtuoso
            data={doneTickets}
            components={VirtuosoTableComponents}
            fixedHeaderContent={() => (
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.dataKey} style={{ width: column.width }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            )}
            itemContent={(index, row) => rowContent(index, row, handleViewTicket)}
          />
        </Paper>

        {selectedTicket && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>Ticket Details</h2>
              <p><strong>Description:</strong> {selectedTicket.description}</p>
              <p><strong>Priority:</strong> {selectedTicket.priority}</p>
              <p><strong>Request Type:</strong> {selectedTicket.requestType}</p>
              <p><strong>Work Type:</strong> {selectedTicket.workType}</p>
              <p><strong>Location:</strong> {selectedTicket.location}</p>
              <p><strong>Date:</strong> {selectedTicket.datetime}</p>
              {selectedTicket.imageBase64 && (
                <img src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`} alt="Uploaded Ticket" style={{ width: '100%' }} />
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
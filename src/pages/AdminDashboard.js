import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// ConfirmationModal component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal">
    <div className="modal-content">
      <Typography variant="h6">{message}</Typography>
      <div className="modal-buttons">
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Confirm
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  </div>
);

// SavedModal component
const SavedModal = ({ message, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <Typography variant="h6">{message}</Typography>
      <div className="modal-buttons">
        <Button variant="contained" color="primary" onClick={onClose}>
          Ok
        </Button>
      </div>
    </div>
  </div>
);

// The custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://generalservicescontroller.onrender.com/user/accounts');
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleSearchClick = async () => {
    try {
      let response;
      if (searchUsername.trim() === '') {
        response = await axios.get('https://generalservicescontroller.onrender.com/user/accounts');
      } else {
        response = await axios.get(`https://generalservicescontroller.onrender.com/user/search?query=${searchUsername}`);
      }
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleLogoutButtonClick = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  const handleCreateAccountButtonClick = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleDeleteClick = (accountId) => {
    setCurrentAccount(accountId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`https://generalservicescontroller.onrender.com/user/${currentAccount}`);
      if (response.status === 200) {
        setAccounts(accounts.filter((account) => account.id !== currentAccount));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('Error deleting user');
    }
    setIsConfirmModalOpen(false);
  };

  const handleSearchChange = (e) => setSearchUsername(e.target.value);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Account Management
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <TextField
                label="Enter username"
                value={searchUsername}
                onChange={handleSearchChange}
                variant="outlined"
                fullWidth
              />
              <Button variant="contained" color="primary" onClick={handleSearchClick}>
                Search Account
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCreateAccountButtonClick}>
                Create Account
              </Button>
              <Button variant="outlined" onClick={handleLogoutButtonClick}>
                Logout
              </Button>
            </Box>

            <AccountTable accounts={accounts} onDeleteClick={handleDeleteClick} />

            {isConfirmModalOpen && (
              <ConfirmationModal
                message="Are you sure you want to delete this account?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsConfirmModalOpen(false)}
              />
            )}
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

// AccountTable component
const AccountTable = ({ accounts, onDeleteClick }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Contact No.</TableCell>
          <TableCell>Account Type</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell>{account.username}</TableCell>
            <TableCell>{account.email}</TableCell>
            <TableCell>{account.contactNumber}</TableCell>
            <TableCell>{account.role}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => console.log('Edit Account')}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => onDeleteClick(account.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default AccountManagement;

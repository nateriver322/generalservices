import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// Styles for modals
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// ConfirmationModal component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <Modal open={true} onClose={onCancel}>
      <Box sx={style}>
        <Typography variant="h6">{message}</Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Confirm
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// SavedModal component
const SavedModal = ({ message, onClose }) => {
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">{message}</Typography>
        <Button variant="contained" onClick={onClose}>Ok</Button>
      </Box>
    </Modal>
  );
};

// RegistrationModal component
const RegistrationModal = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    contactNumber: '',
    role: 'User',
  });
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.post('https://generalservicescontroller.onrender.com/user/register', formData);
      if (response.status === 201) {
        setIsSavedModalOpen(true);
        onRegister();
      } else {
        alert("Failed to register user");
      }
    } catch (error) {
      alert("Error registering user");
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">Register Account</Typography>
        <TextField label="Username" name="username" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Email" name="email" type="email" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Contact No." name="contactNumber" fullWidth margin="normal" onChange={handleChange} />
        <TextField
          select
          label="Account Type"
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {['User', 'PCO Staff', 'Personnel', 'Admin'].map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </TextField>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSaveClick}>Register</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
        {isSavedModalOpen && <SavedModal message="Account Registered Successfully" onClose={onClose} />}
      </Box>
    </Modal>
  );
};

// EditAccountModal component
const EditAccountModal = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...account });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    setFormData({ ...account });
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setIsFormChanged(true);
  };

  const handleSaveClick = () => {
    if (isFormChanged) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmSave = async () => {
    try {
      const response = await axios.put(`https://generalservicescontroller.onrender.com/user/${account.id}`, formData);
      if (response.status === 200) {
        setIsSavedModalOpen(true);
        onSave();
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      alert("Error updating user");
    }
    setIsConfirmModalOpen(false);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">Edit Account</Typography>
        <TextField label="Username" name="username" value={formData.username} fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Password" name="password" type="password" value={formData.password} fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Email" name="email" value={formData.email} fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Contact No." name="contactNumber" value={formData.contactNumber} fullWidth margin="normal" onChange={handleChange} />
        <TextField
          select
          label="Account Type"
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {['PCO Staff', 'User', 'Personnel', 'Admin'].map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </TextField>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSaveClick}>Save</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
        {isConfirmModalOpen && (
          <ConfirmationModal
            message="Save Changes?"
            onConfirm={handleConfirmSave}
            onCancel={() => setIsConfirmModalOpen(false)}
          />
        )}
        {isSavedModalOpen && <SavedModal message="Changes Saved" onClose={() => setIsSavedModalOpen(false)} />}
      </Box>
    </Modal>
  );
};

// AccountManagement component
const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleLogoutButtonClick = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  const handleCreateAccountButtonClick = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleEditClick = (account) => {
    setCurrentAccount(account);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (accountId) => {
    setCurrentAccount(accountId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`https://generalservicescontroller.onrender.com/user/${currentAccount}`);
      if (response.status === 204) {
        setAccounts(accounts.filter((account) => account.id !== currentAccount));
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
    }
    setIsConfirmModalOpen(false);
  };

  return (
    <div>
      <h1>Account Management</h1>
      <Button variant="contained" color="primary" onClick={handleCreateAccountButtonClick}>
        Create Account
      </Button>
      <TextField
        label="Search by Username"
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts
                .filter((account) => account.username.toLowerCase().includes(searchUsername.toLowerCase()))
                .map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.contactNumber}</TableCell>
                    <TableCell>{account.role}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleEditClick(account)}>Edit</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteClick(account.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isEditModalOpen && (
        <EditAccountModal
          account={currentAccount}
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => {
            setAccounts(accounts.map((acc) => (acc.id === currentAccount.id ? currentAccount : acc)));
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isRegistrationModalOpen && (
        <RegistrationModal
          onClose={() => setIsRegistrationModalOpen(false)}
          onRegister={() => fetchAccounts()} // Refresh the accounts after registration
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this account?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
      <Button variant="outlined" color="error" onClick={handleLogoutButtonClick}>Logout</Button>
    </div>
  );
};

export default AccountManagement;

import React, { useEffect, useState } from 'react';
import '../css/AccountManagement.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {
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
  Paper,
} from '@mui/material';

// ConfirmationModal component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <Modal open onClose={onCancel}>
      <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h6">{message}</Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" onClick={onConfirm}>Confirm</Button>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
};

// SavedModal component
const SavedModal = ({ message, onClose }) => {
  return (
    <Modal open onClose={onClose}>
      <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h6">{message}</Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={onClose}>Ok</Button>
        </Box>
      </Box>
    </Modal>
  );
};

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
        console.log("User registered successfully");
        setIsSavedModalOpen(true);
        onRegister(); // Refresh the account list
      } else {
        alert("Failed to register user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user");
    }
  };

  const handleSavedModalClose = () => {
    setIsSavedModalOpen(false);
    onClose();
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h6">Register Account</Typography>
        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField type="password" label="Password" name="password" value={formData.password} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField type="email" label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField label="Contact No." name="contactNumber" value={formData.contactNumber} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField select label="Account Type" name="role" value={formData.role} onChange={handleChange} fullWidth sx={{ mt: 2 }}>
          <option value="User">User</option>
          <option value="PCO Staff">PCO Staff</option>
          <option value="Personnel">Repair Personnel</option>
          <option value="Admin">Admin</option>
        </TextField>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" onClick={handleSaveClick}>Register</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
        {isSavedModalOpen && <SavedModal message="Account Registered Successfully" onClose={handleSavedModalClose} />}
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
    setIsFormChanged(false);
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
        console.log("User updated successfully");
        setIsSavedModalOpen(true);
        onSave(); // Refresh the account list
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    }
    setIsConfirmModalOpen(false);
    onClose();
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
  };

  const handleSavedModalClose = () => {
    setIsSavedModalOpen(false);
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h6">Edit Account</Typography>
        <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField type="password" label="Password" name="password" value={formData.password} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField type="email" label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField label="Contact No." name="contactNumber" value={formData.contactNumber} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        <TextField select label="Account Type" name="role" value={formData.role} onChange={handleChange} fullWidth sx={{ mt: 2 }}>
          <option value="Staff">PCO Staff</option>
          <option value="User">User</option>
          <option value="Personnel">Repair Personnel</option>
          <option value="Admin">Admin</option>
        </TextField>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" onClick={handleSaveClick}>Save</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </Box>
        {isConfirmModalOpen && <ConfirmationModal message="Save Changes?" onConfirm={handleConfirmSave} onCancel={handleCancelConfirm} />}
        {isSavedModalOpen && <SavedModal message="Changes Saved" onClose={handleSavedModalClose} />}
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
      console.log('No user data found, redirecting to login');
      navigate('/');
    } else {
      console.log(`Logged in as ${username}`);
      fetchAccounts();
    }
  }, [navigate]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('https://generalservicescontroller.onrender.com/user/getAll');
      setAccounts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setIsLoading(false);
    }
  };

  const handleEditClick = (account) => {
    setCurrentAccount(account);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (account) => {
    setCurrentAccount(account);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`https://generalservicescontroller.onrender.com/user/${currentAccount.id}`);
      if (response.status === 200) {
        console.log("User deleted successfully");
        fetchAccounts(); // Refresh account list
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
    setIsConfirmModalOpen(false);
  };

  const handleRegisterClick = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsRegistrationModalOpen(false);
  };

  return (
    <div className="account-management">
      <Typography variant="h4" sx={{ mb: 3 }}>Account Management</Typography>
      <TextField
        label="Search Username"
        variant="outlined"
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleRegisterClick} sx={{ mb: 2 }}>Register New Account</Button>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
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
              {accounts
                .filter(account => account.username.toLowerCase().includes(searchUsername.toLowerCase()))
                .map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.contactNumber}</TableCell>
                    <TableCell>{account.role}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleEditClick(account)}>Edit</Button>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteClick(account)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {isEditModalOpen && <EditAccountModal account={currentAccount} onClose={handleCloseModals} onSave={fetchAccounts} />}
      {isRegistrationModalOpen && <RegistrationModal onClose={handleCloseModals} onRegister={fetchAccounts} />}
      {isConfirmModalOpen && (
        <ConfirmationModal
          message={`Are you sure you want to delete ${currentAccount?.username}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AccountManagement;

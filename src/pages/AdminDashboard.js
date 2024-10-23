import React, { useEffect, useState } from 'react';
import '../css/AccountManagement.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material'; // Fixed CircularProgres typo

// ConfirmationModal component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{message}</h2>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// SavedModal component
const SavedModal = ({ message, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{message}</h2>
        <div className="modal-buttons">
          <button onClick={onClose}>Ok</button>
        </div>
      </div>
    </div>
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    setLoading(true); // Show loading spinner
    try {
      const response = await axios.post('https://generalservicescontroller.onrender.com/user/register', formData);
      if (response.status === 201) {
        console.log('User registered successfully');
        setIsSavedModalOpen(true); // Open the "Changes Saved" modal
        onRegister(); // Call onRegister to refresh the account list
      } else {
        console.error('Failed to register user');
        alert('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleSavedModalClose = () => {
    setIsSavedModalOpen(false);
    onClose(); // Close the registration modal
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Register Account</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact No.</label>
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="PCO Staff">PCO Staff</option>
              <option value="Personnel">Repair Personnel</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="modal-buttons">
            <button onClick={handleSaveClick}>Register</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
        {isSavedModalOpen && <SavedModal message="Account Registered Successfully" onClose={handleSavedModalClose} />}
      </div>
    </>
  );
};

// EditAccountModal component
const EditAccountModal = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...account });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFormChanged(false); // Reset form change detection
    setFormData({ ...account });
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setIsFormChanged(true); // Form has been changed
  };

  const handleSaveClick = () => {
    if (isFormChanged) {
      setIsConfirmModalOpen(true);
    } else {
      onClose(); // No changes, close modal
    }
  };

  const handleConfirmSave = async () => {
    setLoading(true); // Show loading spinner
    try {
      const response = await axios.put(`https://generalservicescontroller.onrender.com/user/${account.id}`, formData);
      if (response.status === 200) {
        console.log('User updated successfully');
        setIsSavedModalOpen(true); // Open the "Changes Saved" modal
        onSave(); // Call onSave to refresh the account list
      } else {
        console.error('Failed to update user');
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    } finally {
      setLoading(false); // Hide loading spinner
    }
    setIsConfirmModalOpen(false); // Close the confirmation modal
    onClose(); // Close the edit modal
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
  };

  const handleSavedModalClose = () => {
    setIsSavedModalOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Edit Account</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Contact No.</label>
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Staff">PCO Staff</option>
              <option value="User">User</option>
              <option value="Personnel">Repair Personnel</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="modal-buttons">
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
        {isConfirmModalOpen && (
          <ConfirmationModal message="Save Changes?" onConfirm={handleConfirmSave} onCancel={handleCancelConfirm} />
        )}
        {isSavedModalOpen && <SavedModal message="Changes Saved Successfully" onClose={handleSavedModalClose} />}
      </div>
    </>
  );
};

// AccountManagement component
const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('https://generalservicescontroller.onrender.com/user/all');
      setAccounts(response.data);
      setIsLoading(false); // Stop the loading spinner
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleRegisterClick = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationModalClose = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleRegister = () => {
    fetchAccounts(); // Refresh account list after registration
  };

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleSave = () => {
    fetchAccounts(); // Refresh account list after saving changes
  };

  const handleDeleteClick = async (accountId) => {
    try {
      const response = await axios.delete(`https://generalservicescontroller.onrender.com/user/${accountId}`);
      if (response.status === 200) {
        console.log('User deleted successfully');
        fetchAccounts(); // Refresh account list after deletion
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.contactNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="account-management">
      <h1>Account Management</h1>
      <div className="search-bar">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
      </div>
      <button className="register-btn" onClick={handleRegisterClick}>
        Register New Account
      </button>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Contact No.</th>
              <th>Account Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.contactNumber}</td>
                <td>{account.role}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(account)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(account.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isRegistrationModalOpen && (
        <RegistrationModal onClose={handleRegistrationModalClose} onRegister={handleRegister} />
      )}
      {isEditModalOpen && selectedAccount && (
        <EditAccountModal account={selectedAccount} onClose={handleEditModalClose} onSave={handleSave} />
      )}
    </div>
  );
};

export default AccountManagement;

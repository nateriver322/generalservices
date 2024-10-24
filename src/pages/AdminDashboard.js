import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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

const RegistrationModal = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    contactNumber: '',
    role: 'User'
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
        setIsSavedModalOpen(true); // Open the "Changes Saved" modal
        onRegister(); // Call onRegister to refresh the account list
      } else {
        console.error("Failed to register user");
        alert("Failed to register user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user");
    }
  };

  const handleSavedModalClose = () => {
    setIsSavedModalOpen(false);
    onClose(); // Close the registration modal
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Register Account</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Contact No.</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
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
        {isSavedModalOpen && (
          <SavedModal
            message="Account Registered Successfully"
            onClose={handleSavedModalClose}
          />
        )}
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
      // No changes, close modal
      onClose();
    }
  };

  const handleConfirmSave = async () => {
    try {
      const response = await axios.put(`https://generalservicescontroller.onrender.com/user/${account.id}`, formData);
      if (response.status === 200) {
        console.log("User updated successfully");
        setIsSavedModalOpen(true); // Open the "Changes Saved" modal
        onSave(); // Call onSave to refresh the account list
      } else {
        console.error("Failed to update user");
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
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

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Edit Account</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Contact No.</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
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
          <ConfirmationModal
            message="Save Changes?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelConfirm}
          />
        )}
        {isSavedModalOpen && (
          <SavedModal
            message="Changes Saved"
            onClose={handleSavedModalClose}
          />
        )}
      </div>
    </>
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
        setIsLoading(false); // Set loading to false after fetching
      }
    };
  

    fetchAccounts();
  }, []);

  const handleLogoutButtonClick = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole'); // Clear username from sessionStorage
    navigate('/'); // Redirect to login page
}

  const handleCreateAccountButtonClick = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleEditClick = (account) => {
    setCurrentAccount(account);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (accountId) => {
    setCurrentAccount(accountId); // Store current account ID to be deleted
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`https://generalservicescontroller.onrender.com/user/${currentAccount}`);
      if (response.status === 200) {
        setAccounts(accounts.filter(account => account.id !== currentAccount));
      } else {
        console.error('Failed to delete user');
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
    setIsConfirmModalOpen(false); // Close the confirmation modal
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false); // Close the confirmation modal
  };

  const handleSearchChange = (e) => {
    setSearchUsername(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      let response;
      if (searchUsername.trim() === '') {
        response = await axios.get('https://generalservicescontroller.onrender.com/user/accounts');
      } else {
        response = await axios.get(`https://generalservicescontroller.onrender.com/user/search?query=${searchUsername}`);
      }
      if (response.status === 200) {
        setAccounts(response.data);
      } else {
        console.error('Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentAccount(null);
  };

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleSaveAccountChanges = async () => {
    try {
      const response = await axios.get('https://generalservicescontroller.onrender.com/user/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleRegisterNewAccount = async () => {
    try {
      const response = await axios.get('https://generalservicescontroller.onrender.com/user/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  return (
    <div className="account-management">
      <LoginResponsiveAppBar /> {/* Add the staff bar at the top */}
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // Adjust this height based on your layout
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              marginTop: '30px',
            }}
          >
            <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
            <Typography variant="h4" component="h2">
              Account Management
            </Typography>
          </Box>
          <Box
            sx={{
              maxWidth: '600px', // Adjust the width as needed
              width: '100%',
              bgcolor: 'white',
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              margin: '0 auto',
              mt: 4,
              textAlign: 'center', // Center align content
            }}
          >
            <div className="search-create">
              <input
                type="text"
                placeholder="Enter username"
                value={searchUsername}
                onChange={handleSearchChange}
              />
              <button className="search-button" onClick={handleSearchClick}>Search Account</button>
              <button className="search-button" onClick={handleCreateAccountButtonClick}>Create Account</button>
              <button className="create-button" onClick={handleLogoutButtonClick}>Logout</button>
            </div>
          </Box>
          <AccountTable accounts={accounts} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
          {isEditModalOpen && (
            <EditAccountModal
              account={currentAccount}
              onClose={handleCloseEditModal}
              onSave={handleSaveAccountChanges}
            />
          )}
          {isRegistrationModalOpen && (
            <RegistrationModal
              onClose={handleCloseRegistrationModal}
              onRegister={handleRegisterNewAccount}
            />
          )}
          {isConfirmModalOpen && (
            <ConfirmationModal
              message="Are you sure you want to delete this account?"
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

// AccountTable component
const AccountTable = ({ accounts, onEditClick, onDeleteClick }) => {
  return (
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
        {accounts.map(account => (
          <AccountRow key={account.id} account={account} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
        ))}
      </tbody>
    </table>
  );
};

// AccountRow component
const AccountRow = ({ account, onEditClick, onDeleteClick }) => {
  return (
    <tr>
      <td>{account.username}</td>
      
      <td>{account.email}</td>
      <td>{account.contactNumber}</td>
      <td>{account.role}</td>
      <td>
        <button className="edit-button" onClick={() => onEditClick(account)}>Edit</button>
        <button className="delete-button" onClick={() => onDeleteClick(account.id)}>Delete</button>
      </td>
    </tr>
  );
};

export default AccountManagement;

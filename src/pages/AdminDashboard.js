import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AccountManagement.css';
import { Box, Button, Modal, CircularProgress } from '@mui/material';
import AdminResponsiveAppBar from './AdminResponsiveAppBar';


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
    role: 'User',
  });
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'email') {
      setEmailError(''); // Reset email error when the user modifies the email
    }
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://generalservicescontroller.onrender.com/user/register', formData);
      if (response.status === 201) {
        console.log("User registered successfully");
        setIsSavedModalOpen(true);
        onRegister();
      } else {
        console.error("Failed to register user");
        setErrorMessage('Failed to register user');
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response && error.response.status === 409) {
        setEmailError('This email is already registered.'); 
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        setIsErrorModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavedModalClose = () => {
    setIsSavedModalOpen(false);
    onClose();
  };

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Register Account</h2>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100px">
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                    style={{ borderColor: emailError ? 'red' : '' }}
                  />
                  {emailError && <p style={{ color: 'red' }}>{emailError}</p>} {/* Show error message */}
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
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal open={isSavedModalOpen} onClose={handleSavedModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2>Account Registered Successfully</h2>
          <Button
            onClick={handleSavedModalClose}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* Error Modal */}
      <Modal open={isErrorModalOpen} onClose={handleErrorModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2>Error</h2>
          <p>{errorMessage}</p>
          <Button
            onClick={handleErrorModalClose}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
        </Box>
      </Modal>
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
      onSave(formData);
      onClose();
    }
  };

  const handleConfirmSave = async () => {
    try {
      const response = await axios.put(`https://generalservicescontroller.onrender.com/user/${account.id}`, formData);
      if (response.status === 200) {
        console.log("User updated successfully");
        setIsSavedModalOpen(true); // Open the "Changes Saved" modal
        onSave({ ...formData, id: account.id }); // Call onSave to refresh the account list
      } else {
        console.error("Failed to update user");
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    }
    setIsConfirmModalOpen(false); // Close the confirmation modal
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
  };

  const handleSavedModalClose = () => {
    setIsSavedModalOpen(false);
    onClose();
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
  const [isSearching, setIsSearching] = useState(false); // New loading state for searching
  const [searchError, setSearchError] = useState(''); // New state for search error message
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);
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
        setIsLoading(false); // Set loading to false after fetching
      }
    };
  

    fetchAccounts();
  }, []);

  const handleLogoutButtonClick = () => {
    sessionStorage.removeItem('username'); // Clear username from sessionStorage
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
      setDeleteLoading(true);
      try {
        const response = await axios.delete(`https://generalservicescontroller.onrender.com/user/${currentAccount}`);
        if (response.status === 200) {
          setAccounts(accounts.filter(account => account.id !== currentAccount));
          setDeleteSuccessModalOpen(true);
        } else {
          console.error('Failed to delete user');
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      } finally {
        setDeleteLoading(false);
        setIsConfirmModalOpen(false);
      }
    };

    const handleCloseDeleteSuccessModal = () => {
      setDeleteSuccessModalOpen(false);
    };


  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false); // Close the confirmation modal
  };

  const handleSearchChange = (e) => {
    setSearchUsername(e.target.value);
    setSearchError('');
  };

  const handleSearchClick = async () => {
    setIsSearching(true); 
    setSearchError(''); 
    try {
      let response;
      if (searchUsername.trim() === '') {
        await fetchAccounts();
      } else {
        response = await axios.get(`https://generalservicescontroller.onrender.com/user/search?query=${searchUsername}`);
        if (response.data.length === 0) {
          setSearchError('Account does not exist.'); // Set error if no accounts found
        } else {
        setAccounts(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setSearchError('Error fetching accounts.')
    } finally {
      setIsSearching(false);
    }
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://generalservicescontroller.onrender.com/user/accounts');
      setAccounts(response.data); // Assuming setAccounts is in scope
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentAccount(null);
  };

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleSaveAccountChanges = (updatedAccount) => {
    if (!updatedAccount.id) {
      console.error("Error: updatedAccount.id is undefined");
      return;
    }
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) =>
        acc.id === updatedAccount.id ? updatedAccount : acc
      )
    );
    setIsEditModalOpen(false);
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
  <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}> 
    {/* Always show the AppBar */}
    <AdminResponsiveAppBar 
      searchUsername={searchUsername}
      handleSearchChange={handleSearchChange}
      handleSearchClick={handleSearchClick}
      handleCreateAccountButtonClick={handleCreateAccountButtonClick}
      handleLogoutButtonClick={handleLogoutButtonClick}
      isSearching={isSearching}
    />

    {isLoading ? (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    ) : (
      <>
        <AccountTable accounts={accounts} searchError={searchError} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
        {isEditModalOpen && (
          <EditAccountModal
            account={currentAccount}
            onClose={() => setIsEditModalOpen(false)}
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
              onCancel={() => setIsConfirmModalOpen(false)}
            />
          )}
     
    {/* Delete Success Modal */}
    <Modal 
            open={deleteSuccessModalOpen} 
            onClose={handleCloseDeleteSuccessModal}
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}>
              <h2>Account Successfully Deleted</h2>
              <Button 
                onClick={handleCloseDeleteSuccessModal}
                variant="contained"
                color="primary"
              >
                Close
              </Button>
            </Box>
          </Modal>

          {/* Loading overlay for delete operation */}
          {deleteLoading && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </>
      )}
    </div>
  );
};

// AccountTable component
const AccountTable = ({ accounts, searchError, onEditClick, onDeleteClick }) => {
  return (
    <div className="table-container">
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
        {searchError ? (
          <tr>
            <td colSpan="5" style={{textAlign: 'center', color: 'black'}}>
              {searchError}
            </td>
          </tr>
        ) : accounts.length > 0 ? (
            accounts.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No accounts available.
              </td>
            </tr>
          )}
      </tbody>
    </table>
    </div>
  );
};

// AccountRow component
const AccountRow = ({ account, onEditClick, onDeleteClick }) => {
  console.log('Rendering AccountRow:', account);
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

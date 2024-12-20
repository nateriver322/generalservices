import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AccountManagement.css';
import { Box, Button, Modal, CircularProgress, Typography} from '@mui/material';
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
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: value,
    });
  
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "", 
      });
    }
    if (name === "email") {
      setEmailError(""); // Reset email-specific error
    }
  };

  const handleSaveClick = async () => {
    // Field validations
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (formData.contactNumber.length !== 11) {
      newErrors.contactNumber = "Contact number must be exactly 11 digits.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Display errors
      return; // Stop the save process
    }
  
    setLoading(true);

    try {
      const response = await axios.post('https://generalservicescontroller-sq7n.onrender.com/user/register', formData);
      if (response.status === 201) {
        console.log("User registered successfully");
        setIsSavedModalOpen(true);
        onRegister();
      }
    } catch (error) {
      console.error("Error registering user:", error);
  
      if (error.response) {
        const errorMsg = error.response.data;
  
        if (errorMsg === "Username already exists") {
          setErrors({
            ...errors,
            username: "Username already exists",
          });
        } else if (errorMsg === "Invalid contact number format") {
          setErrors({
            ...errors,
            contactNumber: "Contact number must be 11 digits",
          });
        } else {
          setErrorMessage(errorMsg || "An error occurred while registering the account");
          setIsErrorModalOpen(true);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
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
                    style={{ borderColor: errors.username ? 'red' : '' }}
                  />
                  {errors.username && (
                    <div
                      className="error-popup"
                    >
                      {errors.username}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ borderColor: errors.password ? 'red' : '' }}
                  />
                  {errors.password && (
                    <div
                      className="error-popup"
                    >
                      {errors.password}
                    </div>
                  )}
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
                    required
                    style={{ borderColor: errors.email ? 'red' : '' }}
                  />
                  {errors.email && (
                <div
                  className="error-popup"
                >
                  {errors.email}
                </div>
              )}
                </div>
                <div className="form-group">
                  <label>Contact No.</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    maxLength={11}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    style={{ borderColor: errors.contactNumber ? 'red' : '' }}
                  />
                  {errors.contactNumber && (
                <div
                  className="error-popup"
                >
                  {errors.contactNumber}
                </div>
              )}
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
            sx={{
              backgroundColor: 'red',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
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
            sx={{
              backgroundColor: 'red',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
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
  const [errors, setErrors] = useState({});
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFormChanged(false);
    setFormData({ ...account });
    setErrors({});
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setIsFormChanged(true);
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSaveClick = () => {
    if (isFormChanged) {
      setIsConfirmModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmSave = async () => {
    setIsConfirmModalOpen(false); 
    setLoading(true); 
    try {
      console.log("Sending data to backend:", formData);
      const response = await axios.put(
        `https://generalservicescontroller-sq7n.onrender.com/user/${account.id}`,
        formData
      );
      if (response.status === 200) {
        console.log('User updated successfully');
        setIsSavedModalOpen(true); // Open "Changes Saved" modal
        onSave({ ...formData, id: account.id });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response) {
        const errorMsg = error.response.data;
        if (errorMsg === 'Username already exists') {
          setErrors({
            ...errors,
            username: 'Username already exists',
          });
        } else if (errorMsg === 'Invalid contact number format') {
          setErrors({
            ...errors,
            contactNumber: 'Contact number must be exactly 11 digits',
          });
        } else {
          setErrorMessage(errorMsg || 'An error occurred while updating the account');
          setIsErrorModalOpen(true);
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        setIsErrorModalOpen(true);
      }
    }
    setLoading(false);
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalOpen(false);
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
          <h2>Edit Account</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={{ borderColor: errors.username ? 'red' : '' }}
              />
              {errors.username && (
                <div
                  className="error-popup"
                >
                  {errors.username}
                </div>
              )}
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
                readOnly
                style={{ backgroundColor: '#f0f0f0' }}
              />
            </div>
            <div className="form-group">
              <label>Contact No.</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                maxLength={11}
                inputMode="numeric"
                pattern="[0-9]*"
                style={{ borderColor: errors.contactNumber ? 'red' : '' }}
            
              />
              {errors.contactNumber && (
                <p
                  className="error-popup"
                >
                  {errors.contactNumber}
                </p>
              )}
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

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <ConfirmationModal
            message="Save Changes?"
            onConfirm={handleConfirmSave}
            onCancel={handleCancelConfirm}
          />
        )}

        {loading && (
          <div className="loading-spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
            <CircularProgress />
          </div>
        )}

        {/* Success Modal */}
        <Modal open={isSavedModalOpen} onClose={() => {}}>
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
            <h2>Changes Saved Successfully</h2>
          </Box>
        </Modal>;

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
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
        const response = await axios.get('https://generalservicescontroller-sq7n.onrender.com/user/accounts');
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };
  

    fetchAccounts();
  }, []);

  const handleLogoutButtonClick = async () => {
    setIsLoggingOut(true);
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
      sessionStorage.removeItem('username');
      navigate('/'); // Redirect to login
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };
  

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
        const response = await axios.delete(`https://generalservicescontroller-sq7n.onrender.com/user/${currentAccount}`);
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

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchUsername(value);

    if (!value.trim()) {
      setIsSearching(true);
      await fetchAccounts();
      setIsSearching(false);
    }
    setSearchError('');
  };

  const handleSearchClick = async () => {
    if (!searchUsername.trim()) {
      setIsSearching(true);
      await fetchAccounts();
      setIsSearching(false);
      return;
    }
  
    setIsSearching(true);
    setSearchError('');
    try {
      const response = await axios.get(`https://generalservicescontroller-sq7n.onrender.com/user/search?query=${searchUsername}`);
      if (response.data.length === 0) {
        setSearchError('Account does not exist.');
        setAccounts([]);
      } else {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setSearchError('Error fetching accounts.');
    } finally {
      setIsSearching(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      // Changed from /user to /user/accounts to match your working endpoint
      const response = await axios.get('https://generalservicescontroller-sq7n.onrender.com/user/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };
  

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentAccount(null);
  };

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleSaveAccountChanges = async (updatedAccount) => {
    if (!updatedAccount.id) {
      console.error("Error: updatedAccount.id is undefined");
      return;
    }
    
    try {
      const response = await axios.put(
        `https://generalservicescontroller-sq7n.onrender.com/user/${updatedAccount.id}`,
        updatedAccount
      );
      if (response.status === 200) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((acc) =>
            acc.id === updatedAccount.id ? updatedAccount : acc
          )
        );
        setIsSavedModalOpen(true); // Open the SavedModal
      }
    } catch (error) {
      console.error("Error saving account changes:", error);
      alert("Failed to save account changes.");
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleCloseSavedModal = () => {
    setIsSavedModalOpen(false);
  };


  const handleRegisterNewAccount = async () => {
    try {
      const response = await axios.get('https://generalservicescontroller-sq7n.onrender.com/user/accounts');
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
        <AccountTable accounts={accounts} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} searchError={searchError}/>
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
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'darkred',
                  },
                }}
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

           {/* Logging out overlay */}
           {isLoggingOut && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                color: 'white',
              }}
            >
              <CircularProgress color="info" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Logging out...
              </Typography>
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
              <td colSpan="5" style={{ textAlign: 'center', color: 'gray' }}>
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

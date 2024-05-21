import React, { useEffect, useState } from 'react';
import '../css/AccountManagement.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.put(`http://localhost:8080/user/${account.id}`, formData);
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
                type="text"
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // New state for confirmation modal
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      console.log('No user data found, redirecting to login');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/accounts');
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleLogoutButtonClick = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleCreateAccountButtonClick = () => {
    localStorage.removeItem('username');
    navigate('/register');
  };

  const handleEditClick = (account) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (accountId) => {
    setCurrentAccount(accountId); // Store current account ID to be deleted
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/user/${currentAccount}`);
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
    if (searchUsername.trim() === '') {
      const response = await axios.get('http://localhost:8080/user/accounts');
      setAccounts(response.data);
    } else {
      try {
        const response = await axios.get(`http://localhost:8080/user/${searchUsername}`);
        if (response.status === 200) {
          setAccounts([response.data]);
        } else {
          alert('User not found');
        }
      } catch (error) {
        console.error('Error searching for user:', error);
        alert('Error searching for user');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
  };

  const handleSaveAccountChanges = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  return (
    <div className="account-management">
      <div className="header1">
        <h1>Account Management</h1>
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
      </div>
      <AccountTable accounts={accounts} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
      {isModalOpen && (
        <EditAccountModal
          account={currentAccount}
          onClose={handleCloseModal}
          onSave={handleSaveAccountChanges}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this account?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
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
          <th>Password</th>
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
      <td>{account.password}</td>
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

import React, { useEffect, useState } from 'react';
import '../css/AccountManagement.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      console.log('No user data found, redirecting to login');
      navigate('/'); // Adjust this if your login route is different
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

  const handleDeleteClick = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/user/${accountId}`);
        if (response.status === 200) {
          alert('User deleted successfully');
          setAccounts(accounts.filter(account => account.id !== accountId));
        } else {
          console.error('Failed to delete user');
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
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
          onSave={() => {
            setIsModalOpen(false);
            const fetchAccounts = async () => {
              try {
                const response = await axios.get('http://localhost:8080/user/accounts');
                setAccounts(response.data);
              } catch (error) {
                console.error('Error fetching accounts:', error);
              }
            };
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
};

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

const EditAccountModal = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...account });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/user/${account.id}`, formData);
      if (response.status === 200) {
        console.log("User updated successfully");
        alert("User updated successfully");
        onSave(); // Call onSave to refresh the account list
      } else {
        console.error("Failed to update user");
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    }
    onClose();
  };

  return (
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
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;

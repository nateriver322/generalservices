import React, { useEffect, useState } from 'react';
import '../css/AccountManagement.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
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

  return (
    <div className="account-management">
      <div className="header1">
        <h1>Account Management</h1>
        <div className="search-create">
          <input 
            type="text" 
            placeholder="Enter username"
          />
          <button className="search-button">Search Account</button>
          <button className="search-button">Create Account</button>
          <button className="create-button" onClick={handleLogoutButtonClick}>Logout</button>
        </div>
      </div>
      <AccountTable accounts={accounts} />
    </div>
  );
};

const AccountTable = ({ accounts }) => {
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
          <AccountRow key={account.id} account={account} />
        ))}
      </tbody>
    </table>
  );
};

const AccountRow = ({ account }) => {
  return (
    <tr>
      <td>{account.username}</td>
      <td>{account.password}</td>
      <td>{account.email}</td>
      <td>{account.contactNumber}</td>
      <td>{account.role}</td>
      <td>
        <button className="edit-button">Edit</button>
        <button className="delete-button">Delete</button>
      </td>
    </tr>
  );
};

export default AccountManagement;

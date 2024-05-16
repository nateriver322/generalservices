import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
          const response = await axios.get(`http://localhost:8080/user/${username}`);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/user/login', { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('username', userData.username);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Login failed');
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

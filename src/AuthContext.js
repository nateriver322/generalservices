import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";

// MSAL configuration (replace with your own values)
const msalConfig = {
  auth: {
    clientId: "d2a969c7-b63d-4c95-9d1c-2bcaf8b09034", // from Azure
    authority: "https://login.microsoftonline.com/823cde44-4433-456d-b801-bdf0ab3d41fc", // or "common" if multitenant
    redirectUri: "https://generalservices.vercel.app/", // Ensure this matches Azure setup
  },
  cache: {
    cacheLocation: "sessionStorage", // You can use localStorage or sessionStorage
    storeAuthStateInCookie: false,
  }
};

// Initialize msalInstance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize the PublicClientApplication instance
await msalInstance.initialize();

// Handle redirect promise
msalInstance.handleRedirectPromise().then((response) => {
  if (response) {
    console.log("Redirect promise resolved:", response);
  }
}).catch((error) => {
  console.error("Error handling redirect promise:", error);
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const username = sessionStorage.getItem('username');
      const userRole = sessionStorage.getItem('userRole');
      if (username) {
        try {
          const response = await fetch(`https://generalservicescontroller.onrender.com/user/${username}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          sessionStorage.removeItem('username');
          sessionStorage.removeItem('userRole');
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://generalservicescontroller.onrender.com/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        if (errorData === "Please use Microsoft login for this account") {
          // Handle Microsoft account login
          throw new Error("This is a Microsoft account. Please use Microsoft login.");
        } else {
          throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }
      }
      
      const userData = await response.json();
      setUser(userData);
      sessionStorage.setItem('username', userData.username);
      sessionStorage.setItem('userRole', userData.role);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const microsoftLogin = async () => {
    try {
      // Check if there are any accounts in MSAL
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length > 0) {
        // If there are already accounts, set the active account
        msalInstance.setActiveAccount(accounts[0]);
        console.log('Using existing account:', accounts[0]);
      } else {
        // Log in using the popup
        console.log("Starting Microsoft login via popup...");
        const response = await msalInstance.loginPopup({
          scopes: ["User.Read"],  // Ensure your scopes are set here
        });
        msalInstance.setActiveAccount(response.account);
        console.log('Logged in with new account:', response.account);
      }

      // After login, attempt to silently acquire a token
      console.log("Acquiring token silently...");
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: msalInstance.getActiveAccount(),
      }).catch(async (error) => {
        console.error("Silent token acquisition failed, falling back to popup.", error);
        return await msalInstance.acquireTokenPopup({
          scopes: ["User.Read"],
        });
      });

      const token = tokenResponse.accessToken;

      // Send the token to the backend for authentication
      const apiResponse = await fetch('https://generalservicescontroller.onrender.com/user/microsoft-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const responseText = await apiResponse.text();
      console.log('Response body:', responseText);

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}, body: ${responseText}`);
      }

      const userData = JSON.parse(responseText);
      setUser(userData);
      localStorage.setItem('username', userData.username);
      return userData;

    } catch (error) {
      console.error('Microsoft login error:', error);
      throw new Error('Microsoft login failed: ' + error.message);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, login, microsoftLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
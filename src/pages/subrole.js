import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Select, MenuItem, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import StaffAppBar from './StaffAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useNavigate } from 'react-router-dom';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [personnel, setPersonnel] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [subrole, setSubrole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Add this
    const username = sessionStorage.getItem('username');

    // Combine both users and personnel into one list
    const combinedUsers = [...users, ...personnel.map(person => ({ ...person, isPersonnel: true }))];
    

    useEffect(() => {
        if (!username) {
            console.log('No authenticated user found, redirecting to login');
            sessionStorage.clear();
            localStorage.clear();
            navigate('/');
        }
    }, [navigate, username]);


    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError(null);
          }, 1500); // 5000 milliseconds = 5 seconds
          return () => clearTimeout(timer);
        }
      }, [error]);
    
      // Automatically clear successMessage after 5 seconds
      useEffect(() => {
        if (successMessage) {
          const timer = setTimeout(() => {
            setSuccessMessage(null);
          }, 1500);
          return () => clearTimeout(timer);
        }
      }, [successMessage]);
    


    // Define the fetchData function to fetch both users and personnel data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [usersResponse, personnelResponse] = await Promise.all([
                axios.get('https://generalservicescontroller.onrender.com/user/users?role=User'),
                axios.get('https://generalservicescontroller.onrender.com/user/personnel')
            ]);

            setUsers(usersResponse.data);
            setPersonnel(personnelResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch users and personnel. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data when component mounts
    }, []);  // Empty dependency array to run this only once on component mount

    const handleUpgradeToPersonnel = async (userId) => {
        try {
            setLoading(true);
            setError(null);
            setSuccessMessage('');

            // Upgrade the user to Personnel
            await axios.put(`https://generalservicescontroller.onrender.com/user/${userId}`, { role: 'Personnel' });

            // After upgrading, find the user and move it to the 'personnel' list
            const upgradedUser = users.find(user => user.id === userId);
            setUsers(users.filter(user => user.id !== userId)); // Remove user from 'users' list
            setPersonnel(prevPersonnel => [...prevPersonnel, upgradedUser]); // Add user to 'personnel' list

            setSuccessMessage('User upgraded to Personnel successfully');
        } catch (err) {
            console.error('Error upgrading user:', err);
            setError('Failed to upgrade user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignSubrole = async (event) => {
        event.preventDefault();
        if (!selectedUser || !subrole) return;

        try {
            setLoading(true);
            setError(null);
            setSuccessMessage('');
            await axios.put(`https://generalservicescontroller.onrender.com/user/${selectedUser}/subrole?subrole=${subrole}`);
            setSuccessMessage('Subrole assigned successfully');
            setSelectedUser(null);
            setSubrole('');
            fetchData();  
        } catch (err) {
            console.error('Error assigning subrole:', err);
            setError('Failed to assign subrole. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StaffAppBar />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: { xs: '20px', sm: '30px' } }}>
                {loading ? (
                    <Box sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000
                    }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
   
   <Box 
                sx={{ 
                    width: '100%', 
                    maxWidth: 850, 
                    height: '30px', 
                    marginBottom: '16px',
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                        {error}
                    </Alert>
                )}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 1 }}>
                        {successMessage}
                    </Alert>
                )}
            </Box>

    <Box sx={{ width: '100%', maxWidth: 1450 }}>
        <Box 
            sx={{ 
                maxWidth: 850, 
                margin: 'auto', 
                mt: { xs: 2, sm: 4 },
                overflowX: 'auto',  // Allow horizontal scrolling if content overflows
            }}>
            <Typography variant="h5">
                Account Management
            </Typography>
            <Box
                sx={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1.5px solid #800000',
                    borderRadius: '4px',
                    margin: 0,          // Removing margins
                    padding: 0,          // Removing padding
                }}
            >
                <Table sx={{ margin: 0, padding: 0 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Subrole</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {combinedUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.subrole || '-'}</TableCell>
                                <TableCell>
                                    {!user.isPersonnel && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleUpgradeToPersonnel(user.id)}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            Upgrade to Personnel
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    </Box>



            <Typography variant="h5" gutterBottom sx={{ mt: 2 }} >
                Assign Subrole to Personnel
            </Typography>
        <form onSubmit={handleAssignSubrole}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',  // Stack items vertically
                    gap: 2,  // Adds space between the elements
                    alignItems: 'center',  // Aligns items to center
                    }}
    >
                <Select
                    value={selectedUser || ''}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    fullWidth={false}
                    sx={{ width: '300px'}}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select a personnel</MenuItem>
                    {personnel.map(user => (
                        <MenuItem key={user.id} value={user.id}
                        sx={{
                            width: '300px',  // Consistent width for options
                        }}
                        >
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    value={subrole}
                    onChange={(e) => setSubrole(e.target.value)}
                    fullWidth={false}
                    sx={{ width: '300px'}}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select a subrole</MenuItem>
                    <MenuItem value="Plumbing" sx={{ width: '300px' }}>Plumbing</MenuItem>
                    <MenuItem value="Carpentry/Masonry/Steel Works" sx={{ width: '300px' }}>Carpentry/Masonry/Steel Works</MenuItem>
                    <MenuItem value="Electrical" sx={{ width: '300px' }}>Electrical</MenuItem>
                    <MenuItem value="Electro-Mechanical" sx={{ width: '300px' }}>Electro-Mechanical</MenuItem>
                </Select>

                <Button type="submit" variant="contained" color="primary" disabled={!selectedUser || !subrole || loading}>
                    Assign Subrole
                </Button>
            </Box>
        </form>
        </>
           )}
    </Box>
     
        </>
    );
}

export default UserManagement;
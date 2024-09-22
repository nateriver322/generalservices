import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import TicketAppBar from './TicketAppBar';

function TicketForm() {
    const navigate = useNavigate();
    const [fileLabel, setFileLabel] = useState('No file chosen');

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        }
    }, [navigate]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const now = new Date();
        const currentDateTime = now.toISOString();
        formData.append('datetime', currentDateTime);
        formData.append('username', localStorage.getItem('username'));

        try {
            const response = await fetch('http://localhost:8080/api/tickets', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                navigate('/SuccessTicket');
            } else {
                const errorMsg = await response.text();
                alert(`Submission failed: ${errorMsg}`);
            }
        } catch (error) {
            alert(`Error submitting the ticket: ${error.message}`);
        }
    };

    const handleFileChange = (event) => {
        const fileName = event.target.files[0] ? event.target.files[0].name : 'No file chosen';
        setFileLabel(fileName);
    };

    return (
        <>
            <TicketAppBar />
            <Typography variant="h4" component="h2" sx={{ textAlign: 'center', margin: '20px 0' }}>
                General Services Portal
            </Typography>
            <Box
                component="form"
                onSubmit={handleFormSubmit}
                sx={{
                    maxWidth: '600px',
                    width: '100%',
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    margin: '0 auto'
                }}
                encType="multipart/form-data"
            >
                <Typography variant="h5" component="h3" gutterBottom>
                    Submit a Request
                </Typography>

                <TextField
                    select
                    label="Select Priority"
                    name="priority"
                    required
                    fullWidth
                    margin="normal"
                    defaultValue=""
                    SelectProps={{
                        native: true,
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'black', // Default border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000', // Border color when focused
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Label color when focused
                        },
                    }}
                >
                    <option value="" disabled>Select Priority</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Non-Emergency">Non-Emergency</option>
                </TextField>

                <TextField
                    select
                    label="Select Work Type"
                    name="workType"
                    required
                    fullWidth
                    margin="normal"
                    defaultValue=""
                    SelectProps={{
                        native: true,
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'black', // Default border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000', // Border color when focused
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Label color when focused
                        },
                    }}
                >
                    <option value="" disabled>Select Work Type</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Carpentry/Masonry/Steel Works">Carpentry/Masonry/Steel Works</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Electro-Mech">Electro-Mechanical</option>
                </TextField>

                <TextField
                    select
                    label="Select Type of Request"
                    name="requestType"
                    required
                    fullWidth
                    margin="normal"
                    defaultValue=""
                    SelectProps={{
                        native: true,
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'black', // Default border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000', // Border color when focused
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Label color when focused
                        },
                    }}
                >
                    <option value="" disabled>Select Type of Request</option>
                    <option value="Repair/Maintenance">Repair/Maintenance</option>
                    <option value="Installation">Installation</option>
                </TextField>

                <TextField
                    label="Location"
                    name="location"
                    required
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'black', // Default border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000', // Border color when focused
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Label color when focused
                        },
                    }}
                />

                <TextField
                    label="Details of the Request"
                    name="description"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'black', // Default border color
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000', // Border color when focused
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Label color when focused
                        },
                    }}
                />

                <div className="file-upload">
                    <input
                        type="file"
                        name="image"
                        id="imageInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="imageInput">
                        <Button
                            variant="outlined"
                            component="span"
                            sx={{
                                borderColor: '#800000',
                                color: '#800000',
                                '&:hover': {
                                    borderColor: '#922B21',
                                    color: '#922B21',
                                },
                            }}
                        >
                            Choose File
                        </Button>
                    </label>
                    <span style={{ marginLeft: '10px' }}>{fileLabel}</span>
                </div>

                <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#800000', color: '#ffffff', '&:hover': { bgcolor: '#922B21' } }} fullWidth>
                    Submit
                </Button>
            </Box>
        </>
    );
}

export default TicketForm;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import TicketAppBar from './TicketAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

function TicketForm() {
    const navigate = useNavigate();
    const [fileLabel, setFileLabel] = useState('No file chosen');
    const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
    const [showWorkTypeDropdown, setShowWorkTypeDropdown] = useState(false);

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
        
        // Join the selected work types as a comma-separated string
        formData.append("workType", selectedWorkTypes.join(",")); 

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
        const file = event.target.files[0];
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB
            if (fileSizeMB > 10) {
                alert("File size exceeds 10MB limit. Please choose a smaller file.");
                setFileLabel('No file chosen');
                event.target.value = ''; // Clear the file input
            } else {
                setFileLabel(file.name);
            }
        } else {
            setFileLabel('No file chosen');
        }
    };

    const handleWorkTypeChange = (e) => {
        const value = e.target.value;
        // Toggle work type selection
        if (selectedWorkTypes.includes(value)) {
            setSelectedWorkTypes(selectedWorkTypes.filter((item) => item !== value));
        } else {
            setSelectedWorkTypes([...selectedWorkTypes, value]);
        }
    };

    return (
        <>
            <TicketAppBar />
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
                    JobTrack
                </Typography>
            </Box>
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
                    margin: '0 auto',
                    '@media (max-width:600px)': {
                        maxWidth: '400px',
                        p: 3,
                    },
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
                                borderColor: 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                        },
                    }}
                >
                    <option value="" disabled>Select Priority</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                </TextField>

                {/* Custom Dropdown for Work Type */}
                <Box sx={{ position: 'relative', marginBottom: '20px' }}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowWorkTypeDropdown(!showWorkTypeDropdown)}
                        fullWidth
                    >
                        {selectedWorkTypes.length > 0
                            ? selectedWorkTypes.join(', ')
                            : 'Select Work Type'}
                    </Button>
                    {showWorkTypeDropdown && (
                       <Box
                           sx={{
                               display: 'flex',
                               flexDirection: 'column', // Makes the checkboxes align vertically
                               marginBottom: '16px',
                           }}
                       >
                           <Typography
                               variant="h6"
                               component="label"
                               sx={{
                                   color: '#000000',
                                   marginBottom: '8px',
                                   fontWeight: 'bold',
                               }}
                           >
                               Scope of Work
                           </Typography>
                   
                           <Box
                               sx={{
                                   display: 'flex',
                                   flexDirection: 'column', // Ensures each checkbox is on a new line
                               }}
                           >
                               {['Plumbing', 'Carpentry/Masonry/Steel Works', 'Electrical', 'Electro-Mechanical'].map((workType) => (
                                   <label key={workType} style={{ marginBottom: '8px' }}>
                                       <input
                                           type="checkbox"
                                           value={workType}
                                           checked={selectedWorkTypes.includes(workType)}
                                           onChange={handleWorkTypeChange}
                                           style={{ marginRight: '8px' }}
                                       />
                                       {workType}
                                   </label>
                               ))}
                           </Box>
                       </Box>
                    )}
                </Box>

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
                                borderColor: 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                        },
                    }}
                >
                    <option value="" disabled>Select Type of Request</option>
                    <option value="Repair/Maintenance">Repair/Maintenance</option>
                    <option value="Installation">Installation</option>
                </TextField>

                <TextField
                    label="Location & Room no."
                    name="location"
                    required
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
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
                                borderColor: 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
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

                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        mt: 2,
                        bgcolor: '#800000',
                        color: '#ffffff',
                        '&:hover': {
                            bgcolor: '#922B21',
                        },
                    }}
                    fullWidth
                >
                    Submit
                </Button>
            </Box>
        </>
    );
}

export default TicketForm;

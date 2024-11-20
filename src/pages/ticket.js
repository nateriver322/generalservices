import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Modal } from '@mui/material';
import TicketAppBar from './TicketAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

function TicketForm() {
    const navigate = useNavigate();
    const [fileLabel, setFileLabel] = useState('No file chosen');
    const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
    const [showWorkTypeDropdown, setShowWorkTypeDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const formRef = useRef(null);
    const username = sessionStorage.getItem('username');

    // New state for form fields
    const [priority, setPriority] = useState('');
    const [requestType, setRequestType] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    // New states for feedback
    const [staffFeedback, setStaffFeedback] = useState(''); // Example feedback from staff
    const [userFeedback, setUserFeedback] = useState('');
    const [feedbackList, setFeedbackList] = useState([]); // Store multiple feedbacks

    useEffect(() => {
        if (!username) {
            console.log('No authenticated user found, redirecting to login');
            sessionStorage.clear();
            localStorage.clear();
            navigate('/');
        }
    }, [navigate, username]);

    const resetForm = () => {
        setPriority('');
        setRequestType('');
        setLocation('');
        setDescription('');
        setSelectedWorkTypes([]);
        setFileLabel('No file chosen');
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (selectedWorkTypes.length === 0) {
            alert("Please select at least one work type.");
            return;
        }

        const formData = new FormData(event.target);
        const now = new Date();
        const currentDateTime = now.toISOString();
        formData.append('datetime', currentDateTime);
        formData.append('username', sessionStorage.getItem('username'));
        formData.append("workType", selectedWorkTypes.join(","));

        try {
            const response = await fetch('https://generalservicescontroller.onrender.com/api/tickets', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                setSuccessModalOpen(true);
                resetForm();
            } else {
                const errorMsg = await response.text();
                alert(`Submission failed: ${errorMsg}`);
            }
        } catch (error) {
            alert(`Error submitting the ticket: ${error.message}`);
        }
    };

    const handleFeedbackSubmit = () => {
        // Add new feedback to the list
        setFeedbackList([...feedbackList, userFeedback]);
        // Reset user feedback input
        setUserFeedback('');
    };

    return (
        <>
            <TicketAppBar />
            {/* Rest of your form code */}

            <Box
                component="form"
                onSubmit={handleFormSubmit}
                ref={formRef}
                sx={{
                    maxWidth: '600px',
                    width: '100%',
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    margin: '0 auto',
                }}
                encType="multipart/form-data"
            >
                {/* Rest of your form fields */}
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

            {/* Feedback Section */}
            <Box sx={{ marginTop: 4, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h6">Feedback</Typography>
                <Typography variant="body1">
                    <strong>Staff Feedback:</strong> {staffFeedback}
                </Typography>

                {/* List of user feedback */}
                {feedbackList.length > 0 && (
                    <Box sx={{ marginTop: 2 }}>
                        <Typography variant="body1">
                            <strong>Your Feedbacks:</strong>
                        </Typography>
                        {feedbackList.map((feedback, index) => (
                            <Typography key={index} variant="body2">
                                - {feedback}
                            </Typography>
                        ))}
                    </Box>
                )}

                <TextField
                    label="Your Feedback"
                    fullWidth
                    multiline
                    rows={2}
                    value={userFeedback}
                    onChange={(e) => setUserFeedback(e.target.value)}
                    sx={{ marginTop: 2 }}
                />
                <Button
                    onClick={handleFeedbackSubmit}
                    variant="contained"
                    sx={{
                        mt: 2,
                        bgcolor: '#800000',
                        color: '#ffffff',
                        '&:hover': {
                            bgcolor: '#922B21',
                        },
                    }}
                >
                    Send Feedback
                </Button>
            </Box>

            {/* Success Modal */}
            {successModalOpen && (
                <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'white',
                            padding: '20px',
                            borderRadius: '4px',
                            boxShadow: 24,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6">Success</Typography>
                        <Typography>The ticket was successfully submitted!</Typography>
                        <Button
                            onClick={() => setSuccessModalOpen(false)}
                            color="primary"
                            sx={{ marginTop: '10px' }}
                        >
                            Close
                        </Button>
                    </Box>
                </Modal>
            )}
        </>
    );
}

export default TicketForm;

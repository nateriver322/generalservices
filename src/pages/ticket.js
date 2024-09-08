import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ticket.css';
import TicketAppBar from './TicketAppBar';

function TicketForm() {
    const navigate = useNavigate();
    const [fileLabel, setFileLabel] = useState('No file chosen'); // State to hold the file name

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        }
    }, [navigate]);

    const handleFormSubmit = async (event) => {
        event.preventDefault(); 
        const formData = new FormData(event.target);

        // Automatically set the current datetime
        const now = new Date();
        const currentDateTime = now.toISOString(); // Format as ISO string

        formData.append('datetime', currentDateTime); // Add current datetime to the form data
        formData.append('username', localStorage.getItem('username'));

        try {
            const response = await fetch('http://localhost:8080/api/tickets', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                navigate('/SuccessTicket');
            } else {
                console.error('Submission failed');
                const errorMsg = await response.text();
                alert(`Submission failed: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error submitting the ticket: ${error.message}`);
        }
    };

    const handleFileChange = (event) => {
        const fileName = event.target.files[0] ? event.target.files[0].name : 'No file chosen';
        setFileLabel(fileName); // Update the state with the new file name
    };

    return (
        <>
            <TicketAppBar/>
            <h2 className="h2">General Services Portal</h2>
            <div className="container">
                <div className="ticket-form-container">
                       <form onSubmit={handleFormSubmit} className="ticket-form" encType="multipart/form-data">
                       <h3 className="h3_ticket">Submit a request</h3>
                        <div className="ticket-input-container">
                            <div className="select-container">
                                <select id="Priority" name="priority" required>
                                    <option value="" disabled selected hidden>Select Priority</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Non-Emergency">Non-Emergency</option>
                                </select>

                                <select id="WorkType" name="workType" required>
                                    <option value="" disabled selected hidden>Select Work Type</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Carpentry/Masonry/Steel Works">Carpentry/Masonry/Steel Works</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Electro-Mech">Electro-Mechanical</option>
                                </select>

                                <select id="ReqType" name="requestType" required>
                                    <option value="" disabled selected hidden>Select Type of Request</option>
                                    <option value="Repair/Maintenance">Repair/Maintenance</option>
                                    <option value="Installation">Installation</option>
                                </select>
                                
                                <input type="text" placeholder="Location" name="location" id="locInp" required />
                                <textarea placeholder="Details of the Request" name="description" id="DesInp" required></textarea>

                                <div className="file-upload">
                                    <input type="file" name="image" id="imageInput" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                    <label htmlFor="imageInput">Choose File</label>
                                    <span id="fileChosen">{fileLabel}</span> 
                                </div>

                                <button type="submit" id="Submitbtn" className="ticket-submit-button">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default TicketForm;

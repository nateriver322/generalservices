import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ticket.css';
import logo from '../images/logo.png';

function TicketForm() {
    const navigate = useNavigate();
    const [fileLabel, setFileLabel] = useState('No file chosen'); // State to hold the file name

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        // Set the minimum date and time for the datetime input to now
        const datetimeInput = document.getElementById('datetime');
        if (datetimeInput) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
            datetimeInput.min = currentDateTime;
        }
    }, []);

    const handleHomeButtonClick = () => {
        navigate("/dashboard"); 
    };

    const handleViewButtonClick = () => {
        navigate("/myTickets"); 
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const selectedDateTime = new Date(formData.get('datetime'));
        const now = new Date();

        if (selectedDateTime < now) {
            alert("The selected date and time cannot be in the past.");
            return;
        }

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
                // Extract error message from response if possible
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
            <header>
                <div className="header-content">
                    <img src={logo} className="logo" alt="Logo" />
                    <h1 className="h1">CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY</h1>
                </div>
            </header>
            <h2 className="h2">General Services Portal</h2>
            <div className="container">
                <div className="ticket-form-container">
                    <div className="ticket-buttoncontainer">
                        <button className="home-button" onClick={handleHomeButtonClick}>Home</button>
                        <button className="tickets-button" onClick={handleViewButtonClick}>My Tickets</button>
                    </div>
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
                                <label htmlFor="datetime" className="label-date">Select a Date and Time:</label>
                                <input type="datetime-local" id="datetime" name="datetime" required />
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

import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/ticket.css'; 

function TicketForm() {
    const navigate = useNavigate(); 

    const handleHomeButtonClick = () => {
        navigate("/dashboard"); 
        console.log("Home button clicked");
    };
    const handleViewButtonClick = () => {
        navigate("/myTickets"); 
        console.log("View button clicked");
    };

    return (
        <>
            <header>
                <div className="header-content">
                    <img src="images/logo.png" className="logo" alt="Logo" />
                    <h1 className="h1">CEBU INSTITUTE OF TECHNOLOGY - UNIVERSITY</h1>
                </div>
            </header>
            <h2 className="h2">General Services Portal</h2>
            <div className="container">
                <div className="ticket-form-container">
                    <div className="ticket-buttoncontainer">
                        {/* Add onClick event handler to the home button */}
                        <button className="home-button" onClick={handleHomeButtonClick}>Home</button>
                        <button className="tickets-button" onClick={handleViewButtonClick}>My Tickets</button>
                    </div>
                    <form action="" className="ticket-form" method="post">
                        <h3 className="h3">Submit a request</h3>
                        <div className="ticket-input-container">
                            <div className="select-container">
                                <select id="Priority" required>
                                    <option value="" disabled selected hidden>Select Priority</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Non-Emergency">Non-Emergency</option>
                                </select>

                                <select id="WorkType" required>
                                    <option value="" disabled selected hidden>Select Work Type</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Carpentry/Masonry/Steel Works">Carpentry/Masonry/Steel Works</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Electro-Mech">Electro-Mechanical</option>
                                </select>

                                <select id="ReqType" required>
                                    <option value="" disabled selected hidden >Select Type of Request</option>
                                    <option value="Repair/Maintenance">Repair/Maintenance</option>
                                    <option value="Installation">Installation</option>
                                </select>
                                
                                <input type="text" placeholder="Location" name="location" id="locInp" required />
                                <label htmlFor="datetime">Select a Date and Time:</label>
                                <input type="datetime-local" id="datetime" name="datetime" />
                                <textarea placeholder="Details of the Request" name="description" id="DesInp" required></textarea>

                                <div className="file-upload">
                                    <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }} />
                                    <label htmlFor="imageInput">Choose File</label>
                                    <span id="fileChosen">No file chosen</span>
                                </div>

                                <button id="Submitbtn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default TicketForm;

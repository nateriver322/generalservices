import React, { useEffect, useState } from 'react';
import '../css/ticketsCreated.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import axios from 'axios';

function TicketsCreated() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [personnelList, setPersonnelList] = useState([]);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [selectedPersonnel, setSelectedPersonnel] = useState('');
    const [scheduledRepairDate, setScheduledRepairDate] = useState('');
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [assessModalOpen, setAssessModalOpen] = useState(false);
    const [staffFeedback, setStaffFeedback] = useState('');
    const [feedbackModalTicket, setFeedbackModalTicket] = useState(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');
    const [sortBy, setSortBy] = useState('id'); // Default sort by Ticket Number

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        } else {
            fetchTickets();
            fetchPersonnel();
        }
    }, [navigate]);

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/tickets');
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                console.error('Failed to fetch tickets');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPersonnel = async () => {
        try {
            const response = await axios.get('http://localhost:8080/user/personnel');
            setPersonnelList(response.data);
        } catch (error) {
            console.error('Error fetching personnel:', error);
        }
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setDetailsModalOpen(true);
    };

    const handleAssessTicket = (ticket) => {
        setSelectedTicket(ticket);
        setAssessModalOpen(true);
    };

    const closeFeedbackModal = () => {
        setFeedbackModalTicket(null);
        setFeedbackError('');
    };

    const handleStaffFeedbackSubmit = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/tickets/${selectedTicket.id}/staff-feedback`, {
                feedback: staffFeedback
            });
            if (response.status === 200) {
                setAssessModalOpen(false);
                setSuccessModalOpen(true);
                fetchTickets();
            } else {
                alert('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback');
        }
    };

    const closeDetailsModal = () => {
        setDetailsModalOpen(false);
        setSelectedTicket(null);
    };

    const openDeleteModal = (ticket) => {
        setTicketToDelete(ticket);
    };

    const closeDeleteModal = () => {
        setTicketToDelete(null);
    };

    const openFeedbackModal = (ticket) => {
        setFeedbackModalTicket(ticket);
    };

    const confirmDeleteTicket = async () => {
        if (ticketToDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/tickets/${ticketToDelete.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setTickets(tickets.filter(ticket => ticket.id !== ticketToDelete.id));
                    closeDeleteModal();
                } else {
                    alert('Failed to delete the ticket.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the ticket.');
            }
        }
    };

    const handleHomeButtonClick = () => {
        navigate("/dashboard");
    };

    const handleAssignTicket = (ticket) => {
        setSelectedTicket(ticket);
        setAssignModalOpen(true);
    };

    const handleAssignPersonnel = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/tickets/assign', null, {
                params: {
                    ticketId: selectedTicket.id,
                    personnelUsername: selectedPersonnel,
                    scheduledRepairDate: scheduledRepairDate
                }
            });
            if (response.status === 200) {
                setAssignModalOpen(false);
                setSuccessModalOpen(true);
                fetchTickets();
            } else {
                alert('Failed to assign ticket');
            }
        } catch (error) {
            console.error('Error assigning ticket:', error);
            alert('Error assigning ticket');
        }
    };

    const handleSort = (e) => {
        const selectedColumn = e.target.value;
        setSortBy(selectedColumn);
    };

    const sortedTickets = [...tickets].sort((a, b) => {
        if (sortBy === 'status') {
            return a.status.localeCompare(b.status);
        } else if (sortBy === 'priority') {
            return a.priority.localeCompare(b.priority);
        } else if (sortBy === 'reportedBy') {
            return a.username.localeCompare(b.username);
        } else if (sortBy === 'dateCreated') {
            return new Date(a.datetime) - new Date(b.datetime);
        } else if (sortBy === 'personnelAssigned') {
            return (a.assignedPersonnel || '').localeCompare(b.assignedPersonnel || '');
        } else if (sortBy === 'scheduledRepairDate') {
            return new Date(a.scheduledRepairDate) - new Date(b.scheduledRepairDate);
        } else {
            // Default to sorting by ticket id
            return a.id - b.id;
        }
    });

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
                <div className="created-view-container">
                    <div className="button-myTicketcontainer">
                        <button onClick={handleHomeButtonClick} className="home-ticket-button">Home</button>
                    </div>
                    <div className="sort-by-container">
                        <label htmlFor="sortBy">Sort By:</label>
                        <select id="sortBy" value={sortBy} onChange={handleSort}>
                            <option value="id">Ticket Number</option>
                            <option value="status">Status</option>
                            <option value="priority">Priority</option>
                            <option value="reportedBy">Reported By</option>
                            <option value="dateCreated">Date Created</option>
                            <option value="personnelAssigned">Personnel Assigned</option>
                            <option value="scheduledRepairDate">Scheduled Repair Date</option>
                        </select>
                    </div>
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Ticket Number</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Reported By</th>
                                <th>Date Created</th>
                                <th>Personnel Assigned</th>
                                <th>Scheduled Repair Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTickets.map((ticket, index) => (
                                <tr key={index}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.status}</td>
                                    <td>{ticket.priority}</td>
                                    <td>{ticket.username}</td>
                                    <td>{ticket.datetime}</td>
                                    <td>{ticket.assignedPersonnel || 'None'}</td>
                                    <td>{ticket.scheduledRepairDate || 'Not scheduled'}</td>
                                    <td>
                                        <div className="button-group">
                                            {ticket.status === 'Working' || ticket.status === 'Done' ? (
                                                <button className="assigned-button" disabled>Assigned</button>
                                            ) : (
                                                <button onClick={() => handleAssignTicket(ticket)} className="assign-button">Assign</button>
                                            )}
                                            {ticket.status !== 'Done' && (
                                                <button onClick={() => handleAssessTicket(ticket)} className="assess-button">Assess</button>
                                            )}
                                            {ticket.feedback && (
                                                <button onClick={() => openFeedbackModal(ticket)} className="view-feedback-button">View Feedback</button>
                                            )}
                                            <button onClick={() => handleViewTicket(ticket)} className="view-details-button">View Details</button>
                                            <button onClick={() => openDeleteModal(ticket)} className="delete-button">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {detailsModalOpen && selectedTicket && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Ticket Details</h2>
                                <p><strong>Description:</strong> {selectedTicket.description}</p>
                                <p><strong>Priority:</strong> {selectedTicket.priority}</p>
                                <p><strong>Request Type:</strong> {selectedTicket.requestType}</p>
                                <p><strong>Work Type:</strong> {selectedTicket.workType}</p>
                                <p><strong>Location:</strong> {selectedTicket.location}</p>
                                <p><strong>Date:</strong> {selectedTicket.datetime}</p>
                                {selectedTicket.imageBase64 && (
                                    <img src={`data:image/jpeg;base64,${selectedTicket.imageBase64}`} alt="Uploaded Ticket" style={{ width: '100%' }} />
                                )}
                                <button onClick={closeDetailsModal} className="close-Button">Close</button>
                            </div>
                        </div>
                    )}
                    {assignModalOpen && selectedTicket && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={() => setAssignModalOpen(false)}>&times;</span>
                                <h2>Assign Ticket</h2>
                                <select value={selectedPersonnel} onChange={(e) => setSelectedPersonnel(e.target.value)}>
                                    <option value="">Select Personnel</option>
                                    {personnelList.map(personnel => (
                                        <option key={personnel.username} value={personnel.username}>{personnel.username}</option>
                                    ))}
                                </select>
                                <input
                                    type="datetime-local"
                                    value={scheduledRepairDate}
                                    onChange={(e) => setScheduledRepairDate(e.target.value)}
                                />
                                <button
                                    onClick={handleAssignPersonnel}
                                    className="modal-assign-button"
                                    disabled={!selectedPersonnel || !scheduledRepairDate}
                                >
                                    Assign
                                </button>
                            </div>
                        </div>
                    )}

                    {ticketToDelete && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Confirm Deletion</h2>
                                <p>Are you sure you want to delete this ticket?</p>
                                <button onClick={confirmDeleteTicket} className="confirm-delete-button">Delete</button>
                                <button onClick={closeDeleteModal} className="cancel-delete-button">Cancel</button>
                            </div>
                        </div>
                    )}
                    {successModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Success</h2>
                                <p>Action completed successfully</p>
                                <button onClick={() => setSuccessModalOpen(false)} className="close-Button">Close</button>
                            </div>
                        </div>
                    )}
                    {assessModalOpen && selectedTicket && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={() => setAssessModalOpen(false)}>&times;</span>
                                <h2>Assess Ticket</h2>
                                <p>Submitting feedback will mark the ticket as Done.</p>
                                <textarea className="textarea-feedback"
                                    value={staffFeedback}
                                    onChange={(e) => setStaffFeedback(e.target.value)}
                                    placeholder="Enter your feedback"
                                />
                                <button onClick={handleStaffFeedbackSubmit} className="submit-feedback-button">Submit Feedback and Mark as Done</button>
                            </div>
                        </div>
                    )}

                    {feedbackModalTicket && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={closeFeedbackModal}>&times;</span>
                                <h2>Feedback</h2>
                                {feedbackModalTicket.feedback && (
                                    <>
                                        <p>Personnel/Staff Feedback:</p>
                                        <textarea className="textarea-feedback" readOnly value={feedbackModalTicket.feedback} />
                                    </>
                                )}
                                {feedbackModalTicket.userFeedback ? (
                                    <>
                                        <p>User Feedback:</p>
                                        <textarea className="textarea-feedback" readOnly value={feedbackModalTicket.userFeedback} />
                                    </>
                                ) : (
                                    <>
                                        {feedbackError && <p className="error-message">{feedbackError}</p>}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default TicketsCreated;

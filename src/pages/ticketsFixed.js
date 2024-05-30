import React, { useEffect, useState } from 'react';
import '../css/ticketsFixed.css';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import axios from 'axios';

function TicketsFixed() {
    const navigate = useNavigate();
    const [fixedTickets, setFixedTickets] = useState([]);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        } else {
            fetchFixedTickets();
        }
    }, [navigate]);

    const fetchFixedTickets = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/tickets/fixed');
            if (response.status === 200) {
                setFixedTickets(response.data);
            } else {
                console.error('Failed to fetch fixed tickets');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleHomeButtonClick = () => {
        navigate("/dashboard");
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
                <div className="view-container">
                    <div className="button-myTicketcontainer">
                        <button onClick={handleHomeButtonClick} className="home-ticket-button">Home</button>
                    </div>
                    {fixedTickets.length > 0 ? (
                        <table className="ticket-table">
                            <thead>
                                <tr>
                                    <th>Ticket Number</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Reported By</th>
                                    <th>Date Created</th>
                                    <th>Personnel Assigned</th>
                                    <th>Date Fixed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fixedTickets.map((ticket, index) => (
                                    <tr key={index}>
                                        <td>{ticket.id}</td>
                                        <td>{ticket.status}</td>
                                        <td>{ticket.priority}</td>
                                        <td>{ticket.username}</td>
                                        <td>{ticket.datetime}</td>
                                        <td>{ticket.assignedPersonnel}</td>
                                        <td>{ticket.dateFixed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No Tickets Fixed Yet</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default TicketsFixed;

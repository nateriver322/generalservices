import React from 'react';
import { Modal, Typography, Box, Button } from '@mui/material';

const ViewDetailsModal = ({ open, onClose, ticket }) => {
  if (!ticket) return null;

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    overflow: 'hidden',
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '2px solid #333',
            p: 4,
            fontFamily: 'Arial, sans-serif',
            maxWidth: '100%',
            margin: 'auto',
            position: 'relative',
          }}
        >
          {/* Letterhead */}
          <Box
            sx={{
              textAlign: 'center',
              borderBottom: '2px solid #333',
              pb: 2,
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              JobTrack Service Request
            </Typography>
            <Typography variant="subtitle1">
              Ticket Number: {ticket.id}
            </Typography>
          </Box>

          {/* Ticket Details as Letter Body */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 3,
            }}
          >
            <Box>
              <Typography>
                <strong>Location:</strong> {ticket.location}
              </Typography>
              <Typography>
                <strong>Date:</strong> {ticket.datetime}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography>
                <strong>Priority:</strong> {ticket.priority}
              </Typography>
              <Typography>
                <strong>Latest Date Needed:</strong> {ticket.latestDateNeeded}
              </Typography>
            </Box>
          </Box>

          {/* Description as Letter Body */}
          <Box
            sx={{
              minHeight: '200px',
              border: '1px solid #999',
              p: 2,
              mb: 3,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Description of Service Request
            </Typography>
            <Typography>{ticket.description}</Typography>
          </Box>

          {/* Additional Details */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
            }}
          >
            <Box>
              <Typography>
                <strong>Request Type:</strong> {ticket.requestType}
              </Typography>
              <Typography>
                <strong>Work Type:</strong> {ticket.workType}
              </Typography>
              <Typography>
                <strong>Reported By:</strong> {ticket.username}
              </Typography>
            </Box>
            <Box>
              <Typography>
                <strong>Scheduled Repair Date:</strong>{' '}
                {ticket.scheduledRepairDate || 'Not scheduled'}
              </Typography>
              <Typography>
                <strong>Assigned Personnel:</strong>{' '}
                {ticket.assignedPersonnel || 'None'}
              </Typography>
              <Typography>
                <strong>Status:</strong> {ticket.status}
              </Typography>
              <Typography>
                <strong>Resolved Date:</strong> {ticket.resolvedDatetime || 'Not available'}
              </Typography>
            </Box>
          </Box>

          {/* Attached Image */}
          {ticket.imageBase64 && (
            <Box
              sx={{
                mt: 3,
                textAlign: 'center',
                border: '1px solid #999',
                p: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <strong>Attached Image</strong>
              </Typography>
              <img
                src={`data:image/jpeg;base64,${ticket.imageBase64}`}
                alt="Ticket Attachment"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Close Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
            backgroundColor: '#f0f0f0',
          }}
        >
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewDetailsModal;

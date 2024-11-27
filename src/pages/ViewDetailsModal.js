import React from 'react';
import { Modal, Typography, Box, Button, Divider } from '@mui/material';

const ViewDetailsModal = ({ open, onClose, ticket }) => {
  if (!ticket) return null;

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const DetailItem = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" component="h2" gutterBottom>
          Ticket Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 2 }}>
          <DetailItem label="Ticket Number" value={ticket.id} />
          <DetailItem label="Date Created" value={ticket.datetime} />
          <DetailItem label="Status" value={ticket.status} />
          <DetailItem label="Priority" value={ticket.priority} />
          <DetailItem label="Latest Date Needed" value={ticket.latestDateNeeded} />
          <DetailItem label="Reported By" value={ticket.username} />
          <DetailItem label="Scheduled Repair Date" value={ticket.scheduledRepairDate || 'Not scheduled'} />
          <DetailItem label="Assigned Personnel" value={ticket.assignedPersonnel} />
          <DetailItem label="Description" value={ticket.description} />
          <DetailItem label="Request Type" value={ticket.requestType} />
          <DetailItem label="Work Type" value={ticket.workType} />
          <DetailItem label="Location" value={ticket.location} />
        </Box>
        {ticket.imageBase64 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Attached Image
            </Typography>
            <img
              src={`data:image/jpeg;base64,${ticket.imageBase64}`}
              alt="Ticket Image"
              style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewDetailsModal;
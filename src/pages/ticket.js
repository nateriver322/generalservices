import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Modal } from "@mui/material";
import TicketAppBar from "./TicketAppBar";
import ConstructionIcon from "@mui/icons-material/Construction";

function TicketForm() {
  const navigate = useNavigate();
  const [fileLabel, setFileLabel] = useState("No file chosen");
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [showWorkTypeDropdown, setShowWorkTypeDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const formRef = useRef(null);
  const username = sessionStorage.getItem("username");

  // New state for form fields
  const [priority, setPriority] = useState("");
  const [requestType, setRequestType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!username) {
      console.log("No authenticated user found, redirecting to login");
      sessionStorage.clear();
      localStorage.clear();
      navigate("/");
    }
  }, [navigate, username]);

  const resetForm = () => {
    setPriority("");
    setRequestType("");
    setLocation("");
    setDescription("");
    setSelectedWorkTypes([]);
    setFileLabel("No file chosen");
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
const currentDateTime = now.toLocaleString('en-US', {
    month: 'short', 
    day: '2-digit', 
    year: 'yyyy',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}) + ` at ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

formData.append("datetime", currentDateTime);
    formData.append("username", sessionStorage.getItem("username"));

    formData.append("workType", selectedWorkTypes.join(","));

    try {
      const response = await fetch(
        "https://generalservicescontroller.onrender.com/api/tickets",
        {
          method: "POST",
          body: formData,
        }
      );
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB
      if (fileSizeMB > 10) {
        alert("File size exceeds 10MB limit. Please choose a smaller file.");
        setFileLabel("No file chosen");
        event.target.value = ""; // Clear the file input
      } else {
        setFileLabel(file.name);
      }
    } else {
      setFileLabel("No file chosen");
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowWorkTypeDropdown(false);
      }
    }
    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <TicketAppBar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          marginTop: "30px",
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
        ref={formRef}
        sx={{
          maxWidth: "600px",
          width: "100%",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          margin: "0 auto",
          "@media (max-width:600px)": {
            maxWidth: "400px",
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
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          SelectProps={{
            native: true,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
              },
              "&:hover fieldset": {
                borderColor: "#922B21",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#800000",
              },
            },
            "& .MuiInputLabel-root": {
              color: "black",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "black",
            },
          }}
        >
          <option value="" disabled>
            Select Priority
          </option>
          <option value="High">High</option>
          <option value="Low">Low</option>
        </TextField>

        {/* Custom Dropdown for Work Type */}
        <Box
          sx={{ position: "relative", marginBottom: "1px", marginTop: "10px" }}
          ref={dropdownRef}
        >
          <Button
            variant="outlined"
            onClick={() => setShowWorkTypeDropdown(!showWorkTypeDropdown)}
            fullWidth
            sx={{
              borderColor: "#000000",
              color: "#000000",
              "&:hover": {
                borderColor: "#922B21",
              },
              height: "56px", // Adjust to match other buttons' height
              fontSize: "15px", // Adjust font size if needed
              textTransform: "none", // Prevent text from being transformed to uppercase
              textAlign: "left", // Align text to the left
              display: "flex", // Use flexbox to align items
              justifyContent: "flex-start", // Align content to the start (left)
              alignItems: "center",
              fontWeight: "bold", // Ensure vertical alignment
            }}
          >
            {selectedWorkTypes.length > 0
              ? selectedWorkTypes.join(", ")
              : "Select Work Type *"}
          </Button>
          {showWorkTypeDropdown && (
            <Box
              sx={{
                position: "absolute",
                zIndex: 10,
                width: "100%",
                bgcolor: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                mt: 1,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h6"
                component="label"
                sx={{
                  color: "#000000",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  p: 1,
                }}
              >
                Scope of Work
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 1,
                }}
              >
                {[
                  "Plumbing",
                  "Carpentry/Masonry/Steel Works",
                  "Electrical",
                  "Electro-Mechanical",
                ].map((workType) => (
                  <label key={workType} style={{ marginBottom: "8px" }}>
                    <input
                      type="checkbox"
                      value={workType}
                      checked={selectedWorkTypes.includes(workType)}
                      onChange={handleWorkTypeChange}
                      style={{ marginRight: "8px" }}
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
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          SelectProps={{
            native: true,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
              },
              "&:hover fieldset": {
                borderColor: "#922B21",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#800000",
              },
            },
            "& .MuiInputLabel-root": {
              color: "black",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "black",
            },
          }}
        >
          <option value="" disabled>
            Select Type of Request
          </option>
          <option value="Repair/Maintenance">Repair/Maintenance</option>
          <option value="Installation">Installation</option>
        </TextField>

        <TextField
          label="Location & Room no."
          name="location"
          required
          fullWidth
          margin="normal"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          inputProps={{ maxLength: 20 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
              },
              "&:hover fieldset": {
                borderColor: "#922B21",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#800000",
              },
            },
            "& .MuiInputLabel-root": {
              color: "black",
              fontWeight: "bold",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "black",
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          inputProps={{ maxLength: 160 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
              },
              "&:hover fieldset": {
                borderColor: "#922B21",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#800000",
              },
            },
            "& .MuiInputLabel-root": {
              color: "black",
              fontWeight: "bold",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "black",
            },
          }}
        />

        <div className="file-upload">
          <input
            type="file"
            name="image"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="imageInput">
            <Button
              variant="outlined"
              component="span"
              sx={{
                borderColor: "#800000",
                color: "#800000",
                "&:hover": {
                  borderColor: "#922B21",
                  color: "#922B21",
                },
              }}
            >
              Choose File
            </Button>
          </label>
          <span style={{ marginLeft: "10px" }}>{fileLabel}</span>
        </div>

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#800000",
            color: "#ffffff",
            "&:hover": {
              bgcolor: "#922B21",
            },
          }}
          fullWidth
        >
          Submit
        </Button>
      </Box>

      {/* Success Modal */}
      {successModalOpen && (
        <Modal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              padding: "20px",
              borderRadius: "4px",
              boxShadow: 24,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Success</Typography>
            <Typography>The ticket was successfully submitted!</Typography>
            <Button
              onClick={() => setSuccessModalOpen(false)}
              color="primary"
              sx={{ marginTop: "10px" }}
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

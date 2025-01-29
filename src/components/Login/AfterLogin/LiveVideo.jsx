import React, { useState, useEffect } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const LiveVideo = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentBlobUrl, setCurrentBlobUrl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchLiveVideo = async () => {
    try {
      const response = await fetch("/next-video", { cache: "no-store" });
      if (response.ok) {
        const videoBlob = await response.blob();
        const blobUrl = URL.createObjectURL(videoBlob);

        // Revoke the previous blob URL to free up memory
        if (currentBlobUrl) {
          URL.revokeObjectURL(currentBlobUrl);
        }

        setCurrentBlobUrl(blobUrl);
      } else {
        console.error("Error fetching video:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching live video:", error);
    }
  };

  useEffect(() => {
    fetchLiveVideo();

    // Set up polling to refresh live video every few seconds
    const interval = setInterval(fetchLiveVideo, 10000);

    return () => {
      clearInterval(interval);
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [currentBlobUrl]);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-8">
      {/* Live Video Header */}
      <h1 className="text-3xl font-bold text-center mb-6">Live Video</h1>

      {/* Full Width Layout */}
      <div className="flex w-full h-full">
        {/* Video Player Section (Full Width) */}
        <div className="flex-1 w-7/10">
          {currentBlobUrl ? (
            <video
              src={currentBlobUrl}
              controls
              autoPlay
              muted
              style={{
                width: "100%",
                height: "90%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="text-center text-lg font-semibold flex justify-center items-center h-full">
              Loading live video...
            </div>
          )}
        </div>

        {/* Buttons Section (30% Width) */}
        <div className="flex flex-col gap-52 w-3/10 p-4 text-center">
          {/* Dropdown Button */}
          <Button
            variant="contained"
            onClick={handleClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              width: "100%",
              backgroundColor: "#1976d2",
              color: "#ffffff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              textTransform: "none",
              padding: "10px 10PX",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              marginBottom: "16px", // Added margin between buttons
            }}
          >
            All Cameras
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                backgroundColor: "#f0f0f0",
                color: "#333",
                minWidth: "150px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <MenuItem onClick={handleClose}>Camera 1</MenuItem>
            <MenuItem onClick={handleClose}>Camera 2</MenuItem>
            <MenuItem onClick={handleClose}>Camera 3</MenuItem>
            <MenuItem onClick={handleClose}>Camera 4</MenuItem>
          </Menu>

          {/* Take Snapshot Button */}
          <Button
            variant="contained"
            sx={{
              width: "100%",
              backgroundColor: "#388e3c",
              color: "#ffffff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#2e7d32",
              },
              textTransform: "none",
              padding: "10px 0",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            Take Snapshot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveVideo;
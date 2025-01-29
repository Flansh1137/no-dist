import React, { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const LiveVideoApp = () => {
  const [currentBlobUrl, setCurrentBlobUrl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Fetch the next video for the live feed
  const fetchNextVideo = async () => {
    try {
      const response = await fetch("/next-video", { cache: "no-store" });
      if (response.ok) {
        const videoBlob = await response.blob();
        const blobUrl = URL.createObjectURL(videoBlob);

        // Revoke the previous Blob URL
        if (currentBlobUrl) {
          URL.revokeObjectURL(currentBlobUrl);
        }
        setCurrentBlobUrl(blobUrl);
      } else {
        console.error("No video available:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      setTimeout(fetchNextVideo, 20000); // Retry after 20 seconds
    }
  };

  // Start fetching the live video feed
  useEffect(() => {
    fetchNextVideo();
  }, []); // Run once when the component is mounted

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      {/* Main Container */}
      <div className="w-11/12 bg-white shadow-lg rounded-lg p-8 flex justify-between">
        {/* Video Players Grid */}
        <div className="grid grid-cols-2 gap-4 flex-grow mr-8">
          {/* Live Video Feed */}
          <Card
            className="bg-gray-100 text-black shadow rounded-lg overflow-hidden"
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "200px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <video
              id="videoPlayer"
              width="100%"
              height="100%"
              controls
              autoPlay
              muted
              src={currentBlobUrl}
              onEnded={fetchNextVideo}
              onError={fetchNextVideo}
              style={{ borderRadius: "10px" }}
            ></video>
            <CardContent className="text-center text-lg font-semibold">
              Live Video Feed
            </CardContent>
          </Card>
        </div>

        {/* Right-Side Panel with Dropdown and Snapshot Button */}
        <div className="flex flex-col space-y-4">
          {/* Dropdown Button */}
          <Button
            variant="contained"
            onClick={handleClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              width: "180px",
              backgroundColor: "#1976d2",
              color: "#ffffff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              textTransform: "none",
              padding: "10px 0",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            View All Cameras
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
              width: "180px",
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

export default LiveVideoApp;

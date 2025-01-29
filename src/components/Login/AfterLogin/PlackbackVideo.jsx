// import React, { useState, useRef } from "react";
// import { TextField, Button, Checkbox } from "@mui/material";
// import JSZip from "jszip"; // Import JSZip

// const PlaybackVideo = () => {
//   const [videos, setVideos] = useState([]);
//   const [startDateTime, setStartDateTime] = useState("");
//   const [endDateTime, setEndDateTime] = useState("");
//   const [selectedVideos, setSelectedVideos] = useState([]);
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const [screenshot, setScreenshot] = useState(null); // State to store the screenshot image URL
//   const [screenshotUrl, setScreenshotUrl] = useState(null); // State to store the data URL for download
//   const videoRef = useRef(null); // Reference to the video element
//   const canvasRef = useRef(null); // Reference to the canvas element

//   // CORS proxy URL (you can use this proxy for your video files)
//   const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

//   const fetchVideos = async () => {
//     const startDate = startDateTime.split("T")[0];
//     const startTime = startDateTime.split("T")[1];
//     const endDate = endDateTime.split("T")[0];
//     const endTime = endDateTime.split("T")[1];
//     const url = `http://127.0.0.1:5000/videos?start_date=${startDate}&start_time=${startTime}&end_date=${endDate}&end_time=${endTime}`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       setVideos(data.s3_videos || []);
//       if (data.s3_videos.length > 0) {
//         setCurrentVideo(data.s3_videos[0]); // Automatically set the first video
//       }
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };

//   const handleVideoSelection = (videoUrl) => {
//     setSelectedVideos((prevSelected) =>
//       prevSelected.includes(videoUrl)
//         ? prevSelected.filter((url) => url !== videoUrl)
//         : [...prevSelected, videoUrl]
//     );
//   };

//   const handleSelectAll = () => {
//     setSelectedVideos(selectedVideos.length === videos.length ? [] : videos);
//   };

//   const handleVideoClick = (videoUrl) => {
//     setCurrentVideo(videoUrl);
//   };

//   const handleDownloadSelected = async () => {
//     const zip = new JSZip(); // Create a new JSZip instance

//     for (const videoUrl of selectedVideos) {
//       try {
//         const response = await fetch(corsProxyUrl + videoUrl); // Using CORS proxy
//         const blob = await response.blob(); // Get the video as a Blob
//         const videoName = videoUrl.split("/").pop(); // Extract the video file name from URL
//         zip.file(videoName, blob); // Add video to the ZIP file
//       } catch (error) {
//         console.error("Error downloading video:", error);
//       }
//     }

//     // Generate the ZIP file and trigger download
//     zip.generateAsync({ type: "blob" }).then((content) => {
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(content); // Create an object URL for the ZIP file
//       link.download = "videos.zip"; // Name of the ZIP file
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     });
//   };

//   const handleVideoEnd = () => {
//     // Find the current video's index
//     const currentIndex = videos.indexOf(currentVideo);
//     if (currentIndex !== -1 && currentIndex < videos.length - 1) {
//       // Set the next video
//       setCurrentVideo(videos[currentIndex + 1]);
//     }
//   };

//   const takeScreenshot = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     // Set the canvas dimensions to the video dimensions
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     // Draw the current video frame onto the canvas
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert canvas to image (data URL) and update the state to show the screenshot
//     const imageUrl = canvas.toDataURL("image/png");
//     setScreenshot(imageUrl); // Store the image URL in state
//     setScreenshotUrl(imageUrl); // Set the URL for download
//   };

//   const downloadScreenshot = () => {
//     if (screenshotUrl) {
//       const link = document.createElement("a");
//       link.href = screenshotUrl;
//       link.download = "screenshot.png"; // Set the file name for download
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-white">
//       <div className="w-[70%] flex flex-col items-center pt-10 text-gray-500 text-lg bg-gray-200">
//         <h1 className="mb-4 text-xl font-semibold">Playback Video Player</h1>
//         <div>
//           {currentVideo ? (
//             <video
//               ref={videoRef}
//               width="1020"
//               height="720"
//               controls
//               autoPlay
//               muted
//               src={currentVideo}
//               onEnded={handleVideoEnd} // Automatically play the next video
//             ></video>
//           ) : (
//             <p className="text-gray-500">Click on a video to play it.</p>
//           )}
//         </div>
//         <div className="mt-4">
//           <Button
//             variant="contained"
//             onClick={takeScreenshot}
//             sx={{
//               backgroundColor: "#1976d2",
//               color: "white",
//               height: "48px",
//               "&:hover": { backgroundColor: "#1565c0" },
//             }}
//           >
//             Take Screenshot
//           </Button>
//         </div>

//         {/* Conditionally render the screenshot preview */}
//         {screenshot && (
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold text-gray-700">Captured Screenshot</h3>
//             <img src={screenshot} alt="Screenshot" className="mt-2 border rounded" />
//             <div className="mt-2">
//               <Button
//                 variant="contained"
//                 onClick={downloadScreenshot}
//                 sx={{
//                   backgroundColor: "#1976d2",
//                   color: "white",
//                   height: "48px",
//                   "&:hover": { backgroundColor: "#1565c0" },
//                 }}
//               >
//                 Download Screenshot
//               </Button>
//             </div>
//           </div>
//         )}

//         <canvas ref={canvasRef} style={{ display: "none" }}></canvas> {/* Hidden canvas */}
//       </div>

//       <div className="w-[30%] p-8 space-y-6 bg-gray-100">
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Start Date Time:</label>
//           <TextField
//             type="datetime-local"
//             value={startDateTime}
//             onChange={(e) => setStartDateTime(e.target.value)}
//             fullWidth
//             variant="outlined"
//             sx={{ backgroundColor: "#f0f0f0" }}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">End Date Time:</label>
//           <TextField
//             type="datetime-local"
//             value={endDateTime}
//             onChange={(e) => setEndDateTime(e.target.value)}
//             fullWidth
//             variant="outlined"
//             sx={{ backgroundColor: "#f0f0f0" }}
//           />
//         </div>
//         <Button
//           variant="contained"
//           fullWidth
//           onClick={fetchVideos}
//           sx={{ backgroundColor: "#1976d2", color: "white", height: "48px", "&:hover": { backgroundColor: "#1565c0" } }}
//         >
//           SHOW VIDEO
//         </Button>
//         {videos.length > 0 && (
//           <Button
//             variant="contained"
//             fullWidth
//             onClick={handleSelectAll}
//             sx={{
//               backgroundColor: selectedVideos.length === videos.length ? "#d32f2f" : "#1976d2",
//               color: "white",
//               height: "48px",
//               "&:hover": { backgroundColor: selectedVideos.length === videos.length ? "#b71c1c" : "#1565c0" },
//             }}
//           >
//             {selectedVideos.length === videos.length ? "Deselect All" : "Select All"}
//           </Button>
//         )}
//         {selectedVideos.length > 0 && (
//           <Button
//             variant="contained"
//             fullWidth
//             onClick={handleDownloadSelected}
//             sx={{ backgroundColor: "#1976d2", color: "white", height: "48px", "&:hover": { backgroundColor: "#1565c0" } }}
//           >
//             Download Selected Videos as ZIP
//           </Button>
//         )}
//         <div>
//           <h2 className="text-lg font-semibold text-gray-700">Recorded Videos</h2>
//           <ul className="mt-4 space-y-2">
//             {videos.map((videoUrl, index) => (
//               <li key={index} className="flex items-center space-x-2">
//                 <Checkbox
//                   checked={selectedVideos.includes(videoUrl)}
//                   onChange={() => handleVideoSelection(videoUrl)}
//                 />
//                 <Button onClick={() => handleVideoClick(videoUrl)}>{videoUrl.split("/").pop()}</Button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaybackVideo;








import React, { useState, useRef } from "react";
import { TextField, Button } from "@mui/material";
import JSZip from "jszip"; // Import JSZip

const PlaybackVideo = () => {
  const [videos, setVideos] = useState([]);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [screenshot, setScreenshot] = useState(null); // State to store the screenshot image URL
  const [screenshotUrl, setScreenshotUrl] = useState(null); // State to store the data URL for download
  const videoRef = useRef(null); // Reference to the video element
  const canvasRef = useRef(null); // Reference to the canvas element

  // CORS proxy URL (you can use this proxy for your video files)
  const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

  const fetchVideos = async () => {
    const startDate = startDateTime.split("T")[0];
    const startTime = startDateTime.split("T")[1];
    const endDate = endDateTime.split("T")[0];
    const endTime = endDateTime.split("T")[1];
    const url = `http://127.0.0.1:5000/videos?start_date=${startDate}&start_time=${startTime}&end_date=${endDate}&end_time=${endTime}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setVideos(data.s3_videos || []);
      if (data.s3_videos.length > 0) {
        setCurrentVideo(data.s3_videos[0]); // Automatically set the first video
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleVideoClick = (videoUrl) => {
    setCurrentVideo(videoUrl);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip(); // Create a new JSZip instance

    for (const videoUrl of videos) {
      try {
        const response = await fetch(corsProxyUrl + videoUrl); // Using CORS proxy
        const blob = await response.blob(); // Get the video as a Blob
        const videoName = videoUrl.split("/").pop(); // Extract the video file name from URL
        zip.file(videoName, blob); // Add video to the ZIP file
      } catch (error) {
        console.error("Error downloading video:", error);
      }
    }

    // Generate the ZIP file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content); // Create an object URL for the ZIP file
      link.download = "videos.zip"; // Name of the ZIP file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleVideoEnd = () => {
    // Find the current video's index
    const currentIndex = videos.indexOf(currentVideo);
    if (currentIndex !== -1 && currentIndex < videos.length - 1) {
      // Set the next video
      setCurrentVideo(videos[currentIndex + 1]);
    }
  };

  const downloadScreenshot = () => {
    if (screenshotUrl) {
      const link = document.createElement("a");
      link.href = screenshotUrl;
      link.download = "screenshot.png"; // Set the file name for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-[70%] flex flex-col items-center pt-10 text-gray-500 text-lg bg-gray-200">
        <h1 className="mb-4 text-xl font-semibold">Playback Video Player</h1>
        <div>
          {currentVideo ? (
            <video
              ref={videoRef}
              width="1020"
              height="720"
              controls
              autoPlay
              muted
              src={currentVideo}
              onEnded={handleVideoEnd} // Automatically play the next video
            ></video>
          ) : (
            <p className="text-gray-500">Click on a video to play it.</p>
          )}
        </div>

        {/* Conditionally render the screenshot preview */}
        {screenshot && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Captured Screenshot</h3>
            <img src={screenshot} alt="Screenshot" className="mt-2 border rounded" />
            <div className="mt-2">
              <Button
                variant="contained"
                onClick={downloadScreenshot}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  height: "48px",
                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                Download Screenshot
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas> {/* Hidden canvas */}
      </div>

      <div className="w-[30%] p-8 space-y-6 bg-gray-100">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Start Date Time:</label>
          <TextField
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: "#f0f0f0" }}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">End Date Time:</label>
          <TextField
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: "#f0f0f0" }}
          />
        </div>
        <Button
          variant="contained"
          fullWidth
          onClick={fetchVideos}
          sx={{ backgroundColor: "#1976d2", color: "white", height: "48px", "&:hover": { backgroundColor: "#1565c0" } }}
        >
          SHOW VIDEO
        </Button>
        {/* Download All Videos Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleDownloadAll}
          sx={{ backgroundColor: "#1976d2", color: "white", height: "48px", "&:hover": { backgroundColor: "#1565c0" } }}
        >
          Download Videos
        </Button>
      </div>
    </div>
  );
};

export default PlaybackVideo;













// import React, { useState, useRef } from "react";
// import { TextField, Button } from "@mui/material";
// import JSZip from "jszip"; // Import JSZip

// const PlaybackVideo = () => {
//   const [videos, setVideos] = useState([]);
//   const [startDateTime, setStartDateTime] = useState("");
//   const [endDateTime, setEndDateTime] = useState("");
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const [screenshot, setScreenshot] = useState(null); // State to store the screenshot image URL
//   const [screenshotUrl, setScreenshotUrl] = useState(null); // State to store the data URL for download
//   const videoRef = useRef(null); // Reference to the video element
//   const canvasRef = useRef(null); // Reference to the canvas element

//   // CORS proxy URL (you can use this proxy for your video files)
//   const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

//   const fetchVideos = async () => {
//     if (!startDateTime || !endDateTime) {
//       alert("Please select both start and end date-time.");
//       return;
//     }

//     const startDate = startDateTime.split("T")[0];
//     const startTime = startDateTime.split("T")[1];
//     const endDate = endDateTime.split("T")[0];
//     const endTime = endDateTime.split("T")[1];

//     const url = `http://127.0.0.1:5000/videos?start_date=${startDate}&start_time=${startTime}&end_date=${endDate}&end_time=${endTime}`;
    
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Failed to fetch videos.");
//       }
//       const data = await response.json();
//       setVideos(data.s3_videos || []);
//       if (data.s3_videos.length > 0) {
//         setCurrentVideo(data.s3_videos[0]); // Automatically set the first video
//       }
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//       alert("Error fetching videos: " + error.message);
//     }
//   };

//   const handleVideoClick = (videoUrl) => {
//     setCurrentVideo(videoUrl);
//   };

//   const handleDownloadAll = async () => {
//     const zip = new JSZip(); // Create a new JSZip instance

//     for (const videoUrl of videos) {
//       try {
//         const response = await fetch(corsProxyUrl + videoUrl); // Using CORS proxy
//         const blob = await response.blob(); // Get the video as a Blob
//         const videoName = videoUrl.split("/").pop(); // Extract the video file name from URL
//         zip.file(videoName, blob); // Add video to the ZIP file
//       } catch (error) {
//         console.error("Error downloading video:", error);
//       }
//     }

//     // Generate the ZIP file and trigger download
//     zip.generateAsync({ type: "blob" }).then((content) => {
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(content); // Create an object URL for the ZIP file
//       link.download = "videos.zip"; // Name of the ZIP file
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     });
//   };

//   const handleVideoEnd = () => {
//     // Find the current video's index
//     const currentIndex = videos.indexOf(currentVideo);
//     if (currentIndex !== -1 && currentIndex < videos.length - 1) {
//       // Set the next video
//       setCurrentVideo(videos[currentIndex + 1]);
//     }
//   };

//   const captureScreenshot = () => {
//     const video = videoRef.current;
//     if (video) {
//       const videoWidth = video.videoWidth;
//       const videoHeight = video.videoHeight;
  
//       // Create an offscreen canvas to avoid tainting the original canvas
//       const offscreenCanvas = document.createElement("canvas");
//       offscreenCanvas.width = videoWidth;
//       offscreenCanvas.height = videoHeight;
//       const ctx = offscreenCanvas.getContext("2d");
  
//       ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
//       const dataUrl = offscreenCanvas.toDataURL("image/png");
//       setScreenshotUrl(dataUrl);
//       setScreenshot(dataUrl);
//     }
//   };
  

//   const downloadScreenshot = () => {
//     if (screenshotUrl) {
//       const link = document.createElement("a");
//       link.href = screenshotUrl;
//       link.download = "screenshot.png"; // Set the file name for download
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-white">
//       <div className="w-[70%] flex flex-col items-center pt-10 text-gray-500 text-lg bg-gray-200">
//         <h1 className="mb-4 text-xl font-semibold">Playback Video Player</h1>
//         <div>
//           {currentVideo ? (
//             <video
//               ref={videoRef}
//               width="1020"
//               height="720"
//               controls
//               autoPlay
//               muted
//               src={currentVideo}
//               onEnded={handleVideoEnd} // Automatically play the next video
//             ></video>
//           ) : (
//             <p className="text-gray-500">Click on a video to play it.</p>
//           )}
//         </div>

//         {/* Conditionally render the screenshot preview */}
//         {screenshot && (
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold text-gray-700">Captured Screenshot</h3>
//             <img src={screenshot} alt="Screenshot" className="mt-2 border rounded" />
//             <div className="mt-2">
//               <Button
//                 variant="contained"
//                 onClick={downloadScreenshot}
//                 sx={{
//                   backgroundColor: "#1976d2",
//                   color: "white",
//                   height: "48px",
//                   "&:hover": { backgroundColor: "#1565c0" },
//                 }}
//               >
//                 Download Screenshot
//               </Button>
//             </div>
//           </div>
//         )}

//         <canvas ref={canvasRef} style={{ display: "none" }}></canvas> {/* Hidden canvas */}
        
//         {/* Screenshot Capture Button */}
//         <Button
//           variant="contained"
//           onClick={captureScreenshot}
//           sx={{
//             backgroundColor: "#1976d2",
//             color: "white",
//             height: "48px",
//             "&:hover": { backgroundColor: "#1565c0" },
//           }}
//         >
//           Capture Screenshot
//         </Button>
//       </div>

//       <div className="w-[30%] p-8 space-y-6 bg-gray-100">
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Start Date Time:</label>
//           <TextField
//             type="datetime-local"
//             value={startDateTime}
//             onChange={(e) => setStartDateTime(e.target.value)}
//             fullWidth
//             variant="outlined"
//             sx={{ backgroundColor: "#f0f0f0" }}
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">End Date Time:</label>
//           <TextField
//             type="datetime-local"
//             value={endDateTime}
//             onChange={(e) => setEndDateTime(e.target.value)}
//             fullWidth
//             variant="outlined"
//             sx={{ backgroundColor: "#f0f0f0" }}
//           />
//         </div>
//         <Button
//           variant="contained"
//           fullWidth
//           onClick={fetchVideos}
//           sx={{ backgroundColor: "#1976d2", color: "white", height: "48px", "&:hover": { backgroundColor: "#1565c0" } }}
//         >
//           SHOW VIDEO
//         </Button>
//         {/* Download All Videos Button */}
//         <Button
//           variant="contained"
//           fullWidth
//           onClick={handleDownloadAll}
//           sx={{ backgroundColor: "#1976d2", color: "white", height: "48px", "&:hover": { backgroundColor: "#1565c0" } }}
//         >
//           Download Videos
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PlaybackVideo;

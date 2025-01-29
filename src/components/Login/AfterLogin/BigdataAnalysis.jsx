import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { Pie, Bar } from "react-chartjs-2";
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

// Register the necessary elements for both Bar and Pie charts
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);


const DataAnalysis = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState({});
  const [unknownData, setUnknownData] = useState({});
  const [combinedData, setCombinedData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [dataRow, setDataRow] = useState({
    total: "",
    knownVisits: [],
    unknownVisits: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [knownImages, setKnownImages] = useState([]);
  const [unknownImages, setUnknownImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImagesRow, setShowImagesRow] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [names, setNames] = useState([]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
      fetchUnknownData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const fetchData = async (start, end) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/data-analysis`, {
        params: {
          startDate: format(start, "yyyy-MM-dd"),
          endDate: format(end, "yyyy-MM-dd"),
        },
      });
      setData(response.data);
    } catch (error) {
      setError("Error fetching data.");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnknownData = async (start, end) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get
        // "http://localhost:5000/unknown-data-analysis",
        (`${import.meta.env.VITE_API_BASE_URL}/unknown-data-analysis`,
          {
            params: {
              startDate: format(start, "yyyy-MM-dd"),
              endDate: format(end, "yyyy-MM-dd"),
            },
          }
        );
      setUnknownData(response.data);
    } catch (error) {
      setError("Error fetching unknown data.");
      console.error("Error fetching unknown data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImages = async (date, type) => {
    setLoadingImages(true);
    setShowImagesRow(true);
    setCurrentImageIndex(0);
    setNames([])
    // Reset to first image
    try {
      const endpoint =
        type === "Known"
          // ? "http://localhost:5000/known-images-by-date"
          ? (`${import.meta.env.VITE_API_BASE_URL}/known-images-by-date`)
          // : "http://localhost:5000/unknown-images-by-date";
          : (`${import.meta.env.VITE_API_BASE_URL}/unknown-images-by-date`);
      const response = await axios.get(endpoint, { params: { date } });
      if (type === "Known") {
        setKnownImages(response.data);
        setCurrentImages(response.data);
      } else {
        setUnknownImages(response.data);
        setCurrentImages(response.data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleViewPeople = async (date) => {
    try {
      // const response = await axios.get('http://localhost:5000/names-by-date', {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/names-by-date`, {
        params: {
          date: date,
        },
      });
      console.log(response.data)
      const uniqueNames = Array.from(new Set(response.data));
      setNames(uniqueNames);
      setSelectedDate(date);
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };
  useEffect(() => {
    const totalKnownData = Object.values(data).reduce((acc, count) => acc + count, 0);
    const totalUnknownData = Object.values(unknownData).reduce((acc, count) => acc + count, 0);

    const knownVisitsByDate = Object.entries(data).map(([date, count]) => ({
      date,
      count,
    }));

    const unknownVisitsByDate = Object.entries(unknownData).map(([date, count]) => ({
      date,
      count,
    }));

    setCombinedData({
      labels: ["Known Data", "Unknown Data"],
      datasets: [
        {
          data: [totalKnownData || 1, totalUnknownData || 1],
          backgroundColor: ["#64C2A6", "#2D87BB"],
        },
      ],
    });


    setBarChartData({
      labels: ["Known Data", "Unknown Data"], // Bar chart labels (same as pie chart labels)
      datasets: [
        {
          label: "Total Visits",
          data: [totalKnownData, totalUnknownData],
          backgroundColor: ["#FF6384", "#36A2EB"],
          borderColor: ["#FF6384", "#36A2EB"],
          borderWidth: 1,
        },
      ],
    });

    setDataRow({
      total: `${totalKnownData} KNOWN  ,    ${totalUnknownData} UNKNOWN`,
      knownVisits: knownVisitsByDate,
      unknownVisits: unknownVisitsByDate,
    });
  }, [data, unknownData]);

  const handleNextImage = () => {
    // Move to the next image set, ensuring we stay within bounds
    if (currentImageIndex + 5 < currentImages.length) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevImage = () => {
    // Move to the previous image set, ensuring we stay within bounds
    if (currentImageIndex - 1 >= 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleDatesData = async (date) => {
    try {
      // const response = await axios.get('http://localhost:5000/timestamp-by-date', {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/timestamp-by-date`, {
        params: {
          date: date,
        },
      });
      console.log("dt", response.data)
      const timesatmps = Array.from(new Set(response.data));
      setTimestamps(timesatmps);
      setSelectedDate(date);
    } catch (error) {
      console.error('Error fetching timestamps:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row w-full gap-4 p-10">
        <div className="bg-blue-50 shadow rounded-lg p-4 md:w-1/5 w-full flex flex-col text-center" style={{ height: "400px", overflowY: "auto" }}>
          <h2 className="text-xl font-bold mb-4">DATA SUMMARY</h2>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Start Date & Time:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              dateFormat="Pp"
              className="w-full border rounded p-2"
              placeholderText="Select Start Date & Time"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">End Date & Time:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              dateFormat="Pp"
              className="w-full border rounded p-2"
              placeholderText="Select End Date & Time"
            />
          </div>
          <button
            className="bg-blue-500 text-white py-1 px-4 font-bold rounded text-m mx-auto"
            onClick={() => {
              fetchData(startDate, endDate);
              fetchUnknownData(startDate, endDate);
            }}
          >
            Fetch Data
          </button>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-yellow-500">{error}</p>}
        </div>

        <div className="bg-blue-50 shadow rounded-lg px-4 md:w-4/5 w-full" style={{ height: "400px", overflowY: "auto" }}>
          <h2 className="text-xl font-semibold mb-4">Data Distribution</h2>
          {combinedData ? (
            <div style={{ width: "100%", height: "280px" }}>
              <Pie
                data={combinedData}
                options={{
                  plugins: {
                    legend: { display: true, position: "bottom" },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
              <p className="mt-2 font-bold text-xl text-center">{dataRow.total}</p>
            </div>
          ) : (
            <p>No data available for the selected range.</p>
          )}
        </div>

        <div className="bg-blue-50 shadow rounded-lg px-4 md:w-1/2 w-full" style={{ height: "400px", overflowY: "auto" }}>
          <h2 className="text-xl font-semibold mb-4">Data Distribution (Bar Chart)</h2>
          {barChartData ? (
            <div style={{ width: "100%", height: "280px" }}>
              <Bar
                data={barChartData}
                options={{
                  plugins: {
                    legend: { display: true, position: "top" },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p>No data available for the selected range.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4 px-10">
        <table className="w-full table-auto border-separate ">
          <thead>
            <tr className="bg-gray-100 hover:bg-gray-200">
              <th className="border text-xl px-4 py-2 ">Known and Unknown Visits</th>
              <th className="border text-xl px-4 py-2">Known Visits by Date</th>
              <th className="border text-xl px-4 py-2">Unknown Visits by Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-green-50">
              <td className="border px-4 py-2" style={{ height: "200px", overflowY: "auto" }}>
                <p className="mt-2 text-lg">
                  <strong>Start Date & Time:</strong> {startDate ? format(startDate, "MM/dd/yyyy, h:mm a") : "Not Selected"}
                </p>
                <p className="mt-2 text-lg">
                  <strong>End Date & Time:</strong> {endDate ? format(endDate, "MM/dd/yyyy, h:mm a") : "Not Selected"}
                </p>

              </td>
              <td className="border px-4 py-2 text-lg" style={{ height: "200px", overflowY: "auto" }}>
                {dataRow.knownVisits.map((visit) => (
                  <div key={visit.date} className="flex justify-between">
                    <span>{visit.date}: <span className="font-bold">{visit.count}</span></span>
                    <button
                      className="bg-blue-400 hover:bg-blue-600 text-white py-1.5 px-2 text-sm rounded mb-1"
                      onClick={() => {
                        fetchImages(visit.date, "Known")
                        handleViewPeople(visit.date)
                      }
                      }
                    >
                      View People
                    </button>
                  </div>
                ))}
              </td>
              <td className="border px-4 py-2 text-lg" style={{ height: "200px", overflowY: "auto" }}>
                {dataRow.unknownVisits.map((visit) => (
                  <div key={visit.date} className="flex justify-between">
                    <span>{visit.date}: <span className="font-bold">{visit.count}</span></span>
                    <button
                      className="bg-blue-400 hover:bg-blue-600 text-white py-1.5 px-2 text-sm rounded mb-1"
                      onClick={() => fetchImages(visit.date, "Unknown")}
                    >
                      View People
                    </button>
                  </div>
                ))}
              </td>
            </tr>
            {showImagesRow && (
              <tr>
                <td colSpan="3" className="border px-4 py-2">
                  <div className="flex justify-center items-center">
                    {loadingImages ? (
                      <p>Loading images...</p>
                    ) : (
                      <>
                        {currentImages.length > 0 && (
                          <div className="flex items-center gap-4 py-4">
                            {/* Prev Button */}
                            <button
                              onClick={handlePrevImage}
                              disabled={currentImageIndex === 0}
                              className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                            >
                              Prev
                            </button>
                            {/* Images Display: Show 5 images */}

                            <div className="flex flex-wrap gap-4 py-4">
                              {currentImages
                                .slice(currentImageIndex, currentImageIndex + 4)
                                .map((image, index) => (
                                  <div key={index} className="flex flex-col items-center">
                                    {/* Image */}
                                    <img
                                      src={`data:image/jpeg;base64,${image}`}
                                      alt="Person"
                                      className="w-72 h-72 object-cover rounded-lg"
                                    />
                                    <p className="text-center font-semibold mt-4 text-xl">
                                      {/* Use a fallback if there is no name */}
                                      {names[index]}
                                    </p>
                                  </div>
                                ))}
                            </div>

                            {/* Next Button */}
                            <button
                              onClick={handleNextImage}
                              disabled={currentImageIndex + 1 >= currentImages.length}
                              className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}


          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataAnalysis;

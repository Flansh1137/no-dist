import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const CaptureImages = ({ setImageData }) => {
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setImageData(imageSrc);
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    return (
        <div className="flex flex-col items-center p-4">
            {!capturedImage ? (
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        mirrored={false} // Turn off mirroring
                        className="mb-4"
                    />
                    <button
                        onClick={capture}
                        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Capture Image
                    </button>
                </>
            ) : (
                <>
                    <img src={capturedImage} alt="Captured" className="w-full h-auto mb-4" />
                    <button
                        onClick={handleRetake}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                    >
                        Retake Image
                    </button>
                </>
            )}
        </div>
    );
};

export default CaptureImages;

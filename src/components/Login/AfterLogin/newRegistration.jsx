import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import CaptureImages from './captureImages';

const NewRegistrationForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        phone: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        height: '',
        weight: '',
        age: '',
        bloodGroup: '',
        email: '',
        address: '',
    });
    const [imageData, setImageData] = useState(null); // State for single image data
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        if (!formData.email.includes('@')) {
            setMessage('Invalid email address.');
            setIsError(true);
            return false;
        }
        if (isNaN(formData.phone) || formData.phone.length < 10) {
            setMessage('Phone number must be at least 10 digits.');
            setIsError(true);
            return false;
        }
        if (!formData.id || !formData.name || !formData.address) {
            setMessage('Please fill in all required fields.');
            setIsError(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // const response = await axios.post('http://localhost:5000/new-registration', {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/new-registration`, {
                ...formData,
                image: imageData,
            });
            console.log('Form submitted successfully:', response.data);
            setMessage('Registration successful!');
            setIsError(false);
            setTimeout(() => {
                setMessage('');
                navigate('/Counselor-Login');
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage =
                error.response?.data?.message || 'Error submitting registration. Please try again.';
            setMessage(errorMessage);
            setIsError(true);
            setTimeout(() => {
                setMessage('');
            }, 2000);
        }
    };

    const renderTextField = (label, name, value, type = 'text') => (
        <TextField
            fullWidth
            label={label}
            name={name}
            value={value}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            type={type}
            required
        />
    );

    return (
        <div className="flex flex-row min-h-screen">
            {/* Form Section (80%) */}
            <div className="flex flex-col w-4/6 p-8">
                <div className="flex flex-row items-center justify-center mb-4">
                    <PersonAddIcon sx={{ fontSize: 50, color: '#007FFF' }} />
                    <Typography variant="h4" className="font-bold ml-2">New Registration Form</Typography>
                </div>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* First Column */}
                        <Grid item xs={12} md={6}>
                            {renderTextField('ID', 'id', formData.id)}
                            {renderTextField('Phone', 'phone', formData.phone, 'tel')}
                            {renderTextField('Blood Group', 'bloodGroup', formData.bloodGroup)}
                            {renderTextField('Height', 'height', formData.height, 'number')}
                            {renderTextField('Email Address', 'email', formData.email, 'email')}
                        </Grid>

                        {/* Second Column */}
                        <Grid item xs={12} md={6}>
                            {renderTextField('Name', 'name', formData.name)}
                            {renderTextField('Address', 'address', formData.address)}
                            {renderTextField('Age', 'age', formData.age, 'number')}
                            {renderTextField('Weight', 'weight', formData.weight, 'number')}
                            {renderTextField('Emergency Contact Name', 'emergencyContactName', formData.emergencyContactName)}
                            {renderTextField('Emergency Contact Number', 'emergencyContactNumber', formData.emergencyContactNumber, 'tel')}
                        </Grid>
                    </Grid>
                </form>
            </div>

            {/* Camera and Submit Section (20%) */}
            <div className="w-2/6 p-8 bg-gray-100 flex flex-col items-center justify-center">
                <CaptureImages setImageData={setImageData} />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    className="mt-4"
                >
                    Submit
                </Button>
            </div>

            {message && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                    <div
                        className={`p-6 rounded-lg text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}
                    >
                        <p className="text-lg font-bold mb-4">{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewRegistrationForm;

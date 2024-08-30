import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const AddAddress = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        contact: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate email
        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setValidationErrors({
                ...validationErrors,
                email: emailPattern.test(value) ? '' : 'Please enter a valid email address.',
            });
        }

        // Validate contact (phone number)
        if (name === 'contact') {
            const contactPattern = /^\d{10}$/;
            setValidationErrors({
                ...validationErrors,
                contact: contactPattern.test(value) ? '' : 'Please enter a 10-digit phone number.',
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for validation errors before submitting
        if (validationErrors.email || validationErrors.contact) {
            setError('Please fix the validation errors before submitting.');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        axios.post('http://localhost:5000/api/addresses', formData)
            .then(() => {
                setMessage('Address added successfully!');
                setLoading(false);
                setTimeout(() => nav('/'), 2000); // Redirect after 2 seconds
            })
            .catch(() => {
                setError('Failed to add address. Please try again.');
                setLoading(false);
            });
    };

    return (
        <div className='container min-vh-100 d-flex flex-column align-items-center justify-content-center'>
            <h2 className='display-4 text-center mb-4'>Add Address</h2>
            <Navigation />
            {message && <div className="alert alert-success" role="alert">{message}</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <div className='card p-4 w-50'>
                <form onSubmit={handleSubmit}>
                    <div className='form-group mb-3'>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" onChange={handleChange} required className='form-control' />
                    </div>
                    <div className='form-group mb-3'>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`} 
                        />
                        {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
                    </div>
                    <div className='form-group mb-3'>
                        <label htmlFor="contact">Contact:</label>
                        <input 
                            type="tel" 
                            id="contact" 
                            name="contact" 
                            onChange={handleChange} 
                            required 
                            className={`form-control ${validationErrors.contact ? 'is-invalid' : ''}`} 
                        />
                        {validationErrors.contact && <div className="invalid-feedback">{validationErrors.contact}</div>}
                    </div>
                    <div className='form-group mb-4'>
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" onChange={handleChange} required className='form-control' />
                    </div>
                    <div className='text-center'>
                        <button type="submit" className='btn btn-primary p-2' disabled={loading}>
                            {loading ? 'Adding...' : 'Add Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddress;

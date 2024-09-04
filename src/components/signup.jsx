import React, { useState } from 'react'
import { API } from '../pages/Home';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa6';

const Signup = ({handleSignInClick, handleBackClick}) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
      });

      const [errors, setErrors] = useState({});
      const [isLoading, setIsLoading] = useState(false);

      const validateForm = () => {
        const errors = {};
    
        if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
          errors.username = 'Username must be alphanumeric';
        }
    
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          errors.email = 'Email is not valid';
        }
    
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+]).{8,}$/.test(formData.password)) {
          errors.password = 'Password must contain at least one capital letter, one digit, and one special character';
        }
    
        setErrors(errors);
        return Object.keys(errors).length === 0;
      };

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
          return;
        }
    
        setIsLoading(true);
        try {
          const response = await axios.post(
            `${API}/auth/signup`,
            formData,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
              },
            }
          );
          toast.success('Sign up successful');
          handleSignInClick();
          console.log('Sign up successful', response.data);
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400 || status === 404) {
                  // Display the error message from the API response
                  const errorMessage = data.detail || 'An error occurred. Please try again.';
                  toast.error(errorMessage);
                } else {
                  // Handle other errors
                  toast.error('Failed to Login. Please try again.');
                }
              } else {
                // Handle cases where there is no response from the server
                toast.error('An unexpected error occurred. Please try again.');
              }
              console.error('Sign up error', error.response.data);
        } finally {
          setIsLoading(false);
        }
      };
    
  return (
    <>
    <Toaster />
        <div onClick={handleBackClick} className='absolute left-2 top-2 flex items-center gap-1 text-xs cursor-pointer'>
        <FaArrowLeft size={15}/>
        <p className='relative top-[0.06rem]'>Back to Home</p></div>
        
        <h1 className='mt-6 font-bold text-3xl'>Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className={`w-full px-4 py-3 border rounded-lg ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                />
                {errors.username && <p className="text-red-500 mt-1 text-xs text-left">{errors.username}</p>}
            </div>

            <div>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-3 border rounded-lg ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                />
                {errors.email && <p className="text-red-500 mt-1 text-xs text-left">{errors.email}</p>}
            </div>

            <div>
                <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 border rounded-lg ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                />
                {errors.password && <p className="text-red-500 mt-1 text-xs text-left">{errors.password}</p>}
            </div>

            <button
                type="submit"
                className={`w-full py-3 mt-4 text-white rounded-lg ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-opacity-80'
                }`}
                disabled={isLoading}
            >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
        <p className='mt-4 text-gray-600 text-sm'>
            Already have an account? 
            <span 
            onClick={handleSignInClick}
            className='text-sky-400 cursor-pointer'>
            &nbsp;Login
            </span>
        </p>
    </>
  )
}

export default Signup
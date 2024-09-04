import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../pages/Home';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { useWebSocket } from '../context/WebSocketContext';

const Login = ({ handleSignUpClick, handleBackClick }) => {
  const { setWsToken, setName } = useWebSocket();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email is not valid';
    }

    if (!formData.password) {
      errors.password = 'Password cannot be empty';
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

    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('email', formData.email);
    urlEncodedData.append('password', formData.password);

    try {
      const response = await axios.post(`${API}/auth/login`, urlEncodedData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        withCredentials:true,
      });

    ///GET WEBSOCKET TOKEN
    const tokenResponse = await axios.get(`${API}/planner/get-ws-token`, {
        withCredentials: true,
      });
      setName(formData.email);
      setWsToken(tokenResponse.data.token);
      console.log('WebSocket token received:', tokenResponse.data.token);
      console.log('Login successful', response.data);

      toast.success('Login successful');
      navigate("/chat");
    } catch (error) {
      console.error('Login error', error.response?.data || error.message);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 404 || status === 401) {
          // Display the error message from the API response
          const errorMessage = data.message || data.detail.msg || 'An error occurred. Please try again.';
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

      <h1 className='mt-6 font-bold text-3xl'>Welcome Back</h1>
      <form onSubmit={handleSubmit} className='mt-4'>

        <div>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            className={`w-full mt-2 p-3 border rounded-lg ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 mt-1 text-xs text-left">{errors.email}</p>}
        </div>

        <div className={`relative flex items-start mt-2 border rounded-lg ${
          errors.password ? 'border-red-500' : 'border-gray-300'
            }`}>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle input type
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='w-[88%] p-3 outline-none bg-transparent'
          />
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)} // Toggle password visibility
            className={`z-[3] absolute w-[12%] top-2 right-3 lg:right-1 ${errors.password && "" } 
            inset-y-0 right-0 flex items-center text-gray-500`}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs text-left mt-2">{errors.password}</p>}

        <button
          type='submit'
          className={`mt-4 w-full bg-primary-blue py-3 text-black rounded-lg ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-opacity-80'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign in'}
        </button>
      </form>
      <p className='mt-4 text-gray-600 text-sm'>
        Don't have an account?
        <span onClick={handleSignUpClick} className='text-sky-400 cursor-pointer'>
          &nbsp; Sign up
        </span>
      </p>
    </>
  );
};

export default Login;
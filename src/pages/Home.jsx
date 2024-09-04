import React, { useState } from 'react';
import Signup from '../components/signup';
import Login from '../components/login';

export const API= import.meta.env.VITE_API_URL;

const Home = () => {
  const [view, setView] = useState('onboarding'); // State to toggle between views

  const handleSignUpClick = () => {
    setView('signup');
  };

  const handleSignInClick = () => {
    setView('signin');
  };

  const handleBackClick = () => {
    setView('onboarding');
  };

  return (
    <div className='w-full h-screen overflow-y-auto bg-[#FAFAFB] flex items-center justify-center
    relative container mx-auto max-w-[2800px] scroll-smooth'>
      <div className='grid grid-cols-1 lg:grid-cols-3'>
        <div className='w-full h-auto max-lg:w-[20%]'>
          <img src="/landing-1.png" 
            draggable="false"
            className="pointer-events-none aspect-auto object-contain"
            alt="" />
        </div>

        <div className={`z-[1] onboarding-text relative w-full max-lg:w-[90%] h-auto m-auto
          border-2 bg-white border-purple py-9 lg:py-20 px-12 rounded-xl transition-transform duration-500 ease-in-out`}>
          <div className='mx-auto text-primary-black text-center'
          >
            {view === 'onboarding' && (
              <>
                <img src="/bot.png" alt="" className='w-20 mx-auto'/>
                <h1 className='mt-6 font-bold text-3xl'>Unleash Your Inner Fitness Hero</h1>
                <h2 className='mt-2 text-xl text-gray-600'>Your personalized meal and fitness planner.</h2>
                <p className='mt-3 text-primary-gray'>To continue, kindly log in with your account</p>

                <div className='mt-3 lg:mt-6 flex flex-col'>
                  <button 
                    onClick={handleSignUpClick}
                    className='mt-3 bg-primary-black py-3 max-lg:w-[60%] mx-auto lg:px-12 text-white rounded-xl
                    transition-colors duration-300 hover:bg-opacity-80'>
                    Sign up
                  </button>

                  <button 
                    onClick={handleSignInClick}
                    className='mt-3 bg-primary-blue py-3 max-lg:w-[60%] mx-auto lg:px-12 text-primary-black rounded-xl
                    transition-colors duration-300 hover:bg-opacity-80'>
                    Sign in
                  </button>
                </div>
              </>
            )}

            {view === 'signup' && (
             <Signup
              handleSignInClick={handleSignInClick} 
             handleBackClick={handleBackClick}/>
            )}

            {view === 'signin' && (
              <Login 
              handleSignUpClick={handleSignUpClick} 
              handleBackClick={handleBackClick}/>
            )}
          </div>
        </div>

        <div className='w-full h-auto max-lg:w-[20%] max-lg:ml-auto'>
          <img src="/landing-2.png" 
            draggable="false"
            className="relative pointer-events-none aspect-auto object-contain lg:left-[-1rem]"
            alt="" />
        </div>
      </div>
    </div>
  )
}

export default Home;
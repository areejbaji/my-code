// import React from 'react';
import './BackToLogin.css';
import { FaArrowLeft } from 'react-icons/fa'; // or any other icon
import { useNavigate } from 'react-router-dom';
export default function BackToLogin() {
const navigate = useNavigate();
const navigateHandler = () => {
   navigate('/login'); // Navigate to the login page
};
  return (
    <div onClick={navigateHandler} className='back-toLogin_ui'>
      <FaArrowLeft />
      <span>Back to Login</span>
    </div>
  );
};

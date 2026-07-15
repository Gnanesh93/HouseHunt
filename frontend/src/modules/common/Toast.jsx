import React from 'react';
import { ToastContainer } from 'react-toastify';

/**
 * Toast Container Configuration Component
 * Standardizes toast styles and positioning options across the application
 */
const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default Toast;
export { toast } from 'react-toastify';

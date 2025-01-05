import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = ({ message, type = 'success', position = 'top-center' }) => {
    useEffect(() => {
        if (message) {
            switch (type) {
                case 'success':
                    toast.success(message, { position });
                    break;
                case 'error':
                    toast.error(message, { position });
                    break;
                case 'info':
                    toast.info(message, { position });
                    break;
                case 'warning':
                    toast.warning(message, { position });
                    break;
                default:
                    toast(message, { position });
                    break;
            }
        }
        // Only re-run when `message` or `type` changes
    }, [message, type, position]);

    return (
        <ToastContainer
            position={position}
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false} 
            draggable
            pauseOnHover={false}   
        />
    );
};

export default ToastMessage;

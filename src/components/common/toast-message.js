import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = ({ message, type = 'success', position = 'top-center', autoClose = 3000 }) => {
    useEffect(() => {
        if (message) {
            switch (type) {
                case 'success':
                    toast.success(message, { position, autoClose });
                    break;
                case 'error':
                    toast.error(message, { position, autoClose });
                    break;
                case 'info':
                    toast.info(message, { position, autoClose });
                    break;
                case 'warning':
                    toast.warning(message, { position, autoClose });
                    break;
                default:
                    toast(message, { position, autoClose });
                    break;
            }
        }
        // Only re-run when `message` or `type` changes
    }, [message, type, position, autoClose]);

    return (
        <ToastContainer
            position={position}
            autoClose={autoClose}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
};

export default ToastMessage;

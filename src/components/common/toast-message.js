// ToastMessage.js
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastMessage = ({ message, type = 'success', position = 'top-center', autoClose = 3000 }) => {
    // Trigger the toast notification based on the type
    toast.dismiss();
    const showToast = () => {
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
    };

    // Show the toast when the component renders
    React.useEffect(() => {
        showToast();
    },);

    return <ToastContainer 
    position={position}
                autoClose={autoClose}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover/>;
};

export default ToastMessage;

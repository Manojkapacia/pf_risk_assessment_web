import React, { useState, useEffect, useRef } from 'react';
import { post } from '../common/api';
import { decryptData } from '../common/encryption-decryption';
import { useNavigate } from 'react-router-dom';
import loaderGif from '../../assets/images/Mobile-Payment.gif'
import '../../css/summary/report-modal.css'
import MESSAGES from '../constants/messages';
import { io } from 'socket.io-client';
import ToastMessage from '../common/toast-message';

const ReportPaymentModal = ({ removeBlurEffect, isOpen, onClose, mobileNumber }) => {
    const closeButtonRef = useRef(null); // Create a ref for the close button
    // const socket = io('http://localhost:3001'); // Backend URL

    const navigate = useNavigate()

    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);
    const [loaderText, setLoaderText] = useState('Please wait...Redirecting to Payment Gateway');
    const [paymentStatsData, setPaymentStatusData] = useState(null);
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.

    // Toast Message Auto Clear
    useEffect(() => {
        if (message.type) {
            isMessageActive.current = true;
            const timer = setTimeout(() => {
                setMessage({ type: "", content: "" });
                isMessageActive.current = false;
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);


    const handlePayment = async () => {
        setLoading(true);

        const result = await post('/payment/initiate-payment', { amount: 99, mobileNumber, uan: localStorage.getItem('user_uan') });

        try {
            if (result.status === 400) {
                setLoading(false)
                setMessage({ type: "error", content: result.message });
            } else if (result.status === 401) {
                onClose();
                localStorage.clear()
                navigate('/');
            } else {
                // fetch the payment url
                const payUrl = result?.data?.data?.instrumentResponse?.redirectInfo?.url
                if (!payUrl) {
                    setLoading(false);
                    setMessage({ type: "error", content: MESSAGES.error.paymentUrlNotFound });
                    return;
                }
                // navigate the user to phone pay page url
                window.location.href = payUrl; 
                // window.open(payUrl);
                setLoaderText('Kindly complete the payment...')

                // close the payment modal 
                setLoading(false);
                if (closeButtonRef.current) {
                    closeButtonRef.current.click();
                }

                // Listen for payment status updates
                // socket.on('paymentStatus', (data) => {
                //     setPaymentStatusData(data); // Update your UI accordingly
                //     if (data.status.toUpperCase() === "SUCCESS") {
                //         setLoaderText('Congratulations...Payment Successful!! You can access the Full Report now')
                //         setTimeout(() => {
                //             setLoading(false);
                //             onClose(true);
                //             removeBlurEffect(false);
                //             if (closeButtonRef.current) {
                //                 closeButtonRef.current.click();
                //             }
                //         }, 5000)
                //     }
                //     if (data.status.toUpperCase() === "FAILED") {
                //         setLoaderText('Oops...Payment Failed!! Please try again later.')
                //         setTimeout(() => {
                //             setLoading(false);
                //             onClose(false);
                //             if (closeButtonRef.current) {
                //                 closeButtonRef.current.click();
                //             }
                //         }, 5000)
                //         // call refund api if or through scheduler
                //     }
                //     if (data.status.toUpperCase() === "PENDING") {
                //         setLoaderText('Request goes in Pending State. Don\'t worry, your amount is safe with us, if deducted.')
                //         setTimeout(() => {
                //             // call refund api if or through scheduler
                //             setLoading(false);
                //             onClose(false);
                //             if (closeButtonRef.current) {
                //                 closeButtonRef.current.click();
                //             }
                //         }, 5000)
                //     }
                // });

                // return () => {
                //     socket.disconnect();
                // }                
            }
        } catch (error) {
            setLoading(false);
            setMessage({ type: "error", content: error.message });
        }
    };

    return (
        <div>
            {loading && (
                <div className="loader-overlay-pay-modal">
                    <div className="loader-container-pay-modal">
                        <img className='loader-img-pay-modal' src={loaderGif} alt="Loading..." />
                        <p className="loader-text-pay-modal"><strong>{loaderText}</strong></p>
                    </div>
                </div>
            )}
            {message.type && <ToastMessage message={message.content} type={message.type} />}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title w-100" id="exampleModalLabel">
                                Get Access to full report and much more
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                ref={closeButtonRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <ul className="list-unstyled mb-4 ms-lg-5">
                                <li className="d-flex align-items-start mb-2">
                                    <span className="me-2" style={{ color: '#00124F' }}>
                                        <i className="bi bi-check-circle-fill"></i>
                                    </span>
                                    <span>Uncover hidden issues in your PF account</span>
                                </li>
                                <li className="d-flex align-items-start mb-2">
                                    <span className="me-2" style={{ color: '#00124F' }}>
                                        <i className="bi bi-check-circle-fill"></i>
                                    </span>
                                    <span>Get Physical Report on your WhatsApp Number</span>
                                </li>
                                <li className="d-flex align-items-start mb-4">
                                    <span className="me-2" style={{ color: '#00124F' }}>
                                        <i className="bi bi-check-circle-fill"></i>
                                    </span>
                                    <span>Free 30 min consultation with PF Expert</span>
                                </li>
                            </ul>
                            <h2 className="fw-bold d-flex align-items-center justify-content-center">
                                <span className='me-2' style={{ textDecoration: 'line-through', color: "gray", fontSize: '1rem' }}>₹499</span> ₹99/-
                            </h2>
                            {/* <p className="text-muted text-center mb-0 ps-5 ms-5" style={{ fontSize: '0.6rem' }}>
                            Including Taxes
                            </p> */}
                            <div className='d-flex justify-content-center '>
                                <button
                                    className="btn px-4 py-2"
                                    onClick={handlePayment}
                                    style={{
                                        backgroundColor: '#00124F',
                                        color: '#ffffff',
                                        borderRadius: '2rem',
                                    }}
                                >
                                    Access Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ReportPaymentModal;
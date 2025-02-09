import React, { useState, useEffect, useRef } from 'react';
import { post } from '../common/api';
import { decryptData } from '../common/encryption-decryption';
import { useNavigate } from 'react-router-dom';
import loaderGif from '../../assets/images/Mobile-Payment.gif'
import '../../css/summary/report-modal.css'
import ToastMessage from '../common/toast-message';
import { load } from "@cashfreepayments/cashfree-js";

const ReportPaymentModal = ({ onClose, mobileNumber }) => {
    const cashfreeRef = useRef(null); // Use ref to store cashfree instance
    const closeButtonRef = useRef(null); // Create a ref for the close button

    const navigate = useNavigate()

    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);
    const [loaderText, setLoaderText] = useState('Please wait...');
    const [paymentOrder, setPaymentOrderData] = useState(null);
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

    useEffect(() => {
        const initializeSDK = async () => {
            cashfreeRef.current = await load({
                mode: "production"
            });
        };
        initializeSDK();
    }, []); // Empty dependency array ensures this runs only once


    const handlePayment = async () => {
        if (!cashfreeRef.current) {
            console.error("Cashfree SDK is not initialized yet.");
            return;
        }        
        setLoading(true);

        const result = await post('/payment/create-payment', { amount: 99, mobileNumber });

        try {
            if (result.status === 400) {
                setLoading(false)
                setMessage({ type: "error", content: result.message });
            } else if (result.status === 401) {
                onClose();
                localStorage.clear()
                navigate('/');
            } else {
                setLoaderText('Kindly complete the payment...')
                setPaymentOrderData(result.data)
                let checkoutOptions = {
                    paymentSessionId: result.data.payment_session_id,
                    redirectTarget: "_self",
                };
                cashfreeRef.current.checkout(checkoutOptions);
                // close the payment modal 
                setLoading(false);
                if (closeButtonRef.current) {
                    closeButtonRef.current.click();
                }         
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
                                    <span>Get drill down analysis of your corpus</span>
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
                                    Access Report
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
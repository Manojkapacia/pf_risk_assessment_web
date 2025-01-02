import React, { useEffect, useState } from 'react';
import loaderGif from './../../assets/images/login.gif';
import otpLoaderGif from './../../assets/images/otp.gif';
import { Whatsapp } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import ToastMessage from './toast-message';
import { post } from './api';
import sucessImage from './../../assets/images/icons-success.gif';

const ModalComponent = ({ isOpen, onClose }) => {
    const otpLength = 6;
    const [otpValues, setOtpValues] = useState(Array(otpLength).fill(""));
    const [timer, setTimer] = useState(59);
    const [triggerApiCall, setTriggerApiCall] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otploader, setOtpLoader] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [showOtpModel, setShowOtpModel] = useState(false);
    const [showReportScreen, setReportScreen] = useState(false);
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (mobileNumber) => {
        const transformedNumber = {
            ...mobileNumber,
            phoneNumber: `91${mobileNumber.phoneNumber}`,
        };
        try {
            setLoading(true);
            const response = await post('/auth/generate-otp', transformedNumber);
            setLoading(false);
            if (response.status === 401) {
                setLoading(false);
                localStorage.removeItem('user_uan');
                setMessage({ type: "error", content: response.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 2000);
                navigate('/');
            } else {
                setLoading(false);
                setShowOtpModel(true);
                setFormData(mobileNumber);
                setMessage({ type: "success", content: response.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 2000);
                // navigate('/report-otp', { state: { profileData, home, mobileNumber, listItems, reportUpdatedAtVar} });
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    }

    const handleRendOtpClick = async () => {
        if (formData) {
            await onSubmit(formData);
            setTimer(59);
        }
    };

    const handleOtpChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value.slice(-1);
        setOtpValues(newOtpValues);
        if (value && index < otpLength - 1) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
            }
        }
    };

    React.useEffect(() => {
            let interval;
            if (showOtpModel && timer > 0) {
                interval = setInterval(() => {
                    setTimer((prevTimer) => prevTimer - 1);
                }, 1000);
            } else if (timer === 0) {
                clearInterval(interval);
            }
    
            return () => clearInterval(interval); // Cleanup on component unmount or re-render
        }, [showOtpModel, timer]);

    const closeModel = () => {
        setTimeout(() => {
            setLoading(false)
            setShowOtpModel(false);
            setReportScreen(false);
            onClose();
        }, 1000);
    }
    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        const otp = otpValues.join("");
        setOtpLoader(true);
        try {
            const response = await post('/auth/confirm-otp', { otp: otp });
            setOtpLoader(false);
            if (response.status === 401) {
                localStorage.removeItem('user_uan')
                navigate('/');
            } else if (response.status === 400) {
                setMessage({ type: "error", content: response.message });
            } else {
                setShowOtpModel(false);
                setReportScreen(true);
                // const uan = localStorage.getItem('user_uan')
                // localStorage.removeItem('data-for-report-reg-' + uan)
                // const encodedData = encryptData(JSON.stringify({profileData, home, mobileNumber, listItems, reportUpdatedAtVar}));
                // localStorage.setItem('data-for-report-submit-' + uan, encodedData);
                // navigate("/account-summary", { state: { profileData, home, mobileNumber, listItems, reportUpdatedAtVar } });
            }
        } catch (error) {
            setMessage({ type: "error", content: error.response?.data?.message });
            console.error("Error fetching data:", error);
        }
    }

    if (!isOpen) return null; // Don't render the modal if it's not open
    const overlayStyle = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    return (
        <div style={overlayStyle}>
            <div className="modal modal-overlay fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Your report genration is in progress</p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModel}></button>
                        </div>
                        <div className="modal-body">
                            <>
                                {loading && (
                                    <div className="loader-overlay">
                                        <div className="loader-container">
                                            <img className='loader-img' src={loaderGif} alt="Loading..." />
                                            <p className="loader-text">Verifying Mobile Number</p>
                                        </div>
                                        {otploader &&
                                            <div className="loader-container">
                                                <img className='loader-img' src={otpLoaderGif} alt="Loading..." />
                                                <p className="loader-text">Verifying Your OTP</p>
                                            </div>
                                        }
                                    </div>
                                )}
                                <div className="container">
                                    {message.type && <ToastMessage message={message.content} type={message.type} />}
                                    <div className="row d-flex justify-content-center align-items-center">

                                        {!showReportScreen ?
                                            <div className="col-lg-12 mt-3 mt-lg-0">
                                                <p style={{ fontSize: '1.2rem', fontWeight: '300', lineHeight: '1.3' }}>Share your WhatsApp number to get your personalised report sent to you</p>
                                                {!showOtpModel ?
                                                    <form onSubmit={handleSubmit(onSubmit)}>
                                                        <div className="input-group mt-5">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter your WhatsApp number"
                                                                autoComplete='off' maxLength={10} inputMode="numeric"
                                                                {...register("phoneNumber", {
                                                                    required: "Whatsapp Number is required",
                                                                    pattern: {
                                                                        value: /^\d{10}$/,
                                                                        message: "Number must be exactly 10 digits",
                                                                    }
                                                                })}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                                }}
                                                            />
                                                            <span className="input-group-text bg-white">
                                                                <Whatsapp className="text-success" />
                                                            </span>
                                                        </div>
                                                        {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber.message}</span>}
                                                        <div className='text-center mb-3 mt-5'>
                                                            <button className="pfRiskButtons py-2 px-5" type='submit'>
                                                                Verify Number
                                                            </button>
                                                        </div>
                                                    </form> :

                                                    <form onSubmit={handleSubmitOtp}>
                                                        <div className="d-flex">
                                                            {Array.from({ length: otpLength }).map((_, index) => (
                                                                <input
                                                                    key={index}
                                                                    id={`otp-input-${index}`}
                                                                    type="number"
                                                                    maxLength="1"
                                                                    autoComplete='off'
                                                                    name='otp'
                                                                    className="otpInput form-control text-center mx-1 mt-2"
                                                                    value={otpValues[index]}
                                                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                                                    onKeyDown={(e) => handleBackspace(e, index)}
                                                                    aria-label={`OTP input ${index + 1}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                                    {timer > 1 ? <p className='text-danger mb-0'>OTP expires in {timer} seconds.</p>
                                                        : <p className='text-danger mb-0'>OTP expired</p>}
                                                    <a
                                                        className="text-decoration-none labelSubHeading float-end mt-2"
                                                        style={{ cursor: "pointer" }} onClick={handleRendOtpClick}>
                                                        Resend OTP
                                                    </a>
                                                </div>

                                                        <div className='text-center mt-3 mt-lg-5'>
                                                            <button className="pfRiskButtons py-2 px-5">
                                                                Get Report
                                                            </button>
                                                        </div>
                                                    </form>
                                                }
                                            </div>
                                            :
                                            <div className="col-lg-12 mt-3 mt-lg-0">
                                                <div className='text-center'>
                                                    <img src={sucessImage} alt="Dynamic Description" height={"150rem"} width={"150rem"} />
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-8 offset-md-2 text-center'>
                                                        <p style={{ fontSize: '1.5rem', fontWeight: '300', lineHeight: '1.3' }}>All Set!<br></br>
                                                            You will get your report sent to you in next 4 hours</p>
                                                    </div>
                                                </div>
                                                <div className='text-center mt-3'>
                                                    <button className="pfRiskButtons py-2" onClick={closeModel} style={{ paddingLeft: "5rem", paddingRight: "5rem" }}>
                                                        OK
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;
import React, { useEffect, useState } from 'react';
import loaderGif from './../../assets/images/login.gif';
import otpLoaderGif from './../../assets/images/otp.gif';
import { Whatsapp } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import ToastMessage from '../common/toast-message';
import { post } from '../common/api';
import { getReportSubmissionMessage } from '../common/time-formatter';
import sucessImage from './../../assets/images/icons-success.gif';
import { zohoRequest } from '../common/api';
import { encryptData } from '../common/encryption-decryption';

const ModalComponent = ({ profileData, isOpen, onClose }) => {
    const otpLength = 6;
    const [otpValues, setOtpValues] = useState(Array(otpLength).fill(""));
    const [timer, setTimer] = useState(45);
    const [loading, setLoading] = useState(false);
    const [otploader, setOtpLoader] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [showOtpModel, setShowOtpModel] = useState(false);
    const [showReportScreen, setReportScreen] = useState(false);
    const [formData, setFormData] = useState(null);
    const isBtnAssessmentEnabled = otpValues.every((field) => field !== "");
    const reportMessage = getReportSubmissionMessage()
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
                localStorage.clear()
                setMessage({ type: "error", content: response.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 5000);
                navigate('/doc-scan');
            } else {
                setLoading(false);
                setShowOtpModel(true);
                setFormData(mobileNumber);
                setMessage({ type: "success", content: response.message });
                setTimeout(() => setMessage({ type: "", content: "" }), 5000);
            }
        } catch (error) {
            if (error.status >= 500) {
                setLoading(false);
                navigate("/epfo-down")
            } else {
                setLoading(false);
                console.error("Error fetching data:", error);
            }
        }
    }

    const handleRendOtpClick = async () => {
        if (formData) {
            await onSubmit(formData);
            setOtpValues(Array(6).fill(""));
            setTimer(45);
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
        }, 500);
    }

    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        const otp = otpValues.join("");
        setLoading(true);
        setOtpLoader(true);
        try {
            const response = await post('/auth/confirm-otp', { otp: otp });
            setLoading(false);
            setOtpLoader(false);
            if (response.status === 401) {
                localStorage.clear()
                navigate('/doc-scan');
            } else if (response.status === 400) {
                setMessage({ type: "error", content: response.message });
            } else {
                setShowOtpModel(false);
                setReportScreen(true);
                // ZohoAPiCall();
                await post('/auth/update-status', { whatsAppPhoneNumber: formData?.phoneNumber });
            }
        } catch (error) {
            if (error.status >= 500) {
                setOtpValues(Array(6).fill(""));
                setOtpLoader(false);
                setLoading(false);
                navigate("/epfo-down")
            } else {
                setOtpValues(Array(6).fill(""));
                setLoading(false);
                setOtpLoader(false);
                setMessage({ type: "error", content: error.response?.data?.message });
                console.error("Error fetching data:", error);
            }
        }
    }

    // zoho lead creation
    const ZohoAPiCall = () => {
        const zohoReqData = {
            Last_Name: profileData?.basicDetails?.fullName,
            Mobile: formData?.phoneNumber,
            Email: "",
            Wants_To: "Withdrawal Checkup",
            Lead_Status: "Open",
            Lead_Source: "",
            Campaign_Id: ""
        };
        const ZohoAPi = async (Data) => {
            try {
                const result = await zohoRequest(Data);
                if (result.data.data[0].status === "success") {
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
        ZohoAPi(zohoReqData);
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
        <>
            {loading && (
                <div className="loader-overlay-pay-modal">
                    <div className="loader-container-pay-modal">
                    {otploader ?
                            <>
                                <img className='loader-img-pay-modal' src={loaderGif} alt="Loading..." />
                                <p className="loader-text-pay-modal"><strong>Verifying Your OTP</strong></p>
                            </>
                            :
                            <>
                            <img className='loader-img-pay-modal' src={loaderGif} alt="Loading..." />
                            <p className="loader-text-pay-modal"><strong>Verifying Mobile Number</strong></p>
                            </>
                            
                        }
                    </div>
                </div>
            )}
            <div style={overlayStyle}>
                <div className="modal modal-overlay fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <p className="modal-title" style={{ fontSize: '1.5rem', fontWeight: '600' }} >{!showReportScreen ? 'Your report genration is in progress' : 'Congratulations, your report is now ready '}</p>
                                {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModel}></button> */}
                            </div>
                            <div className="modal-body">
                                <>
                                    <div className="container">
                                        {message.type && <ToastMessage message={message.content} type={message.type} />}
                                        <div className="row d-flex justify-content-center align-items-center">

                                            {!showReportScreen ?
                                                <div className="col-lg-12 mt-3 mt-lg-0">

                                                    {!showOtpModel ?
                                                        <>
                                                            <p style={{ fontSize: '1.2rem', fontWeight: '300', lineHeight: '1.3' }}>Share your WhatsApp number to get your personalised report sent to you</p>
                                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                                <div className="input-group mt-5">
                                                                    <input
                                                                        type="text" style={{ border: "2px solid gray" }}
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
                                                                    <span className="input-group-text bg-white" style={{ border: '2px solid gray' }}>
                                                                        <Whatsapp className="text-success" />
                                                                    </span>
                                                                </div>
                                                                {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber.message}</span>}
                                                                <div className='text-center mb-3 mt-5'>
                                                                    <button className="pfRiskButtons py-2 px-5" type='submit'>
                                                                        Verify Number
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </>
                                                        :
                                                        <>
                                                            <p style={{ fontSize: '1.2rem', fontWeight: '300', lineHeight: '1.3' }}>Please enter your OTP</p>

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

                                                                <div className='text-center mt-3 mt-lg-5'>
                                                                    <div className="text-center" style={{ fontWeight: "400", fontSize: "1rem" }}>
                                                                        <p className='mt-2'>Waiting for OTP ? Resend in :{timer > 1 ? <span className='otpText'> {" "}{timer}</span>
                                                                            : <a
                                                                                className="text-decoration-none otpText" style={{ cursor: 'pointer' }}
                                                                                onClick={handleRendOtpClick}>{" "}
                                                                                Resend OTP
                                                                            </a>}
                                                                        </p>
                                                                    </div>
                                                                    <button className="pfRiskButtons py-2 px-5" disabled={!isBtnAssessmentEnabled || timer < 1}>
                                                                        Get Report
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </>

                                                    }
                                                </div>
                                                :
                                                <div className="col-lg-12 mt-3 mt-lg-0">
                                                    <div className='text-center'>
                                                        <img src={sucessImage} alt="Dynamic Description" height={"150rem"} width={"150rem"} />
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-md-8 offset-md-2 text-center'>
                                                            {/* <p style={{ fontSize: '1.5rem', fontWeight: '300', lineHeight: '1.3' }}>All Set!<br></br>
                                                            You will get your report sent to you {reportMessage}</p> */}
                                                        </div>
                                                    </div>
                                                    <div className='text-center mt-3'>
                                                        <button className="pfRiskButtons py-2" onClick={closeModel} style={{ paddingLeft: "5rem", paddingRight: "5rem" }}>
                                                            View Report
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
        </>

    );
};

export default ModalComponent;
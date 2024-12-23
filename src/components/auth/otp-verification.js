import '../../App.css';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/auth/otp-verification.css';
import ToastMessage from '../common/toast-message';
import MESSAGES from '../constants/messages';
import { post, login } from '../common/api';
import loaderGif from './../../assets/images/otp.gif';

function OtpComponent() {
    const location = useLocation();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });

    const { UAN, Pws, type = "" } = location.state || {};
<<<<<<< HEAD
=======

>>>>>>> 9c7a4790e4afe94b4b849767530a3691b488891d
    const [timer, setTimer] = useState(59);
    const [triggerApiCall, setTriggerApiCall] = useState(false);
    const isBtnAssessmentEnabled = otp.every((field) => field !== "");
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.

    useEffect(() => {
        if (type === "back-screen") {
            refreshOtp()
        }
    }, []);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (triggerApiCall) {
            resendOtp();
        }
    }, [triggerApiCall]);

    // Toast Message Auto Clear
    useEffect(() => {
        if (message.type) {
        isMessageActive.current = true; // Set active state when a message is displayed
        const timer = setTimeout(() => {
            setMessage({ type: "", content: "" });
            isMessageActive.current = false; // Reset active state
        }, 2500);
        return () => clearTimeout(timer);
        }
    }, [message]);

    //Refresh OTP
    const refreshOtp = async () => {
        if (UAN && Pws) {
            try {
                setLoading(true);
                const result = await post('auth/refresh-data', { uan: UAN, password: Pws.trim() });
                setLoading(false);

                if (result.status === 400) {
                    setMessage({ type: "error", content: result.message });
                } else if (result.status === 401) {
                    setLoading(false);
                    localStorage.removeItem('user_uan')
                    navigate('/');
                } else {
                    setTimer(59);
                    setTriggerApiCall(false);
                    setMessage({ type: "success", content: result.message });
                }
            } catch (error) {
                setLoading(false);
                setMessage({ type: "error", content: error.message });
            }
        }
    }

    //Resend OTP
    const resendOtp = async (event) => {
        event.preventDefault();
        if (UAN && Pws) {
            try {
                setLoading(true);
                const result = await login(UAN, Pws.trim());
                setLoading(false);

                if (result.status === 400) {
                    setMessage({ type: "error", content: result.message });
                } else {
                    setMessage({ type: "success", content: result.message });
                    setTimer(59);
                    setTriggerApiCall(false);
                }
            } catch (error) {
                if (error.status >= 500) {
                    navigate("/epfo-down")
                } else {
                setLoading(false);
                setMessage({ type: "error", content: error.message });
                }
            }
        }
    }

    const handleOtpChange = useCallback((value, index) => {
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Automatically focus the next input
            if (index < 5 && value) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    }, [otp]);

    // const handleBackspace = useCallback((event, index) => {
    //     if (event.key === "Backspace" && otp[index] === "" && index > 0) {
    //         document.getElementById(`otp-input-${index - 1}`).focus();
    //     }
    // }, [otp]);
    const handleBackspace = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            if (otp[index] === "" && index > 0) {
                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                if (prevInput) {
                    newOtp[index - 1] = "";
                    setOtp(newOtp);
                    prevInput.focus();
                }
            } else {
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.every((digit) => digit)) {
            try {
                const endpoint = type === "back-screen" ? "auth/submit-otp?refresh=true" : "auth/submit-otp"
                setLoading(true);
                await post(endpoint, { otp: otp.join('') });
                setLoading(false);

                setMessage({ type: "success", content: MESSAGES.success.otpVerified });
                localStorage.setItem("user_uan", UAN);

                setTimeout(() => {
                    navigate("/service-history");
                }, 2000);
            } catch (error) {
                setMessage({ type: "error", content: error.message || MESSAGES.error.generic });
            }
        } else {
            setMessage({ type: "error", content: MESSAGES.error.invalidOtp });
        }
    };

    return (
        <div className='setBackGround'>
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                        <img className='loader-img' src={loaderGif} alt="Loading..." />
                        <p className="loader-text">{type === "back-screen" ? 'Checking credentials' : 'Verifying OTP and Fetching details'}</p>
                    </div>
                </div>
            )}
            <div className="container">
                {message.type && <ToastMessage message={message.content} type={message.type} />}
                <div className="row d-flex justify-content-center align-items-center vh-100">
                    <div className="col-lg-4 col-md-8 offset-md-1 mt-2 mt-lg-0">
                        <div className='welcomeLabelLogin text-center'>
                            Welcome to India's First<br></br> Digital PF check up
                        </div>
                        <div className='EpfText mt-4 mb-3 text-center'>
                            Please Enter OTP to Begin checkup
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-8">
                        <div className="row">
                            <div className="col-sm-8 col-md-11 offset-md-1">
                                <div className="pfRiskheading text-center">PF Risk Assessment</div>
                                <div className="pfRiskSubHeading text-center">
                                    Check if your PF is at risk of getting stuck
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-sm-8 col-md-11 offset-md-1">
                                    <div className="otpLabel mt-2 mt-lg-5 pt-lg-5">
                                        Enter OTP sent to your EPF registered number
                                    </div>
                                    <div className="d-flex">
                                        {/* {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-input-${index}`}
                                                type="text"
                                                autoComplete='off'
                                                maxLength="1"
                                                className="otpInput form-control text-center mx-1 mt-2"
                                                value={otp[index]}
                                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                                onKeyDown={(e) => handleBackspace(e, index)}
                                                aria-label={`OTP input ${index + 1}`}
                                            />
                                        ))} */}
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <input
                                                key={index}
                                                id={`otp-input-${index}`}
                                                type="text"
                                                autoComplete="off"
                                                maxLength="1"
                                                className="otpInput form-control text-center mx-1 mt-2"
                                                value={otp[index]}
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
                                            className="text-decoration-none labelSubHeading"
                                            onClick={type === "back-screen" ? refreshOtp : resendOtp} style={{ cursor: "pointer" }}>
                                            Resend OTP
                                        </a>
                                    </div>

                                </div>
                            </div>
                            <div className="row my-2 mt-lg-5 pt-lg-4">
                                <div className="col-md-11 col-sm-8 offset-md-1">
                                    <button type="submit" className="btn w-100 pfRiskButtons" disabled={!isBtnAssessmentEnabled}>
                                        Start Assessment
                                    </button>
                                    <div className='text-center'>
                                        <span className='termConditionText d-inline-block mt-1'>By Cliking on continue you allow Finright to use your EPF account
                                            data to provide you best possible guidance and agree to the <br></br>
                                            <span style={{ fontWeight: "700" }}>Terms & Conditions</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OtpComponent;

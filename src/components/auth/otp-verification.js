import '../../App.css';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/auth/otp-verification.css';
import ToastMessage from '../common/toast-message';
import MESSAGES from '../constants/messages';
import { post, login } from '../common/api';
import loaderGif from './../../assets/images/otp.gif';
import { ExtractMobile } from '../common/extract-mobile';
import { encryptData } from '../common/encryption-decryption';

function OtpComponent() {
    const location = useLocation();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [timer, setTimer] = useState(45);
    const [triggerApiCall, setTriggerApiCall] = useState(false);
    const [mobileNumber, setMobileNumber] = useState("");
    const [otpVerified, setOtpVerified] = useState(false)
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

    const isBtnAssessmentEnabled = otp.every((field) => field !== "");
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.
    const { UAN, Pws, type = "", regMobileNumber = "" } = location.state || {};

    useEffect(() => {
        setMobileNumber(regMobileNumber)
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
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    //Refresh OTP
    const refreshOtp = async () => {
        setOtp(Array(6).fill(""));
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
                    setTimer(45);
                    setTriggerApiCall(false);
                    setMessage({ type: "success", content: result.message });
                    setMobileNumber(ExtractMobile(result.message))
                }
            } catch (error) {
                setLoading(false);
                setMessage({ type: "error", content: MESSAGES.error.generic });
                if (error.status >= 500) {
                    navigate("/epfo-down")
                }
            }
        }
    }

    //Resend OTP
    const resendOtp = async (event) => {
        setOtp(Array(6).fill(""));
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
                    setTimer(45);
                    setTriggerApiCall(false);
                    setMobileNumber(ExtractMobile(result.message))
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
                setIsVerifyingOtp(true)
                setLoading(true);
                const result = await post(endpoint, { otp: otp.join('') });
                // setMessage({ type: "success", content: MESSAGES.success.otpVerified });
                setOtpVerified(true)
                localStorage.setItem("user_uan", UAN);
                localStorage.setItem('data-cred-' + UAN, encryptData(Pws))
                setTimeout(() => {
                    navigate("/service-history");
                    setLoading(false)
                }, 1000);
            } catch (error) {
                setLoading(false);
                setOtp(Array(6).fill(""));
                setTimer(0)
                if (error?.status === 400) {
                    setMessage({ type: "error", content: MESSAGES.error.invalidOtpServer });
                } else {
                    setMessage({ type: "error", content: MESSAGES.error.generic });
                    if (error.status >= 500) {
                        navigate("/epfo-down")
                    }
                }
            }
        } else {
            setLoading(false);
            setOtp(Array(6).fill(""));
            setMessage({ type: "error", content: MESSAGES.error.invalidOtp });
        }
    };

    return (
        <div>
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                        <img className='loader-img' src={loaderGif} alt="Loading..." />
                        {!otpVerified && <p className="loader-text">{!isVerifyingOtp ? 'Checking credentials' : 'Verifying OTP and Fetching details'}</p>}
                        {otpVerified && <p className="loader-text">{'OTP Verified Successfully, Navigating to Home Screen...'}</p>}
                    </div>
                </div>
            )}
            <div className="container">
                {message.type && <ToastMessage message={message.content} type={message.type} />}
                <div className="row d-flex justify-content-center align-items-center">
                    {/* <div className="col-lg-4 col-md-8 offset-md-1 mt-2 mt-lg-0">
                        <div className='welcomeLabelLogin text-center'>
                            Welcome to India's First<br></br> Digital PF check up
                        </div>
                        <div className='EpfText mt-4 mb-3 text-center'>
                            Please Enter OTP to Begin checkup
                        </div>
                    </div> */}
                    <div className="col-lg-6 col-md-8">
                        {/* <div className="row">
                            <div className="col-sm-8 col-md-11 offset-md-1">
                                <div className="pfRiskheading text-center">Welcome to India's First Digital PF check up</div>
                                <div className="pfRiskSubHeading text-center">
                                    Please Enter OTP to Begin checkup
                                </div>
                            </div>
                        </div> */}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-sm-8 col-md-10 offset-md-1">
                                    <div className="d-flex align-items-center otpLabel" onClick={() => navigate("/")}
                                    style={{cursor:'pointer' }}>
                                        <i className="bi bi-arrow-left me-2"></i>
                                        <span>Back</span>
                                    </div>
                                    <label style={{ fontSize: '2rem', fontWeight: '400' }}>Enter OTP</label>
                                    <div className="otpLabel">
                                        OTP sent to your mobile number {mobileNumber}
                                    </div>
                                    <div className="d-flex mt-3">
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <input
                                                key={index}
                                                id={`otp-input-${index}`}
                                                type="number"
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
                                </div>
                            </div>
                            <div className="row my-lg-3 my-2">
                                <div className="col-md-10 col-sm-8 offset-md-1">
                                    <div className="text-center" style={{ fontWeight: "400", fontSize: "1rem" }}>
                                        <p className='mt-2'>Waiting for OTP ? Resend in :{timer > 1 ? <span className='otpText'> {" "}{timer}</span>
                                            :<a
                                            className="text-decoration-none otpText" style={{cursor: 'pointer'}}
                                            onClick={type === "back-screen" ? refreshOtp : resendOtp}>{" "}
                                            Resend OTP
                                        </a>}
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button
                                            type="submit"
                                            className="btn pfRiskButtons px-5"
                                            disabled={!isBtnAssessmentEnabled || timer < 1}
                                        >
                                            Submit OTP
                                        </button>
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

import '../../App.css';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import '../../css/auth/otp-verification.css';
import ToastMessage from '../common/toast-message';
import MESSAGES from '../constants/messages';
import Loader from '../common/loader';
// import Loader from '../common/scanne-loader';
// import '../../css/common/scanner-loader.css';
import { post, login } from '../common/api';
import loaderGif from './../../assets/images/otp.gif';

function OtpComponent() {
    const location = useLocation();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { UAN, Pws, type = "" } = location.state || {};
    const timeoutRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(59);

    useEffect(() => {
        if(type === "back-screen") {
            refreshOtp()
        }
        if (timeLeft === 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    //Refresh OTP
    const refreshOtp = async () => {
        if (UAN && Pws) {
            try {
                setLoading(true);
                const result = await post('auth/refresh-data',{ uan: UAN, password: Pws.trim()});
                setLoading(false);

                if (result.status === 400) {
                    setShowToast(true);
                    setToastMessage(result.message);
                    setTimeout(() => {
                        setToastMessage("")
                        setShowToast(false);
                    }, 2500);
                } else if (result.status === 401) {
                    setLoading(false);
                    localStorage.removeItem('user_uan')
                    navigate('/');
                } else {
                    setShowToast(true)
                    setToastMessage(result.message);
                    setTimeout(() => {
                        setToastMessage("")
                        setShowToast(false);
                    }, 3000);
                }
            } catch (error) {
                setLoading(false);
                setShowToast(true)
                setToastMessage(error.message);
                setTimeout(() => {
                    setToastMessage("")
                    setShowToast(false);
                }, 3000);
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
                    setShowToast(true);
                    setToastMessage(result.message);
                    setTimeout(() => {
                        setToastMessage("")
                        setShowToast(false);
                    }, 2500);
                } else {
                    setShowToast(true)
                    setToastMessage(result.message);
                    setTimeout(() => {
                        setToastMessage("")
                        setShowToast(false);
                    }, 3000);
                }
            } catch (error) {
                setLoading(false);
                setShowToast(true)
                setToastMessage(error.message);
                setTimeout(() => {
                    setToastMessage("")
                    setShowToast(false);
                }, 3000);
            }
        }
    }

    // Reset toast state
    const resetToast = useCallback(() => {
        setShowToast(false);
        setToastType('');
        setToastMessage('');
    }, []);

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current); // Cleanup timeout
    }, []);

    const handleOtpChange = useCallback((value, index) => {
        resetToast();

        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Automatically focus the next input
            if (index < 5 && value) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    }, [otp, resetToast]);

    const handleBackspace = useCallback((event, index) => {
        if (event.key === "Backspace" && otp[index] === "" && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    }, [otp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetToast();

        if (otp.every((digit) => digit)) {
            try {
                const endpoint = type === "back-screen" ? "auth/submit-otp?refresh=true" : "auth/submit-otp"
                setLoading(true);
                await post(endpoint, { otp: otp.join('') });

                setToastType('success');
                setToastMessage(MESSAGES.success.otpVerified);
                setShowToast(true);
                localStorage.setItem("user_uan", UAN);

                timeoutRef.current = setTimeout(() => {
                    navigate("/service-history");
                }, 2000);
            } catch (error) {
                setToastType('error');
                setToastMessage(error.message || MESSAGES.error.generic);
                setShowToast(true);

                timeoutRef.current = setTimeout(resetToast, 3000);
            } finally {
                setLoading(false);
            }
        } else {
            setToastType('error');
            setToastMessage(MESSAGES.error.invalidOtp);
            setShowToast(true);
        }
    };

    return (
        <div className='setBackGround'>
            {/* {loading && (
                <Loader
                    type="dots"
                    size="large"
                    color="#28a745"
                    message="Verifying OTP, please wait..."
                    overlay={true}
                />
            )} */}
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                        <img className='loader-img' src={loaderGif} alt="Loading..." />
                        <p className="loader-text">{type === "back-screen" ? 'Checking credentials' : 'Verifying OTP and Fetching details'}</p>
                    </div>
                </div>
            )}
            <div className="container">
                {showToast && <ToastMessage message={toastMessage} type={toastType} />}
                <div className="row d-flex justify-content-center align-items-center vh-100">
                    <div className="col-lg-4 col-md-8 offset-md-1 mt-2 mt-lg-0">
                        {/* <img src={pfRiskImage} alt="OTP Assessment" className="otpAssessmentImage" /> */}
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
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-input-${index}`}
                                                type="text"
                                                maxLength="1"
                                                className="otpInput form-control text-center mx-1 mt-2"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                                onKeyDown={(e) => handleBackspace(e, index)}
                                                aria-label={`OTP input ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        {timeLeft > 1 ? <p className='text-danger mb-0'>OTP expires in {timeLeft} seconds.</p>
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
                                <div className="col-md-10 col-sm-8 offset-md-1">
                                    <button type="submit" className="btn w-100 pfRiskButtons">
                                        Start Assessment
                                    </button>
                                    <div className='text-center'>
                                    <span className='termConditionText d-inline-block mt-1'>By Cliking on continue you allow Finright to use your EPF account 
                                        data to provide you best possible guidance and agree to the <br></br>
                                        <span style={{fontWeight:"700"}}>Terms & Conditions</span>
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

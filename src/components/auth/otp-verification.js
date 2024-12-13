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
import { post } from '../common/api';

function OtpComponent() {
    const location = useLocation();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { uan } = location.state || {};
    const timeoutRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(60);
    useEffect(() => {
        if (timeLeft === 0) return; // Stop countdown when timeLeft reaches 0
    
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1); // Decrease time by 1 every second
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup the interval on component unmount
      }, [timeLeft]); // Re-run effect when timeLeft changes

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
                setLoading(true);
                await post('auth/submit-otp', { otp: otp.join('') });

                setToastType('success');
                setToastMessage(MESSAGES.success.otpVerified);
                setShowToast(true);
                localStorage.setItem("user_uan", uan);

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
        <>
            {loading && (
                <Loader
                    type="dots"
                    size="large"
                    color="#28a745"
                    message="Verifying OTP, please wait..."
                    overlay={true}
                />
            )}
            <div className="container">
                {showToast && <ToastMessage message={toastMessage} type={toastType} />}
                <div className="row d-flex justify-content-center align-items-center vh-100">
                    <div className="col-lg-4 col-md-6 mt-2 mt-lg-0">
                        <img src={pfRiskImage} alt="OTP Assessment" className="otpAssessmentImage" />
                    </div>
                    <div className="col-lg-6 col-md-8">
                        <div className="row">
                            <div className="col-sm-8 col-md-10 offset-md-1">
                                <div className="pfRiskheading text-center">PF Risk Assessment</div>
                                <div className="pfRiskSubHeading text-center">
                                    Check if your PF is at risk of getting stuck
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-sm-8 col-md-10 offset-md-1">
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
                                    <p className='text-danger mb-0'>OTP expires in {timeLeft} seconds.</p>
                                    <a
                                        className="text-decoration-none labelSubHeading"
                                        href="www.google.com"
                                        onClick={(e) => e.preventDefault()}>
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
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OtpComponent;

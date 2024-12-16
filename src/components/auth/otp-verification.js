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
import loaderGif from './../../assets/images/scanner.gif';

function OtpComponent() {
    const location = useLocation();
    const navigate = useNavigate();

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { UAN, Pws } = location.state || {};
    const timeoutRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(59);
    useEffect(() => {
        console.log("UAN number is get", UAN, Pws);

        if (timeLeft === 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    //Resend OTP

    const resendOtp = async (event) => {
        event.preventDefault();
        if (UAN && Pws) {
            try {
                setLoading(true);
                const result = await login(UAN, Pws.trim());
                setLoading(false);

                if (result.status === 400) {
                    console.log("Hit login successfully");
                    setToastMessage({ type: "error", content: result.message });
                    setTimeout(() => setToastMessage({ type: "", content: "" }), 2500);
                } else {
                    setToastMessage({ type: "success", content: "OTP send successfully" });
                    setTimeout(() => setToastMessage({ type: "", content: "" }), 3000);
                }
            } catch (error) {
                setLoading(false);
                setToastMessage({ type: "error", content: error.message });
                setTimeout(() => setToastMessage({ type: "", content: "" }), 3000);
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

        // setLoading(true);
        // setTimeout(() => {
        //     setLoading(false);
        // }, 3000);


        if (otp.every((digit) => digit)) {
            try {
                setLoading(true);
                await post('auth/submit-otp', { otp: otp.join('') });

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
                        <p className="loader-text">Verifying OTP and Fetching details</p>
                    </div>
                </div>
            )}
            <div className="container">
                {showToast && <ToastMessage message={toastMessage} type={toastType} />}
                <div className="row d-flex justify-content-center align-items-center vh-100">
                    <div className="col-lg-4 col-md-6 mt-2 mt-lg-0">
                        {/* <img src={pfRiskImage} alt="OTP Assessment" className="otpAssessmentImage" /> */}
                        <div className='welcomeLabelLogin'>
                            Welcome to India's First<br></br> Digital PF check up
                        </div>
                        <div className='EpfText mt-4 mb-3'>
                            Please Enter OTP to Begin checkup
                        </div>
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
                                        {timeLeft > 1 ? <p className='text-danger mb-0'>OTP expires in {timeLeft} seconds.</p>
                                            : <p className='text-danger mb-0'>OTP expired</p>}
                                        <a
                                            className="text-decoration-none labelSubHeading"
                                            onClick={resendOtp} style={{ cursor: "pointer" }}>
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

import React, { useState, useEffect } from 'react';
import '../../App.css';
import '../../css/report/report-registation.css';
import ReportCard from "../common/report-card";
import { useNavigate, useLocation } from 'react-router-dom';
import ToastMessage from './../common/toast-message';
import { post } from '../common/api';
import { encryptData } from '../common/encryption-decryption';

function ReportOtp() {
    const otpLength = 6;
    const location = useLocation();
    const { profileData, home, mobileNumber } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [otpValues, setOtpValues] = useState(Array(otpLength).fill(""));
    const [timer, setTimer] = useState(59);
    const [triggerApiCall, setTriggerApiCall] = useState(false);
    const navigate = useNavigate();

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
            reSendOtp();
        }
    }, [triggerApiCall]);

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


    const reSendOtp = async () => {
        const transformedNumber = {
            ...mobileNumber,
            phoneNumber: `91${mobileNumber.phoneNumber}`,
        };
        try {
            setLoading(true);
            const response = await post('/auth/generate-otp', transformedNumber);
            setLoading(false);
            if (response.status === 401) {
                localStorage.removeItem('user_uan')
                navigate('/');
                setLoading(false);
            } else {
                setLoading(false);
                setTimer(59);
                setTriggerApiCall(false);
                navigate('/report-otp', { state: { profileData, home, mobileNumber } })
            }
        } catch (error) {
            if (error.status >= 500) {
                setLoading(false);
                setTriggerApiCall(false);
                navigate("/epfo-down")
            } else {
                setLoading(false);
                setTriggerApiCall(false);
                console.error("Error fetching data:", error);
            }
        }
    }

    const handleRendOtpClick = () => {
        setTriggerApiCall(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = otpValues.join("");
        try {
            const response = await post('/auth/confirm-otp', { otp: otp });
            if (response.status === 401) {
                localStorage.removeItem('user_uan')
                navigate('/');
            } else {
                const uan = localStorage.getItem('user_uan')
                localStorage.removeItem('data-for-report-reg-' + uan)
                const encodedData = encryptData(JSON.stringify({profileData, home, mobileNumber}));
                localStorage.setItem('data-for-report-submit-' + uan, encodedData);
                navigate("/report-submit", { state: { profileData, home, mobileNumber } });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    return (
        <div className="container">
            {message.type && <ToastMessage message={message.content} type={message.type} />}
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-5 col-md-8 mt-2 mt-lg-0">
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='row'>
                                <div className='col-md-10 offset-md-1'>
                                    <ReportCard profileData={profileData} homeData={home}></ReportCard>
                                </div>
                            </div>
                            <div className="text-center mb-4 mt-3">
                                <p className="welcomeLabelLogin">Your report regeneration is in progress</p>
                                <p className="pfRiskSubHeading">
                                    Thank you for providing your information, we<br></br> have started preparing your report.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex">
                                    {Array.from({ length: otpLength }).map((_, index) => (
                                        <input
                                            key={index}
                                            id={`otp-input-${index}`}
                                            type="text"
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
                                        Verify Number
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Second column  */}
                <div className="col-lg-4 col-md-8 mt-2 mt-lg-0 ms-0 ms-lg-5">
                    <div className='row'>
                        <div className='col-md-12 bg-image p-0'>
                            <div className='overlayImage text-white'>
                                <p> Evaluate your provident fund across 25 checks done by EPFO</p>
                                <p className='my-4'>Know if your money is at risk of getting stuck</p>
                                <p className='mb-4'>Identify how much of your corpus is blocked by issues</p>
                                <p>Get an estimated time to resolve these issues</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportOtp;
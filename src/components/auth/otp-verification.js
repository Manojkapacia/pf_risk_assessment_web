import '../../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import '../../css/auth/otp-verification.css'
import ToastMessage from '../common/toast-message';
import MESSAGES from '../constants/messages'

function OtpComponent() {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('success');
    const [toastMessage, setToastMessage] = useState('');

    const navigate = useNavigate();

    const handleOtpChange = (element, index) => {
        setShowToast(false);
        setToastType('success')

        if (/^[0-9]$/.test(element.value)) {
            const newOtp = [...otp];
            newOtp[index] = element.value;
            setOtp(newOtp);

            // Move to the next field if it exists
            if (index < 5) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        } else {
            element.value = ""; // Clear if non-digit is entered
        }
    };

    // Handler for backspace to focus previous input field
    const handleBackspace = (event, index) => {
        if (event.key === "Backspace" && otp[index] === "" && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if all OTP fields are filled
        const isOtpValid = otp.every((digit) => digit !== "");

        if (isOtpValid) {
            setShowToast(true);
            setToastType('success')
            setToastMessage(MESSAGES.success.otpVerified)
            setTimeout(() => {
                navigate("/search");
            }, 2000);
        } else {
            setShowToast(true);
            setToastType('error')
            setToastMessage(MESSAGES.error.invalidOtp)
        }
    };

    return (
        <div className="container-fluid">
            {showToast && <ToastMessage message={toastMessage} type={toastType} />}
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-8 offset-lg-1 mt-2 mt-lg-0">
                    <img src={pfRiskImage} alt="OTP Assessment" className='otpAssessmentImage'/>
                </div>
                <div className="col-lg-7">
                    <div className="pfRiskheading text-center">PF Risk Assessment</div>
                    <div className='pfRiskSubHeading text-center'>
                        Check if your PF is at risk of getting stuck
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-sm-8 col-md-6 offset-md-3">
                                <div className="labelHeading mt-2 mt-lg-5 pt-lg-3">
                                    Enter OTP send to your EPF registered number
                                </div>
                                <div className="d-flex ">
                                    {otp.map((_, index) => (
                                        <input
                                            key={index}
                                            id={`otp-input-${index}`}
                                            type="text"
                                            maxLength="1"
                                            className="form-control text-center mx-1 mt-2"
                                            value={otp[index]}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onKeyDown={(e) => handleBackspace(e, index)}
                                        />
                                    ))}
                                </div>
                                <a
                                    className="text-decoration-none labelSubHeading mt-2 float-end"
                                    href="https://chatgpt.com"
                                    onClick={(e) => { e.preventDefault(); }}>
                                    Resend OTP
                                </a>
                            </div>
                        </div>

                        <div className="row my-2 mt-lg-5 pt-lg-4">
                            <div className="col-md-6 col-sm-8 offset-md-3">
                                <button type="submit"
                                    className="btn w-100 pfRiskButtons">
                                    Start Assessment
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default OtpComponent;
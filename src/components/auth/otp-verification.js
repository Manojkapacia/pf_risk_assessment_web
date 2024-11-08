import '../../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
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
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            {showToast && <ToastMessage message={toastMessage} type={toastType} />}
            <div className="row w-100 mx-2 align-items-center">
                <div className="col-lg-1"></div>
                <div className="col-lg-4 d-flex justify-content-center">
                    <img src={pfRiskImage} alt="Risk Assessment" style={{ maxHeight: "450px", width: "100%" }} />
                </div>
                <div className="col-lg-7 d-flex flex-column justify-content-center align-items-center">
                    <div className="pfRiskheading">PF Risk Assessment</div>
                    <div className='pfRiskSubHeading'>
                        Check if your PF is at risk of getting stuck
                    </div>
                    <div className="labelHeading mt-5">
                        Enter OTP send to your EPF registered number
                    </div>
                    <form className="w-100 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                        <div className="row mt-4 w-100 justify-content-center">
                            <div className="col-12 col-md-6">
                                <div className="d-flex justify-content-center">
                                    {otp.map((_, index) => (
                                        <input
                                            key={index}
                                            id={`otp-input-${index}`}
                                            type="text"
                                            maxLength="1"
                                            className="form-control text-center mx-1 mt-3"
                                            style={{ width: "3.6rem", height: "3.6rem" }}
                                            value={otp[index]}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onKeyDown={(e) => handleBackspace(e, index)}
                                        />
                                    ))}
                                </div>
                                <a
                                    className="text-decoration-none labelSubHeading mt-3 float-end"
                                    href="https://chatgpt.com"
                                    onClick={(e) => { e.preventDefault(); }}>
                                    Resend OTP
                                </a>
                            </div>
                        </div>

                        <div className="row mt-4 w-100 justify-content-center">
                            <div className="col-12 col-md-6">
                                <button
                                    type="submit"
                                    className="btn col-12 pfRiskButtons"
                                    >
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
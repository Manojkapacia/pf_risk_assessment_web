import "../../App.css";
import "../../css/create-account/otp-create-account.css";
import createAccount from "../../assets/images/createAccount.png";
import React, { useState } from 'react';

function OtpCreateAccount() {
    const [otp, setOtp] = useState(new Array(6).fill(""));

    // Handle input change
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value)) { // Allow only digits
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Focus the next input if it's not the last one
            if (index < otp.length - 1) {
                e.target.nextSibling.focus();
            }
        }
    };

    // Handle key press (for backspace to focus previous input)
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                e.target.previousSibling.focus();
            }
        }
    };

    // Handle paste for pasting the OTP
    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("Text").slice(0, 6);
        if (/^\d{6}$/.test(pasteData)) {
            setOtp(pasteData.split(""));
        }
        e.preventDefault();
    };

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-4 col-md-6  mt-4 mt-lg-0">
                    <img src={createAccount} alt="OTP Account" className='accountImage' />
                </div>

                <div className="col-lg-6 col-md-8">
                    <div className="row">
                        <div className="col-sm-8 col-md-10 offset-md-1">
                            <div className="pfRiskheading text-center">Create Account to Proceed</div>
                            <div className='pfRiskSubHeading text-center'>
                                Please login to view all critical issues and their solutions
                            </div>
                        </div>
                    </div>
                    <form>
                        <div className="row">
                            <div className="col-sm-8 col-md-10 offset-md-1">
                                <div className="otpCreateLabel mt-2 mt-lg-5 pt-lg-3">
                                    Enter OTP send to your EPF registered number
                                </div>

                                <div className="d-flex">
                                    {otp.map((value, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={value}
                                            maxLength="1"
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onPaste={handlePaste}
                                            className=" otpInput form-control mx-1 mt-2 text-center"
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
                        <div className="row my-2 mt-md-5 pt-lg-4">
                            <div className="col-sm-8 col-md-10 offset-md-1">
                                <button type="submit"
                                    className="btn w-100 pfRiskButtons">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default OtpCreateAccount;
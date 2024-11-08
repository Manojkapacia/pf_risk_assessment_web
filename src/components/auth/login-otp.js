import '../../App.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import pfRiskImage from '../../images/pf-risk-analyzer.png';

function OtpComponent() {

    const [otp, setOtp] = useState(Array(6).fill(""));

    const handleChange = (element, index) => {
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

    return (
        <div className="container">
            <div className="row mt-5 pt-5">
                <div className="col-md-4 col-8 offset-2 offset-md-0">
                    <div className="pfRiskheading">PF Risk Assessment</div>
                    <div className='pfRiskSubHeading'>
                        Check if your PF is at risk of getting stuck
                    </div>
                    <div className="labelHeading mt-5">
                        Enter OTP send to your EPF registered number
                    </div>

                    <div className="d-flex flex-column">
                        <div className="d-flex">
                            {otp.map((_, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    maxLength="1"
                                    className="form-control text-center mx-1 mt-3"
                                    style={{ width: "2.6rem", height: "2.6rem" }}
                                    value={otp[index]}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleBackspace(e, index)}
                                />
                            ))}
                        </div>
                        <a className="text-decoration-none labelSubHeading mt-3" href="https://chatgpt.com"
                            onClick={(e) => { e.preventDefault(); }} style={{ marginLeft: '7rem' }}>Resend OTP</a>
                    </div>

                    <div className='row mt-5'>
                        <div className='col-md-12'>
                            <button className='col-12 btn pfRiskButtons'>
                                <nav>
                                    <Link className='text-decoration-none nav-link' to="/search">
                                        Start Assessment
                                    </Link>
                                </nav>
                            </button>
                        </div>
                    </div>

                </div>

                <div className="col-md-5 offset-md-3">
                    <img src={pfRiskImage} alt="Risk Assessment" height="350rem" width='100%' />
                </div>
            </div>
        </div>
    )
}

export default OtpComponent;
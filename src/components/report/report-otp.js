import '../../App.css';
import '../../css/report/report-registation.css';
import React from 'react';
import ReportCard from "../common/report-card";

function ReportOtp() {
    const otpLength = 6;
    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-5 col-md-8">
                    <ReportCard></ReportCard>
                </div>

                {/* Second column  */}

                <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        <div className='col-md-10 offset-md-1'>
                            <div className="text-center mb-4">
                                <p className="welcomeLabelLogin">Your report regeneration is in progress</p>
                                <p className="pfRiskSubHeading">
                                    Thank you for providing your information, we<br></br> have started preparing your report.
                                </p>
                            </div>
                            <div className="d-flex">
                                {Array.from({ length: otpLength }).map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input-${index}`}
                                        type="text"
                                        maxLength="1"
                                        className="otpInput form-control text-center mx-1 mt-2"
                                        value={digit}
                                    // onChange={(e) => handleOtpChange(e.target.value, index)}
                                    // onKeyDown={(e) => handleBackspace(e, index)}
                                    // aria-label={`OTP input ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <a
                                className="text-decoration-none labelSubHeading float-end mt-2"
                                style={{ cursor: "pointer" }}>
                                Resend OTP
                            </a>

                            <div className='text-center mt-5'>
                                <button className="pfRiskButtons py-2 px-5">
                                    Verify Number
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportOtp;
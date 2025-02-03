import React, { useState } from "react";
import './../../css/summary/user-mobile-registation.css';
import Stepper from "./stapperNext";

function UserMobileRegistation() {
    const [currentStep, setCurrentStep] = useState(0);
    const otpLength = 6;
    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-6 col-md-8">
                    <div className="row">
                        <div className="col-sm-8 col-md-10 offset-md-1">
                            <div className="d-flex align-items-center otpLabel mb-2"
                                style={{ cursor: 'pointer' }}>
                                <i className="bi bi-arrow-left me-2"></i>
                                <span>Back</span>
                            </div>
                            <Stepper currentStep={currentStep} />
                            {/* <button onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 2))}>
                                Next Step
                            </button> */}
                            <label style={{ fontSize: '2rem', fontWeight: '400' }}>Registration </label>
                            <div className="otpLabel mt-2">
                                Enter Your Mobile Number
                            </div>
                            <input
                                type="text"
                                className="form-control mobileInputField mt-4"
                                placeholder="Mobile Number" autoComplete='off' name="number" />
                            <div className="d-flex justify-content-start mt-5">
                                <button
                                    type="submit"
                                    className="btn pfRiskButtons px-5"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8 col-md-10 offset-md-1 mt-3">
                            <div className="otpLabel">
                                OTP sent to your mobile number xxxxxxx789
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
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default UserMobileRegistation
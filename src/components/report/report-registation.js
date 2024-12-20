import '../../App.css';
import '../../css/report/report-registation.css';
import React from 'react';
import ReportCard from "../common/report-card";
import { Whatsapp } from "react-bootstrap-icons";

function ReportRegistation() {
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

                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your WhatsApp number"
                                    aria-label="WhatsApp number"
                                />
                                <span className="input-group-text bg-white">
                                    <Whatsapp className="text-success" />
                                </span>
                            </div>
                            <div className='text-center'>
                                <button className="pfRiskButtons py-2 px-5">
                                    Verify Number
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <p className="reportWhatsappText">
                                    Please share your WhatsApp number, <br /> You will get your report in 4 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportRegistation;
import '../../App.css';
import React from 'react';
import ReportCard from "../common/report-card";
import perfect from "../../assets/images/perfect.png";
import { useLocation } from 'react-router-dom';

function ReportSubmit() {
    const location = useLocation();
    const { profileData, home } = location.state || {};

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-5 col-md-8">
                    <ReportCard profileData={profileData} homeData={home}></ReportCard>
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
                        <div className="text-center mb-4">
                        <img src={perfect} alt='loading' height="100rem" width="100rem"></img>
                        </div>
                        <div className="text-center mt-4">
                                <p className="reportWhatsappText">
                                Perfect!!<br></br> Thank you for sharing your details, we will<br></br> share your report within 4 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportSubmit;
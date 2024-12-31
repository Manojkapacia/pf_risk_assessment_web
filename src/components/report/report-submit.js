import '../../App.css';
import '../../css/report/report-registation.css';
import React from 'react';
import ReportCard from "../common/report-card";
import perfect from "../../assets/images/perfect.png";
import { useLocation } from 'react-router-dom';
import reportImage from "./../../assets/images/report.png";
import { getReportSubmissionMessage } from '../common/time-formatter';

function ReportSubmit() {
    const location = useLocation();
    const { profileData, home } = location.state || {};
    const reportMessage = getReportSubmissionMessage()

    const handleDownload = () => {
        const pdfPath = "/PFCheck-up-Report.pdf";
        const link = document.createElement("a");
        link.href = pdfPath;
        link.download = "PF-Check-up-Report.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-4 col-md-8 mt-2 mt-lg-0">
                    <div className="card1 position-relative">
                        <div
                            className="card-body text-center p-0"
                            style={{ backgroundColor: "#E5F0F4", height: "35.2rem", borderRadius: "1rem", border: "1px solid #0E0E0E" }}>
                            <h2 className="pt-3">Provident Fund Check-up</h2>
                            <img
                                src={reportImage} alt="Report" className="img-fluid"
                                style={{ width: "90%", height: "29rem" }} />
                            <div
                                className="blue-section d-flex justify-content-center align-items-center"
                                style={{
                                    backgroundColor: "#04184a", height: "5rem", width: "100%", marginBottom: "0.05rem",
                                    position: "absolute", bottom: 0, borderBottomLeftRadius: "1rem", boxShadow: "0 -1rem 1rem -0.20rem rgba(0, 0, 0, 0.4)",
                                    borderBottomRightRadius: "1rem"
                                }}>
                                <button
                                    className="btn" onClick={handleDownload}
                                    style={{
                                        backgroundColor: "#ffffff", color: "#000000",
                                        borderRadius: "2rem", fontWeight: "bold",
                                        padding: "0.6rem 1.5rem"
                                    }}>
                                    Download Sample Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second column  */}

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
                            <div className="text-center mb-4">
                                <img src={perfect} alt='loading' height="100rem" width="100rem"></img>
                            </div>
                            <div className="text-center mt-4">
                                <p className="reportWhatsappText">
                                    Perfect!! Thank you for sharing your details, we will<br></br> {reportMessage}
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
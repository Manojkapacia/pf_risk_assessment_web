import '../../App.css';
import '../../css/report/report-registation.css';
import React, { useEffect } from 'react';
import ReportCard from "../common/report-card";
import perfect from "../../assets/images/perfect.png";
import { useLocation } from 'react-router-dom';
import { zohoRequest } from "./../common/api";
import reportImage from "./../../assets/images/report.png";

function ReportSubmit() {
    const location = useLocation();
    const { profileData, home, mobileNumber } = location.state || {};

    useEffect(() => {
        const formData = {
            Last_Name: profileData?.basicDetails?.fullName,
            Mobile: mobileNumber?.phoneNumber,
            Email: "",
            Wants_To: "Withdrawal Checkup",
            Lead_Status: "Open",
            Lead_Source: "",
            Campaign_Id: ""
        };
        const ZohoAPi = async (formData) => {
            try {
                const result = await zohoRequest(formData);
                if (result.data.data[0].status === "success") {
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
        ZohoAPi(formData);
    }, []);

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
                <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        <div className='col-md-10 offset-md-1'>
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
                                    Perfect!!<br></br> Thank you for sharing your details, we will<br></br> share your report within 4 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Second column  */}
                <div className="col-lg-5 col-md-8">
                    <div className="card1 position-relative">
                        <div
                            className="card-body text-center p-0"
                            style={{backgroundColor: "#4880FF",height: "37.5rem",borderRadius: "1rem"}}>
                            <h2 className="pt-3">Provident Fund Check-up</h2>
                            <img
                                src={reportImage}alt="Report"className="img-fluid" 
                                style={{ width: "90%", height: "32rem" }}/>
                            <div
                                className="blue-section d-flex justify-content-center align-items-center"
                                style={{
                                    backgroundColor: "#004b8d",height: "5rem", width: "100%",
                                    position: "absolute",bottom: 0,borderBottomLeftRadius: "1rem",
                                    borderBottomRightRadius: "1rem"}}>
                                <button
                                    className="btn" onClick={handleDownload}
                                    style={{backgroundColor: "#ffffff", color: "#000000",
                                        borderRadius: "2rem",fontWeight: "bold",
                                        padding: "0.6rem 1.5rem"}}>
                                    Download Sample Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ReportSubmit;
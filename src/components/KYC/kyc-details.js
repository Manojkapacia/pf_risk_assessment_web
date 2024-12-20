import '../../App.css';
import '../../css/KYC/kyc-details.css';
import React from 'react';
import { CheckCircle, XCircle } from "react-bootstrap-icons";

function KycDetails() {
    const kycData = [
        { label: "Full Name", value: "ASHIRWAD TOMAR" },
        { label: "Date of Birth", value: "17-11-1993"},
        { label: "Gender", value: "MALE", isValid: true },
        { label: "Father’s Name", value: "Darshan Pal" },
        { label: "Physically Handicapped?", value: "No"},
    ];

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-8">
                    <div className='row'>
                        <div className='col-md-8 mt-2 mt-sm-0'>
                            <div className='welcomeLabelLogin mb-md-4'>
                                Step 1
                            </div>
                            <span className='EpfText'>Please check if these details match with your Adhaar Card and PAN Card </span>
                        </div>
                    </div>
                </div>

                {/* Second column  */}

                <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        <div className='col-md-10 offset-md-1'>
                            <span className='welcomeLabelLogin d-flex justify-content-center mb-3' style={{ fontWeight: "600" }}>Check KYC Details</span>
                            {kycData.map((item, index) => (
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group">

                                        <div key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <div>
                                                <span className="kycLabel">{item.label}</span>
                                                <div className="kycValue">{item.value}</div>
                                            </div>
                                            <div>
                                            <CheckCircle className="text-success fs-5 me-4" />
                                            <XCircle className="text-danger fs-5" />
                                                     {/* <span className="selectSeccess">
                                                         <CheckCircle className="text-white fs-5" />
                                                     </span>
                                                     <span className="selectSeccess" style={{backgroundColor:" #FA3E3E"}}>
                                                         <XCircle className="text-white fs-5" />
                                                     </span> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn col-12 pfRiskButtons mt-2">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default KycDetails;
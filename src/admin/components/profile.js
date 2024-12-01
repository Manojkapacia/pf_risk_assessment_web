import React from "react";
import { ArrowLeft } from 'react-bootstrap-icons';

function Profile({ jsonData, onBack }) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2 mt-5">

                    <div class="card mt-3">
                        <div className="d-flex justify-content-between align-items-center mt-2 ms-2">
                            {/* <button className="btn" style={{
                                color: '#ffffff',
                                backgroundColor: '#2f6870'
                            }} onClick={onBack}>Back</button> */}
                            <button className="btn p-0 d-flex align-items-center"  onClick={onBack}>
                                <ArrowLeft size={20} className="me-1" /> Back
                            </button>
                            <h3 className="text-center flex-grow-1">Profile</h3>
                            <div style={{ width: '3.1rem' }}></div>
                        </div>
                        <div class="card-body">
                            <p><strong>UAN:</strong> {jsonData.data.profile.UAN}</p>
                            <p><strong>Full Name:</strong> {jsonData.data.profile.fullName}</p>
                            <p><strong>Phone:</strong> {jsonData.data.profile.phone}</p>
                            <p><strong>Email:</strong> {jsonData.data.profile.email}</p>
                            <div className="accordion" id="accordionExample">
                                {/* Accordion Item 1 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-expanded="false"
                                            aria-controls="collapseOne"
                                        >
                                            <strong>BasicDetails:</strong>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseOne"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="headingOne"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <p><strong>Full Name:</strong> {jsonData.data.profile.basicDetails.fullName}</p>
                                            <p><strong>DOB:</strong> {jsonData.data.profile.basicDetails.dateOfBirth}</p>
                                            <p><strong>Gender:</strong> {jsonData.data.profile.basicDetails.gender}</p>
                                            <p><strong>Father's Name:</strong> {jsonData.data.profile.basicDetails.fatherHusbandName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Accordion Item 2 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headnigTwo">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-expanded="false"
                                            aria-controls="collapseTwo"
                                        >
                                            <strong>KYC Details:</strong>
                                        </button>
                                    </h2>
                                    <div
                                        id="collapseTwo"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="headingTwo"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <p><strong>Aadhar Card:</strong> {jsonData.data.profile.kycDetails.aadhaar}</p>
                                            <p><strong>Pan Card:</strong> {jsonData.data.profile.kycDetails.pan}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
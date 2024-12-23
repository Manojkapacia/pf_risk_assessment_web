import '../../App.css';
import '../../css/KYC/kyc-details.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from "react-bootstrap-icons";

function KycDetails() {
    const location = useLocation();
    const navigate = useNavigate()

    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [showFullAccountNumber, setShowFullAccountNumber] = useState(false);
    const [kycStatus, setKycStatus] = useState({
        fullName: true,
        dateOfBirth: true,
        gender: true,
        fatherHusbandName: true,
        physicallyHandicapped: true,
        bankAccountNumber: true,
        bankIFSC: true
    });
    const { selectedOrg, uan, type, reportUpdatedAtVar, profileData,home } = location.state || {};

    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');
        let value = "kyc-details";
        localStorage.setItem(dynamicKey, value);
    }, [])

    const toggleAccountVisibility = () => {
        setShowFullAccountNumber(!showFullAccountNumber);
    };

    const formatAccountNumber = (account) => {
        if (account && account.length > 4) {
            return `${account.slice(0, 2)}XXXXXXXXXX${account.slice(-2)}`;
        }
        return account;
    };

    const handleKycDetailsSubmit = async () => {
        if(!showAccountDetails) {
            setShowAccountDetails(true);
        } else {
            localStorage.removeItem('data-for-org-' + uan)
            localStorage.removeItem('data-for-kyc-' + uan)
            const data = { selectedOrg, uan, type, reportUpdatedAtVar, kycStatus };
            const encodedData = btoa(JSON.stringify(data));
            localStorage.setItem('data-for-scan-' + uan, encodedData);
            navigate('/doc-scan', {state: { selectedOrg, uan, type, reportUpdatedAtVar, kycStatus }})
        }

    };
    const handleSubAccDetails = async () => {
        navigate("/report-registation",{ state: {profileData, home}})
    };

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center vh-100">
                <div className="col-lg-4 col-md-8">
                    <div className='row'>
                        {showAccountDetails ? (
                            <div className='col-md-8 mt-2 mt-sm-0'>
                                <div className='welcomeLabelLogin mb-md-4'>
                                    Step 4
                                </div>
                                <span className='EpfText'>Please Verify your Bank Account Details</span>
                            </div>
                        ) : (
                            <div className='col-md-8 mt-2 mt-sm-0'>
                                <div className='welcomeLabelLogin mb-md-4'>
                                    Step 3
                                </div>
                                <span className='EpfText'>Please check if these details match with your Adhaar Card and PAN Card </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Second column  */}

                <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        {showAccountDetails ? (
                            <>
                            <div className='col-md-10 offset-md-1'>
                                <span className='welcomeLabelLogin d-flex justify-content-center mb-3' style={{ fontWeight: "600" }}>
                                    Select the detail that does not match your Bank Account</span>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group" style={{border: kycStatus.bankAccountNumber ? "none" : "2px solid red"}}
                                            onClick={() =>
                                                setKycStatus((prev) => ({
                                                    ...prev,
                                                    bankAccountNumber: !prev.bankAccountNumber,
                                                }))
                                            }>
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="kycLabel">A/c Number</span>
                                                <div className="kycValue">
                                                    {showFullAccountNumber ? profileData?.kycDetails?.bankAccountNumber
                                                        : formatAccountNumber(profileData?.kycDetails?.bankAccountNumber)}
                                                        {profileData?.kycDetails?.bankAccountNumber !== '-' && (showFullAccountNumber ? (
                                                <EyeSlash className="text-primary fs-5 ms-3" onClick={toggleAccountVisibility} />
                                            ) : (
                                                <Eye className="text-primary fs-5 ms-3"
                                                    onClick={toggleAccountVisibility} />
                                            ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group" style={{border: kycStatus.bankIFSC ? "none" : "2px solid red"}}
                                            onClick={() =>
                                                setKycStatus((prev) => ({
                                                    ...prev,
                                                    bankIFSC: !prev.bankIFSC,
                                                }))
                                            }>
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="kycLabel">IFSC Number</span>
                                                <div className="kycValue">{profileData?.kycDetails?.bankIFSC}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" onClick={handleSubAccDetails}
                                    className="btn col-12 pfRiskButtons mt-2">
                                    Confirm Details
                                </button>
                            </>
                        ) : (
                            <>
                                <div className='col-md-10 offset-md-1'>
                                    <span className='welcomeLabelLogin d-flex justify-content-center mb-3' style={{ fontWeight: "600" }}>
                                    Select the detail that does not match your PAN & Aadhaar</span>
                                    <div className="card card-bottom-shadow border-0 mb-2">
                                        <div className="list-group" style={{border: kycStatus.fullName ? "none" : "2px solid red"}}
                                            onClick={() =>
                                                setKycStatus((prev) => ({
                                                    ...prev,
                                                    fullName: !prev.fullName,
                                                }))
                                            }>
                                            <div className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="kycLabel">Full Name</span>
                                                    <div className="kycValue">{profileData?.basicDetails?.fullName}</div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card card-bottom-shadow border-0 mb-2">
                                        <div className="list-group" style={{border: kycStatus.dateOfBirth ? "none" : "2px solid red"}}
                                            onClick={() =>
                                                setKycStatus((prev) => ({
                                                    ...prev,
                                                    dateOfBirth: !prev.dateOfBirth,
                                                }))
                                            }>
                                            <div className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="kycLabel">Date of Birth</span>
                                                    <div className="kycValue">{profileData?.basicDetails?.dateOfBirth}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card card-bottom-shadow border-0 mb-2">
                                        <div className="list-group" style={{border: kycStatus.gender ? "none" : "2px solid red"}}
                                            onClick={() =>
                                                setKycStatus((prev) => ({
                                                    ...prev,
                                                    gender: !prev.gender,
                                                }))
                                            }>
                                            <div className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="kycLabel">Gender</span>
                                                    <div className="kycValue">{profileData?.basicDetails?.gender === "M" ? "Male" : "Female"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card card-bottom-shadow border-0 mb-2">
                                        <div className="list-group" style={{border: kycStatus.fatherHusbandName ? "none" : "2px solid red"}}
                                            onClick={() =>
                                                setKycStatus((prev) => ({
                                                    ...prev,
                                                    fatherHusbandName: !prev.fatherHusbandName,
                                                }))
                                            }>
                                            <div className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    {profileData?.basicDetails?.relation === "F" ? (<span className="kycLabel"> Father's Name</span>)
                                                        : (<span className="kycLabel"> Husband's Name</span>)}
                                                    <div className="kycValue">{profileData?.basicDetails?.fatherHusbandName}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card card-bottom-shadow border-0 mb-2">
                                        <div className="list-group" style={{border: kycStatus.physicallyHandicapped ? "none" : "2px solid red"}}
                                            onClick={() =>
                                                setKycStatus((prev) => ({
                                                    ...prev,
                                                    physicallyHandicapped: !prev.physicallyHandicapped,
                                                }))
                                            }>
                                            <div className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="kycLabel">Physically Handicapped?</span>
                                                    <div className="kycValue">{profileData?.basicDetails?.physicallyHandicapped === "N" ? "None" : "Yes"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={handleKycDetailsSubmit}
                                    className="btn col-12 pfRiskButtons mt-2">
                                    Confirm Details
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KycDetails;
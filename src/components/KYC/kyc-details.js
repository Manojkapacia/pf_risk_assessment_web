import '../../App.css';
import '../../css/KYC/kyc-details.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function KycDetails() {
    const location = useLocation();
    const navigate = useNavigate()
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(false);

    const [kycStatus, setKycStatus] = useState({
        fullName: true,
        gender: true,
        fatherHusbandName: true,
        physicallyHandicapped: true,
        UAN: true,
        dateOfBirth: true,
        aadhaar: true,
        pan: true
    });
    const maskAdharNumber = (number) => {
        if (number) {
            const lastFourDigits = number.slice(-4);
            return `XXXXXXXX${lastFourDigits}`;
        }
    };
    const maskPanNumber = (number) => {
        if (number) {
            const lastFourDigits = number.slice(-4);
            return `XXXXXX${lastFourDigits}`;
        }
    };

    const handleIncorrect = () => {
        const fieldsToCheck = ['fullName', 'gender', 'fatherHusbandName', 'physicallyHandicapped', 'UAN', 'dateOfBirth', 'aadhaar', 'pan'];
        setKycStatus((prev) => {
            const updatedStatus = { ...prev };
            fieldsToCheck.forEach((field) => {
                if (field === 'UAN') {
                    if (profileData?.profile?.[field] === '-') {
                        updatedStatus[field] = false;
                    }
                } else if (field === 'aadhaar' || field === 'pan') {
                    if (profileData?.kycDetails?.[field] === '-') {
                        updatedStatus[field] = false;
                    }
                } else {
                    if (profileData?.basicDetails?.[field] === '-') {
                        updatedStatus[field] = false;
                    }
                }
            });
            return updatedStatus;
        });
        setShowCheckbox(true)
        setShowContinueButton(true);
    };

    const handleCorrect = () => {
        const fieldsToCheck = ['fullName', 'gender', 'fatherHusbandName', 'physicallyHandicapped', 'UAN', 'dateOfBirth', 'aadhaar', 'pan'];
        setKycStatus((prev) => {
            const updatedStatus = { ...prev };
            fieldsToCheck.forEach((field) => {
                if (field === 'UAN') {
                    if (profileData?.profile?.[field] === '-' || profileData?.profile?.[field] === 'N/A') {
                        updatedStatus[field] = false;
                    }
                } else if (field === 'aadhaar' || field === 'pan') {
                    if (profileData?.kycDetails?.[field] === '-' || profileData?.kycDetails?.[field] === 'N/A') {
                        updatedStatus[field] = false;
                    }
                } else {
                    if (profileData?.basicDetails?.[field] === '-' || profileData?.basicDetails?.[field] === 'N/A') {
                        updatedStatus[field] = false;
                    }
                }
            });
            return updatedStatus;
        });
        setShowContinueButton(false);
        navigate('/kyc-details/bank', { state: { listItems, selectedOrg, uan, type, reportUpdatedAtVar, kycStatus, profileData, home } })

    }

    const { listItems, selectedOrg, uan, type, reportUpdatedAtVar, profileData, home } = location.state || {};

    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');
        let value = "kyc-details";
        localStorage.setItem(dynamicKey, value);
    }, [])

    const handleCheckboxChange = (field) => {
        setKycStatus((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleContinueBtn = () => {
        navigate('/kyc-details/bank', { state: { listItems, selectedOrg, uan, type, reportUpdatedAtVar, kycStatus, profileData, home } })
    };

    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        <div className='col-md-12 text-center mt-3 mt-lg-0'>
                            <span className='kycHeading d-flex justify-content-center'>
                                {showCheckbox ? 'Select details that don’t match' : 'Do these details match your Aadhaar and PAN Card?'}
                            </span>
                        </div>
                    </div>
                    <div className='row mt-lg-5 mt-3'>
                        <div className='col-md-10 offset-md-1'>
                            <div className="card  shadow-sm mx-lg-5">
                                <div className="card-body">
                                    <div className='row p-4'>
                                        <div className='col-md-6'>
                                            <label className='kycLabel'>Name</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.basicDetails?.fullName}</p>
                                                {showCheckbox && (
                                                    <input onChange={() => handleCheckboxChange('fullName')}
                                                        className="form-check-input changeCheckbox" type="checkbox"
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>


                                            {profileData?.basicDetails?.relation === "F" ? (<label className="kycLabel mt-3"> Father's Name</label>)
                                                : (<label className="kycLabel mt-3"> Husband's Name</label>)}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">
                                                    {profileData?.basicDetails?.fatherHusbandName}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('fatherHusbandName')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>Gender</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.basicDetails?.gender === "M" ? "Male" : "Female"}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('gender')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>Physically Handicapped:</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.basicDetails?.physicallyHandicapped === "N" ? "None" : "Yes"}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input" type="checkbox" onChange={() => handleCheckboxChange('physicallyHandicapped')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <label className='kycLabel mt-3 mt-md-0'>UAN Number:</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.UAN}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('UAN')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>Date of Birth:</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.basicDetails?.dateOfBirth}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input" type="checkbox" onChange={() => handleCheckboxChange('dateOfBirth')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>Aadhaar Number: </label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{maskAdharNumber(profileData?.kycDetails?.aadhaar)}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('aadhaar')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>PAN Number: </label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{maskPanNumber(profileData?.kycDetails?.pan)}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('pan')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!showContinueButton && (
                        <div className='col-md-10 offset-md-1'>
                            <div className='row mt-4 mb-3 mb-lg-0 mt-lg-5 mx-lg-3'>
                                <div className='col-md-6 col-sm-6'>
                                    <button className='btn incorrectButton w-100 py-lg-3 py-2' onClick={handleIncorrect}>No</button>
                                </div>
                                <div className='col-md-6 col-sm-6 mt-3 mt-sm-0'>
                                    <button className='btn correctButton w-100 py-lg-3 py-2' onClick={handleCorrect}>Yes, matches my Aadhaar</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showContinueButton && (
                        <div className="row mt-4 mt-lg-5 mb-3 mb-lg-0">
                            <div className="col-md-4 offset-md-4 ">
                                <button className="btn correctButton w-100 py-lg-3 py-2" onClick={handleContinueBtn}>
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default KycDetails;
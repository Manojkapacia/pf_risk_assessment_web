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

    const handleIncorrect = () => {
        setShowCheckbox(true)
        setShowContinueButton(true);
    };

    const handleCorrect = () => {
        setShowContinueButton(false);
        navigate('/kyc-details/bank', { state: { listItems,selectedOrg, uan, type, reportUpdatedAtVar, kycStatus, profileData, home } })

    }
    const {listItems, selectedOrg, uan, type, reportUpdatedAtVar, profileData, home } = location.state || {};

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
        navigate('/kyc-details/bank', { state: {listItems, selectedOrg, uan, type, reportUpdatedAtVar, kycStatus, profileData, home } })

    };
    
    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-6 col-md-8">
                    <div className='row'>

                        <div className='col-md-10 offset-md-1 text-center'>
                            <span className='welcomeLabelLogin d-flex justify-content-center mb-3' style={{ fontWeight: "600" }}>
                                Check if your UAN details match your Aadhaar and PAN card
                            </span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-10 offset-md-1'>
                            <div className="card  shadow-lg">
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


                                            {profileData?.basicDetails?.relation === "F" ? (<label className="kycLabel"> Father's Name</label>)
                                                : (<label className="kycLabel"> Husband's Name</label>)}
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
                                            <label className='kycLabel'>UAN Number:</label>
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
                                                <p className="form-check-label kycValue mb-0">{profileData?.kycDetails?.aadhaar}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('aadhaar')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>PAN Number: </label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.kycDetails?.pan}</p>
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
                        <div className='row my-3 mt-lg-5'>
                            <div className='col-md-6 col-sm-6'>
                                <button className='btn incorrectButton w-100' onClick={handleIncorrect}>This is incorrect</button>
                            </div>
                            <div className='col-md-6 col-sm-6 mt-3 mt-sm-0'>
                                <button className='btn correctButton w-100' onClick={handleCorrect}>This is correct</button>
                            </div>
                        </div>
                    )}
                    {showContinueButton && (
                        <div className="row my-3 mt-lg-5">
                            <div className="col-md-6 offset-md-3 ">
                                <button className="btn correctButton w-100" onClick={handleContinueBtn}>
                                    Continue
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
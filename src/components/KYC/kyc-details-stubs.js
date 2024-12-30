import '../../App.css';
import '../../css/KYC/kyc-details.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { encryptData } from '../common/encryption-decryption';
function KycDetailsBank() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [showFullAccountNumber, setShowFullAccountNumber] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(false);

    const {listItems, selectedOrg, uan, type, reportUpdatedAtVar, profileData, home, kycStatus } = location.state || {};
    const [BankStatus, setBankStatus] = useState({
        bankAccountNumber: true,
        bankIFSC: true
    });

    const handleCheckboxChange = (field) => {
        setBankStatus((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    
    const toggleAccountVisibility = () => {
        setShowFullAccountNumber(!showFullAccountNumber);
    };

    const formatAccountNumber = (account) => {
        if (account && account.length > 4) {
            return `${account.slice(0, 2)}XXXXXXXXXX${account.slice(-2)}`;
        }
        return account;
    };

    const handleIncorrect = () => {
        setShowCheckbox(true)
        setShowContinueButton(true);
    };

    const handleContinueBtn = () => {
        const mergedStatues = {...kycStatus, ...BankStatus}
        console.log(mergedStatues)
        localStorage.removeItem('data-for-org-' + uan)
        localStorage.removeItem('data-for-kyc-' + uan)
        const encodedData = encryptData(JSON.stringify({ listItems, selectedOrg, uan, type, reportUpdatedAtVar, kycStatus: mergedStatues, profileData, home }));
        localStorage.setItem('data-for-scan-' + uan, encodedData);
        navigate('/doc-scan', { state: {listItems, selectedOrg, uan, type, reportUpdatedAtVar, kycStatus: mergedStatues, profileData, home } })
    };

    const handleCorrect = () => {
        setShowContinueButton(false);
        const mergedStatues = {...kycStatus, ...BankStatus}
        console.log(mergedStatues)
        localStorage.removeItem('data-for-org-' + uan)
        localStorage.removeItem('data-for-kyc-' + uan)
        const encodedData = encryptData(JSON.stringify({ selectedOrg, uan, type, reportUpdatedAtVar, kycStatus: mergedStatues, profileData, home }));
        localStorage.setItem('data-for-scan-' + uan, encodedData);
        navigate('/doc-scan', { state: { listItems,selectedOrg, uan, type, reportUpdatedAtVar, kycStatus: mergedStatues, profileData, home } })
    }


    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-6 col-md-8">
                    <div className='row'>

                        <div className='col-md-10 offset-md-1 text-center'>
                            <span className='welcomeLabelLogin d-flex justify-content-center mb-3' style={{ fontWeight: "600" }}>
                                Check if your bank account details are correctly captured
                            </span>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-10 offset-md-1'>
                            <div className="card  shadow-lg">
                                <div className="card-body">
                                    <div className='row p-4'>
                                        <div className='col-md-6'>
                                            <label className='kycLabel mt-3'>Bank A/C number</label>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className='d-flex justify-content-start align-items-center'>
                                                    {showFullAccountNumber ? profileData?.kycDetails?.bankAccountNumber
                                                        : formatAccountNumber(profileData?.kycDetails?.bankAccountNumber)}
                                                    {profileData?.kycDetails?.bankAccountNumber !== '-' && (showFullAccountNumber ? (
                                                        <EyeSlash className="text-primary fs-5 ms-2" onClick={toggleAccountVisibility} />
                                                    ) : (
                                                        <Eye className="text-primary fs-5 ms-2"
                                                            onClick={toggleAccountVisibility} />
                                                    ))}
                                                </div>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('bankAccountNumber')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)'
                                                        }} />
                                                )}
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <label className='kycLabel mt-3'>IFSC Number: </label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.kycDetails?.bankIFSC}</p>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('bankIFSC')}
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

export default KycDetailsBank;
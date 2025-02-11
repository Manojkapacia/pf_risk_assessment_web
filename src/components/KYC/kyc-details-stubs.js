import '../../App.css';
import '../../css/KYC/kyc-details.css';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { encryptData } from '../common/encryption-decryption';
function KycDetailsBank() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [showFullAccountNumber, setShowFullAccountNumber] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(false);

    const { listItems, selectedOrg, uan, type, reportUpdatedAtVar, profileData, home, kycStatus } = location.state || {};
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
        const fieldsToCheck = ['bankAccountNumber', 'bankIFSC'];
        setBankStatus((prev) => {
            const updatedStatus = { ...prev };
            fieldsToCheck.forEach((field) => {
                if (profileData?.kycDetails?.[field] === '-' || profileData?.kycDetails?.[field] === 'N/A') {
                    updatedStatus[field] = false;
                }
            });
            return updatedStatus;
        });

        setShowCheckbox(true)
        setShowContinueButton(true);
    };

    const handleContinueBtn = () => {
        const mergedStatues = { ...kycStatus, ...BankStatus }
        navigate('/doc-scan', { state: { listItems, selectedOrg, uan, type, reportUpdatedAtVar, kycStatus: mergedStatues, profileData, home } })
    };

    const handleCorrect = () => {
        const fieldsToCheck = ['bankAccountNumber', 'bankIFSC'];
        setBankStatus((prev) => {
            const updatedStatus = { ...prev };
            fieldsToCheck.forEach((field) => {
                if (profileData?.kycDetails?.[field] === '-') {
                    updatedStatus[field] = false;
                }
            });
            return updatedStatus;
        });

        setShowContinueButton(false);
        const mergedStatues = { ...kycStatus, ...BankStatus }
        navigate('/doc-scan', { state: { listItems, selectedOrg, uan, type, reportUpdatedAtVar, kycStatus: mergedStatues, profileData, home } })
    }


    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-6 col-md-8">
                    <div className='row'>

                        <div className='col-md-12 text-center'>
                            <span className='kycHeading d-flex justify-content-center'>
                                {showCheckbox ? 'Select incorrect details' : 'Are your Bank a/c details correct ?'}
                            </span>
                        </div>
                    </div>
                    <div className='row mt-lg-5 mt-3'>
                        <div className='col-md-10 offset-md-1'>
                            <div className="card  shadow-sm mx-lg-5">
                                <div className="card-body">
                                    <div className='row py-4 px-2 my-4'>
                                        <div className='col-md-6'>
                                            <label className='kycLabel mt-3'>Bank A/C number</label>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className='d-flex justify-content-start align-items-center'>
                                                    {showFullAccountNumber ? profileData?.kycDetails?.bankAccountNumber
                                                        : formatAccountNumber(profileData?.kycDetails?.bankAccountNumber)}
                                                    {profileData?.kycDetails?.bankAccountNumber !== '-' && (showFullAccountNumber ? (
                                                        <EyeSlash className="text-primary fs-5 mx-2 cursor-pointer" onClick={toggleAccountVisibility} />
                                                    ) : (
                                                        <Eye className="text-primary fs-5 mx-2 cursor-pointer"
                                                            onClick={toggleAccountVisibility} />
                                                    ))}
                                                </div>
                                                {showCheckbox && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" checked={!BankStatus.bankAccountNumber} onChange={() => handleCheckboxChange('bankAccountNumber')}
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
                                                    <input className="form-check-input changeCheckbox" type="checkbox" checked={!BankStatus.bankIFSC} onChange={() => handleCheckboxChange('bankIFSC')}
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
                                    <button className='btn correctButton w-100 py-lg-3 py-2' onClick={handleCorrect}>Yes</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showContinueButton && (
                        <div className="row mb-3 mb-lg-0 mt-4 mt-lg-5">
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

export default KycDetailsBank;
import '../../App.css';
import '../../css/KYC/kyc-details.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function KycDetails() {
    const location = useLocation();
    const navigate = useNavigate()

    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [showContinueButton, setShowContinueButton] = useState(false);
    const [kycStatus, setKycStatus] = useState({
        fullName: null,
        gender: null,
        fatherHusbandName: null,
        physicallyHandicapped: null,
        UAN: null,
        dateOfBirth: null,
        aadhaar: null,
        pan: null,
        bankAccountNumber: null,
        bankIFSC: null
    });
    const [selectedFields, setSelectedFields] = useState({
        fullName: false,
        gender: false,
        fatherHusbandName: false,
        physicallyHandicapped: false,
        UAN: false,
        dateOfBirth: false,
        aadhaar: false,
        pan: false
    });

    const handleIncorrect = () => {
        setKycStatus({
            fullName: true,
            gender: true,
            fatherHusbandName: true,
            physicallyHandicapped: true,
            UAN: true,
            dateOfBirth: true,
            aadhaar: true,
            pan: true
        });
        setShowContinueButton(true);
    };

    const handleCorrect = () => {
        setKycStatus({
            fullName: true,
            gender: true,
            fatherHusbandName: true,
            physicallyHandicapped: true,
            UAN: true,
            dateOfBirth: true,
            aadhaar: true,
            pan: true
        });
        setShowContinueButton(false);
        navigate('/kyc-details/bank', { state: { selectedOrg, uan, type, reportUpdatedAtVar, kycStatus, profileData, home } })

    }
    const { selectedOrg, uan, type, reportUpdatedAtVar, profileData, home } = location.state || {};

    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');
        let value = "kyc-details";
        localStorage.setItem(dynamicKey, value);
    }, [])



    const handleKycDetailsSubmit = async () => {
        if (!showAccountDetails) {
            setShowAccountDetails(true);
        } else {
            // localStorage.removeItem('data-for-org-' + uan)
            // localStorage.removeItem('data-for-kyc-' + uan)
            // const encodedData = JSON.stringify({ selectedOrg, uan, type, reportUpdatedAtVar, kycStatus, profileData, home });
            // localStorage.setItem('data-for-scan-' + uan, encodedData);
            // navigate('/doc-scan', { state: { selectedOrg, uan, type, reportUpdatedAtVar, kycStatus, profileData, home } })
        }

    };

    const handleCheckboxChange = (field) => {
        setSelectedFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    const handleContinueBtn = () => {
        setKycStatus((prev) => {
            const updatedStatus = { ...prev };
            for (const field in selectedFields) {
                if (selectedFields[field]) {
                    updatedStatus[field] = false; // Set selected fields to false
                }
            }
            return updatedStatus;
        });
        navigate('/kyc-details/bank', { state: { selectedOrg, uan, type, reportUpdatedAtVar, kycStatus, profileData, home } })

    };

    console.log("data", profileData, kycStatus);


    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                {/* <div className="col-lg-4 col-md-8">
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
                </div> */}

                {/* <div className="col-lg-6 col-md-8">
                    <div className='row'>
                        {showAccountDetails ? (
                            <>
                                <div className='col-md-10 offset-md-1'>
                                    <span className='welcomeLabelLogin d-flex justify-content-center mb-3' style={{ fontWeight: "600" }}>
                                        Select the detail that does not match your Bank Account</span>
                                    <div className="card card-bottom-shadow border-0 mb-2">
                                        <div className="list-group" style={{ border: kycStatus.bankAccountNumber ? "none" : "2px solid red" }}
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
                                            <div className="list-group" style={{ border: kycStatus.bankIFSC ? "none" : "2px solid red" }}
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
                                <button type="button" onClick={handleKycDetailsSubmit}
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
                                        <div className="list-group" style={{ border: kycStatus.fullName ? "none" : "2px solid red" }}
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
                                        <div className="list-group" style={{ border: kycStatus.dateOfBirth ? "none" : "2px solid red" }}
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
                                        <div className="list-group" style={{ border: kycStatus.gender ? "none" : "2px solid red" }}
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
                                        <div className="list-group" style={{ border: kycStatus.fatherHusbandName ? "none" : "2px solid red" }}
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
                                        <div className="list-group" style={{ border: kycStatus.physicallyHandicapped ? "none" : "2px solid red" }}
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
                </div> */}
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
                                                {kycStatus.fullName && (
                                                    <input onChange={() => handleCheckboxChange('fullName')}
                                                        className="form-check-input changeCheckbox" type="checkbox"
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)',
                                                            backgroundColor: '#DCDCDC', borderColor: '#DCDCDC',
                                                        }} />
                                                )}
                                            </div>


                                            {profileData?.basicDetails?.relation === "F" ? (<label className="kycLabel"> Father's Name</label>)
                                                : (<label className="kycLabel"> Husband's Name</label>)}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">
                                                    {profileData?.basicDetails?.fatherHusbandName}</p>
                                                {kycStatus.fatherHusbandName && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('fatherHusbandName')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)',
                                                            backgroundColor: '#DCDCDC', borderColor: '#DCDCDC',
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>Gender</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.basicDetails?.gender === "M" ? "Male" : "Female"}</p>
                                                {kycStatus.gender && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('gender')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)',
                                                            backgroundColor: '#DCDCDC', borderColor: '#DCDCDC',
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>Physically Handicapped:</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.basicDetails?.physicallyHandicapped === "N" ? "None" : "Yes"}</p>
                                                {kycStatus.physicallyHandicapped && (
                                                    <input className="form-check-input" type="checkbox" onChange={() => handleCheckboxChange('physicallyHandicapped')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)',
                                                            backgroundColor: '#DCDCDC', borderColor: '#DCDCDC',
                                                        }} />
                                                )}
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <label className='kycLabel'>UAN Number:</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.UAN}</p>
                                                {kycStatus.UAN && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('UAN')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)',
                                                            backgroundColor: '#DCDCDC', borderColor: '#DCDCDC',
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>Date of Birth:</label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.basicDetails?.dateOfBirth}</p>
                                                {kycStatus.dateOfBirth && (
                                                    <input className="form-check-input" type="checkbox" onChange={() => handleCheckboxChange('dateOfBirth')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)',
                                                            backgroundColor: '#DCDCDC', borderColor: '#DCDCDC',
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>Aadhaar Number: </label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.kycDetails?.aadhaar}</p>
                                                {kycStatus.aadhaar && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('aadhaar')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)',
                                                            backgroundColor: '#DCDCDC', borderColor: '#DCDCDC',
                                                        }} />
                                                )}
                                            </div>
                                            <label className='kycLabel mt-3'>PAN Number: </label>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="form-check-label kycValue mb-0">{profileData?.kycDetails?.pan}</p>
                                                {kycStatus.pan && (
                                                    <input className="form-check-input changeCheckbox" type="checkbox" onChange={() => handleCheckboxChange('pan')}
                                                        id="flexCheckDefault" style={{
                                                            transform: 'scale(1.5)',
                                                            backgroundColor: '#DCDCDC', borderColor: '#DCDCDC',
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
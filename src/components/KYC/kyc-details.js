import '../../App.css';
import '../../css/KYC/kyc-details.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import { Eye, EyeSlash } from "react-bootstrap-icons";

function KycDetails() {
    const location = useLocation();
    const navigate = useNavigate()

    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [showFullAccountNumber, setShowFullAccountNumber] = useState(false);
    const [kycStatus, setKycStatus] = useState({
        fullName: null,
        dateOfBirth: null,
        gender: null,
        fatherHusbandName: null,
        physicallyHandicapped: null,
        bankAccountNumber: null,
        bankIFSC: null
    });
    const { selectedOrg, uan, type, reportUpdatedAtVar, profileData } = location.state || {};

    useEffect(() => {
        let dynamicKey = "current_page_" + localStorage.getItem('user_uan');
        let value = "kyc-details";
        localStorage.setItem(dynamicKey, value);
    }, [])

    const updateStatus = (field, status) => {
        setKycStatus((prevState) => ({
            ...prevState,
            [field]: status,
        }));
    };

    const toggleAccountVisibility = () => {
        setShowFullAccountNumber(!showFullAccountNumber);
    };

    const formatAccountNumber = (account) => {
        if (account && account.length > 4) {
            return `${account.slice(0, 2)}xxxxxxxxxx${account.slice(-2)}`;
        }
        return account; 
    };

    const isButtonEnabled = Object.values(kycStatus)
        .slice(0, 5)
        .every((status) => status !== null);

    const handleSubmit = async () => {
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
                            <div className='col-md-10 offset-md-1'>
                                <span className='welcomeLabelLogin d-flex justify-content-center mb-3' style={{ fontWeight: "600" }}>Check Bank Details</span>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group">
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="kycLabel">A/c Number</span>
                                                <div className="kycValue">
                                                {showFullAccountNumber ? profileData?.kycDetails?.bankAccountNumber
                                                 : formatAccountNumber(profileData?.kycDetails?.bankAccountNumber)}
                                                </div>
                                            </div>
                                                {profileData?.kycDetails?.bankAccountNumber != '-' && (showFullAccountNumber ? (
                                                    <EyeSlash className="text-primary fs-5" onClick={toggleAccountVisibility}/>
                                                ) : (
                                                    <Eye className="text-primary fs-5" 
                                                    onClick={toggleAccountVisibility}/>
                                                ))}
                                            <div>
                                                {kycStatus.bankAccountNumber !== true ? (
                                                    <span className='byDefaultSeccess me-2' onClick={() => updateStatus("bankAccountNumber", true)}>
                                                        <CheckCircle className="text-success fs-5"/>
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess me-2">
                                                        <CheckCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                                {kycStatus.bankAccountNumber !== false ? (
                                                    <span className='byDefaultSeccess' onClick={() => updateStatus("bankAccountNumber", false)}>
                                                          <XCircle className="text-danger fs-5"/>
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess" style={{ backgroundColor: " #FA3E3E" }}>
                                                        <XCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group">
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="kycLabel">IFSC Number</span>
                                                <div className="kycValue">{profileData?.kycDetails?.bankIFSC}</div>
                                            </div>
                                            <div>
                                                <div>
                                                    {kycStatus.bankIFSC !== true ? (
                                                        <span className='byDefaultSeccess me-2' onClick={() => updateStatus("bankIFSC", true)}>
                                                            <CheckCircle className="text-success fs-5"/>
                                                        </span>
                                                    ) : (
                                                        <span className="selectSeccess me-2">
                                                            <CheckCircle className="text-white fs-5" />
                                                        </span>
                                                    )}
                                                    {kycStatus.bankIFSC !== false ? (
                                                        <span className='byDefaultSeccess' onClick={() => updateStatus("bankIFSC", false)} >
                                                            <XCircle className="text-danger fs-5"/>
                                                        </span>
                                                    ) : (
                                                        <span className="selectSeccess" style={{ backgroundColor: " #FA3E3E" }}>
                                                            <XCircle className="text-white fs-5" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='col-md-10 offset-md-1'>
                                <span className='welcomeLabelLogin d-flex justify-content-center mb-3' style={{ fontWeight: "600" }}>Check KYC Details</span>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group">
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="kycLabel">Full Name</span>
                                                <div className="">{profileData?.basicDetails?.fullName}</div>
                                            </div>
                                            <div>
                                                {kycStatus.fullName !== true ? (
                                                    <span className='byDefaultSeccess me-2'  onClick={() => updateStatus("fullName", true)}>
                                                        <CheckCircle className="text-success fs-5"/>
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess me-2">
                                                        <CheckCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                                {kycStatus.fullName !== false ? (
                                                    <span className='byDefaultSeccess' onClick={() => updateStatus("fullName", false)}>
                                                        <XCircle className="text-danger fs-5"/>
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess" style={{ backgroundColor: " #FA3E3E" }}>
                                                        <XCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group">
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="kycLabel">Date of Birth</span>
                                                <div className="">{profileData?.basicDetails?.dateOfBirth}</div>
                                            </div>
                                            <div>
                                                <div>
                                                    {kycStatus.dateOfBirth !== true ? (
                                                        <span className='byDefaultSeccess me-2' onClick={() => updateStatus("dateOfBirth", true)}>
                                                            <CheckCircle className="text-success fs-5"/>
                                                        </span>
                                                    ) : (
                                                        <span className="selectSeccess me-2">
                                                            <CheckCircle className="text-white fs-5" />
                                                        </span>
                                                    )}
                                                    {kycStatus.dateOfBirth !== false ? (
                                                        <span className='byDefaultSeccess' onClick={() => updateStatus("dateOfBirth", false)}>
                                                            <XCircle className="text-danger fs-5" />
                                                        </span>
                                                    ) : (
                                                        <span className="selectSeccess" style={{ backgroundColor: " #FA3E3E" }}>
                                                            <XCircle className="text-white fs-5" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group">

                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="kycLabel">Gender</span>
                                                <div className="">{profileData?.basicDetails?.gender}</div>
                                            </div>
                                            <div>
                                                {kycStatus.gender !== true ? (
                                                    <span className='byDefaultSeccess me-2' onClick={() => updateStatus("gender", true)} >
                                                         <CheckCircle className="text-success fs-5"/>
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess me-2">
                                                        <CheckCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                                {kycStatus.gender !== false ? (
                                                    <span className='byDefaultSeccess' onClick={() => updateStatus("gender", false)}>
                                                          <XCircle className="text-danger fs-5"/>
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess" style={{ backgroundColor: " #FA3E3E" }}>
                                                        <XCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group">

                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                {profileData?.basicDetails?.relation === "F" ? (<span className="kycLabel"> Father's Name</span>)
                                                    : (<span className="kycLabel"> Husband's Name</span>)}
                                                <div className="">{profileData?.basicDetails?.fatherHusbandName}</div>
                                            </div>
                                            <div>
                                                {kycStatus.fatherHusbandName !== true ? (
                                                    <span className='byDefaultSeccess me-2' onClick={() => updateStatus("fatherHusbandName", true)}>
                                                         <CheckCircle className="text-success fs-5" />
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess me-2">
                                                        <CheckCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                                {kycStatus.fatherHusbandName !== false ? (
                                                    <span className='byDefaultSeccess' onClick={() => updateStatus("fatherHusbandName", false)}>
                                                        <XCircle className="text-danger fs-5"  />
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess" style={{ backgroundColor: " #FA3E3E" }}>
                                                        <XCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-bottom-shadow border-0 mb-2">
                                    <div className="list-group">

                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="kycLabel">Physically Handicapped?</span>
                                                <div className="">{profileData?.basicDetails?.physicallyHandicapped}</div>
                                            </div>
                                            <div>
                                                {kycStatus.physicallyHandicapped !== true ? (
                                                    <span className='byDefaultSeccess me-2' onClick={() => updateStatus("physicallyHandicapped", true)}>
                                                         <CheckCircle className="text-success fs-5" />
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess me-2">
                                                        <CheckCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                                {kycStatus.physicallyHandicapped !== false ? (
                                                    <span className='byDefaultSeccess' onClick={() => updateStatus("physicallyHandicapped", false)} >
                                                         <XCircle className="text-danger fs-5"/>
                                                    </span>
                                                ) : (
                                                    <span className="selectSeccess" style={{ backgroundColor: " #FA3E3E" }}>
                                                        <XCircle className="text-white fs-5" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        <button type="button" onClick={handleSubmit}
                            className="btn col-12 pfRiskButtons mt-2" disabled={!isButtonEnabled}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KycDetails;
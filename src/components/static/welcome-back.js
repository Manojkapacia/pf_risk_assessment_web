import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from '../common/encryption-decryption';

const WelcomeBack = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { UAN, Pws } = location.state || {};

    const handleFreshStart = () => {
        navigate("/otpAssessment", { state: { UAN, Pws, type: "back-screen" } });
    }

    const handleResume = () => {
        const currentRoute = localStorage.getItem("current_page_" + UAN);

        if(!currentRoute || currentRoute === null || currentRoute === 'service-history') {
            navigate(`/service-history`, { state: { UAN } })
        }
        if(currentRoute && currentRoute === 'select-organization') {
            const key = 'data-for-org-' + UAN
            const retrievedData = JSON.parse(decryptData(localStorage.getItem(key)));
            navigate(`/${currentRoute}`, { state: retrievedData })
        }
        if(currentRoute && currentRoute === 'kyc-details') {
            const key = 'data-for-kyc-' + UAN 
            const retrievedData = JSON.parse(decryptData(localStorage.getItem(key)));
            navigate(`/${currentRoute}`, { state: retrievedData })
        }
        if(currentRoute && currentRoute === 'doc-scan') {
            const key = 'data-for-scan-' + UAN
            const retrievedData = JSON.parse(decryptData(localStorage.getItem(key)));
            navigate(`/${currentRoute}`, { state: retrievedData })
        }         
        if(currentRoute && currentRoute === 'report-registation') {
            const key = 'data-for-report-reg-' + UAN
            const retrievedData = JSON.parse(decryptData(localStorage.getItem(key)));
            navigate(`/${currentRoute}`, { state: retrievedData })
        }         
        if(currentRoute && currentRoute === 'report-submit') {
            const key = 'data-for-report-submit-' + UAN
            const retrievedData = JSON.parse(decryptData(localStorage.getItem(key)));
            navigate(`/${currentRoute}`, { state: retrievedData })
        }         
    }

    return(
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center">
                <div className='col-md-6 col-lg-3 text-center'>
                    <span className='welcomeLabel'>Welcome Back!</span><br></br>
                    <span className='labelText'>Choose an option to continue</span>
                    <button className='w-100 border-0 mb-3 py-2 pfRiskButtons mt-5'
                        style={{ fontSize: "1rem", fontWeight: "600" }} onClick={() => { handleResume() }}>Resume from where you left</button>
                    <button className='w-100 py-2 welcomeButton' onClick={() => { handleFreshStart() }}>Take a fresh assessment</button>
                </div>
            </div>
        </div>
    );
}

export default WelcomeBack;
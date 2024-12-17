import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import { useLocation, useNavigate } from 'react-router-dom';

const WelcomeBack = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { UAN, Pws } = location.state || {};

    const handleFreshStart = () => {
        navigate("/otpAssessment", { state: { UAN, Pws, type: "back-screen" } });
    }

    const handleResume = () => {
        const currentRoute = localStorage.getItem("current_page_" + UAN);
        console.log(currentRoute)
        if(currentRoute === null) {
            navigate(`/service-history`, { state: { UAN } })
            return;
        }
        if(currentRoute === 'select-organization' || currentRoute ===  'doc-scan') {
            const key = currentRoute === 'select-organization' ? 'data-org-' + UAN : 'data-scan-' + UAN
            const retrievedData = JSON.parse(atob(localStorage.getItem(key)));
            navigate(`/${currentRoute}`, { state: retrievedData })
        } else {
            navigate(`/${currentRoute}`, { state: { UAN } })
        }
    }

    return(
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                {/* <div className="col-lg-3 col-md-4 offset-lg-2 offset-md-1 mt-2 mt-md-0">
                    <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' />
                </div> */}
                {/* <div className="col-lg-6 col-md-7 ms-lg-4"> */}
                    {/* <div className='row'> */}
                        {/* <div className='col-md-4'>
                            <span className='welcomeLabel'>Welcome Back!</span><br></br>
                            <span className='labelText'>Choose an option to continue</span>
                        </div> */}
                        <div className='col-md-6 col-lg-3 text-center'>
                        <span className='welcomeLabel'>Welcome Back!</span><br></br>
                        <span className='labelText'>Choose an option to continue</span>
                            <button className='w-100 border-0 mb-3 py-1 pfRiskButtons mt-5'
                              style={{fontSize:"1rem", fontWeight:"600"}} onClick={() => { handleResume() }}>Resume from where you left</button>
                            <button className='w-100 py-1 welcomeButton' onClick={() => { handleFreshStart() }}>Take a fresh assessment</button>
                        </div>
                    {/* </div> */}
                {/* </div> */}
            </div>
        </div>
    );
}

export default WelcomeBack;
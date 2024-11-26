import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import { useNavigate } from 'react-router-dom';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { Link,ThreeDots,Tablet,ArrowClockwise } from "react-bootstrap-icons";

const ActivateUan = () => {
    const navigate = useNavigate();

    const goToEpfoPortal = () => {
        window.open("https://passbook.epfindia.gov.in/MemberPassBook/login", "_blank");
    }

    return (
        <div className="container-fluid">
            <div className="row mx-2 d-flex justify-content-center align-items-center vh-100">
                <div className="col-md-4 col-lg-4 offset-lg-1 mt-2 mt-md-0">
                    <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' />
                </div>
                <div className="col-md-8 col-lg-6">
                    <div className="row">
                        <div className='col-md-12 text-end backAssesment' style={{cursor:'pointer'}}
                                onClick={() => navigate("/")}>Back to Assessment</div>
                    </div>
                    <div className="row">
                        <div className='col-md-6'>
                            <span className='labelHeading' style={{ lineHeight: '1.2' }}>Follow the steps below to activate UAN</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-md-6'>
                            <div className="card border-0 shadow-sm my-2 my-md-3  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9', height: '5.3rem' }}>
                                <div className="card-body pe-md-0 d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Link className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-1</span><br></br>
                                        <span className='iconSubHeading'>Go to EPFO website</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9', height: '5.3rem' }}>
                                <div className="card-body pe-md-0 d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <ArrowClockwise className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-2</span><br></br>
                                        <span className='iconSubHeading'>Click on activate UAN</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mt-2 mt-md-3  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9', height: '5.3rem' }}>
                                <div className="card-body pe-md-0 d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Tablet className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-3</span><br></br>
                                        <span className='iconSubHeading'>Enter the details in the required field</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="card border-0 shadow-sm my-2 my-md-3  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9', height: '5.3rem' }}>
                                <div className="card-body pe-md-0 d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <ThreeDots className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-4</span><br></br>
                                        <span className='iconSubHeading'>Authenticate the OTP received</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9', height: '5.3rem' }}>
                                <div className="card-body pe-md-0 d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Tablet className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-5</span><br></br>
                                        <span className='iconSubHeading'>You will receive the credentials on your mobile</span>
                                    </div>
                                </div>
                            </div>
                            <div className="buttonClass mt-md-3 d-flex justify-content-center align-items-center" style={{ height: '5.3rem' }}>
                                <button className='epfoButton w-100 py-2' onClick={goToEpfoPortal}>Go to EPFO Portal</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivateUan;
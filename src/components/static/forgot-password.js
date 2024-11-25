import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { Link ,ChatSquareDots,Key,PersonCheck,Clipboard,CreditCard  } from "react-bootstrap-icons";

const ForgotPassword = () => {
    return (
        <div className="container-fluid">
            <div className="row mx-2">
                <div className="col-lg-4 col-md-8 offset-lg-1 mt-2 mt-lg-0 
                d-flex justify-content-center align-items-center vh-100">
                    <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' />
                </div>
                <div className="col-lg-6 mt-4 mb-3">
                    <div className="row">
                        <div className='col-md-12 text-end backAssesment'>Back to Assessment</div>
                    </div>
                    <div className="row">
                        <span className='labelHeading'>Follow the steps below to reset your password</span>
                        <div className='col-md-6'>
                            <div className="card border-0 shadow-sm my-3  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Link className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-1</span><br></br>
                                        <span className='iconSubHeading'>Go to EPFO website</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Key  className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-2</span><br></br>
                                        <span className='iconSubHeading'>Click on Forgot Password</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm my-3  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <PersonCheck  className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-3</span><br></br>
                                        <span className='iconSubHeading'>Enter Your UAN and Captcha</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Clipboard  className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-4</span><br></br>
                                        <span className='iconSubHeading'>Enter Name,Date of Birth,Gender and 
                                            click in verify</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className="card border-0 shadow-sm my-3 d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <CreditCard className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-5</span><br></br>
                                        <span className='iconSubHeading'>Enter Captcha code,Aadhaar Number,give consent and click 'verify'</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <ChatSquareDots className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-6</span><br></br>
                                        <span className='iconSubHeading'>verify the Mobile Number on which OTP will be sent</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm my-3  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <ChatSquareDots className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-7</span><br></br>
                                        <span className='iconSubHeading'>Submit the OTP that you received</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <ChatSquareDots className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-8</span><br></br>
                                        <span className='iconSubHeading'>Enter new password and click on 'Confirm'</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-6 offset-md-3'>
                            <button className='epfoButton w-100 py-2'>Go to  EPFO Portal</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
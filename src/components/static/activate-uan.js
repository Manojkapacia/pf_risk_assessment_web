import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { Link } from "react-bootstrap-icons";

const ActivateUan = () => {
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
                        <div className='col-md-6'>
                        <span className='labelHeading'>Follow the steps below to activate UAN</span>
                        </div>
                        </div>
                    <div className="row">
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
                                        <Link className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-2</span><br></br>
                                        <span className='iconSubHeading'>Click on activate UAN</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm my-3  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Link className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-3</span><br></br>
                                        <span className='iconSubHeading'>Enter the details in the required field</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                        <div className="card border-0 shadow-sm my-3  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Link className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-4</span><br></br>
                                        <span className='iconSubHeading'>Authenticate the OTP received</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm  d-flex justify-content-center align-items-start" style={{ backgroundColor: '#F9F9F9',height:'5.3rem' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Link className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Step-5</span><br></br>
                                        <span className='iconSubHeading'>You will receive the credentials on your mobile</span>
                                    </div>
                                </div>
                            </div>
                            <div className="buttonClass mt-3 d-flex justify-content-center align-items-center" style={{height:'5.3rem' }}>
                            <button className='epfoButton w-100 py-2 '>Go to  EPFO Portal</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivateUan;
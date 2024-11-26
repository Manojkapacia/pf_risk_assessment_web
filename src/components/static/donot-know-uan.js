import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { ChatSquareDots, Telephone } from "react-bootstrap-icons";

const DonotKnowUan = () => {
    return (
        <div className="container-fliud">
            <div className="row mx-2">
                <div className="col-md-4  offset-md-1 mt-3 mt-md-0 
                d-flex align-items-center justify-content-center custom-col">
                    <img src={pfRiskImage} alt="Risk Assessment" className='pfRiskLoginImage' />
                </div>
                <div className="col-md-6 mt-md-4 mb-2 mb-md-3">
                    <div className="row">
                        <div className='col-md-12 text-end backAssesment'>Back to Assessment</div>
                    </div>
                    <div className="row">
                        <span className='labelHeading'>Know Your UAN</span><br></br>
                        <span className='labelText'>Use your registered mobile number to receive your UAN details</span>
                    </div>
                    <div className="row mt-2 mt-md-5">
                        <div className="col-lg-6 col-md-8 offset-md-2 offset-lg-3">
                            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#F9F9F9' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <ChatSquareDots className='iconSet p-2' size={30} title="Chat Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Send SMS</span><br></br>
                                        <span className='iconSubHeading'>to EPFO official service (on +91- 9875463210)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mt-2 mt-md-3" style={{ backgroundColor: '#F9F9F9' }}>
                                <div className="card-body d-flex align-items">
                                    <div className='iconbody d-flex justify-content-center align-items-center'>
                                        <Telephone className='iconSet p-2' size={30} title="Phone Icon" />
                                    </div>
                                    <div className='textClasses ms-3'>
                                        <span className='iconHeading'>Give missed call</span><br></br>
                                        <span className='iconSubHeading'>to EPFO </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonotKnowUan;
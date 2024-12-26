import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import { useNavigate } from 'react-router-dom';
import SideContent from '../common/side-content';
import pfRiskImage from '../../assets/images/pf-risk-analyzer.png';
import { ChatSquareDots, Telephone } from "react-bootstrap-icons";
import { Link,ThreeDots,Tablet,ArrowClockwise } from "react-bootstrap-icons";

const DonotKnowUan = () => {
    const navigate = useNavigate();

    return (
        <div className="container-fliud position-relative">
            {/* <span
                className="position-absolute top-0 end-0 m-3 text-end backAssesment"
                style={{ cursor: 'pointer' }} onClick={() => navigate("/")} >
                Back to Assessment
            </span> */}
            <div className="row mx-2 d-flex justify-content-center align-items-center">
                <div className="col-lg-4 col-md-4 mt-2 mt-md-0 mb-3 mb-lg-0 d-none d-md-block">
                <div className="row">
                        <div className="col-md-11 text-center offset-md-1">
                            <SideContent></SideContent>
                        </div>
                    </div>
                </div>
                <div className="col-md-7 offset-md-1 col-lg-6 offset-lg-0 responsive-padding" style={{backgroundColor: "#ffffff", paddingBottom:"10rem"}}>
                    <div className="row">
                        <span className='labelHeading'>Know Your UAN</span><br></br>
                        <span className='labelText'>Use your registered mobile number to receive your UAN details</span>
                    </div>
                    <div className="row mt-2 mt-md-5 d-flex justify-content-center align-items-center ">
                        <div className="col-lg-6 col-md-8">
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
import React from 'react';
import '../../App.css';
import '../../css/static/uan-static.css';
import { ChatSquareDots, Telephone } from "react-bootstrap-icons";

const DonotKnowUan = () => {
    return (
        <div className="container-fliud">
            <div className="row mx-1 d-flex justify-content-center align-items-center">
                <div className="col-md-7 col-lg-7">
                    <div className="row">
                        <span className='labelHeading'>Know Your UAN</span><br></br>
                        <span className='labelText'>Use your registered mobile number to receive your UAN details</span>
                    </div>
                    <div className="row mt-2 mt-md-5 d-flex justify-content-center align-items-center ">
                        <div className="col-lg-10 col-md-8">
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
                                        <span className='iconSubHeading'>to EPFO (on +91- 9875463210)</span>
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
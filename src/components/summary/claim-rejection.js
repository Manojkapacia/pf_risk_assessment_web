import React from "react";
import HighRisk from './../../assets/images/highRiskImage.svg';

function ClaimRejection() {
    return (
        <div className="card rejection-card text-white px-4 mt-3">
            <div className="row">
                <div className="col-lg-7">
                    <div className="d-flex justify-content-center justify-content-lg-start mt-3">
                        <p className='mb-0' style={{ fontSize: '1rem', fontWeight: '500', lineHeight: '1.1' }}>
                            Your claim rejection <br></br> probability
                        </p>
                    </div>
                    <div className="d-flex justify-content-center justify-content-lg-end">
                        <img
                            src={HighRisk}
                            alt="High Risk"
                            style={{
                                width: '12rem',
                                height: '6rem',
                                // marginLeft: '7rem'
                            }}
                        />
                    </div>
                </div>
                <div className="col-lg-5 mt-2 mb-2 mt-lg-0 d-flex align-items-center justify-content-center justify-content-lg-start">
                    <div className="text-center text-lg-start">
                        <p className="mb-0" style={{ fontSize: '1.5rem', fontWeight: '700' }}>₹ 12,13,456</p>
                        <p className="mb-0" style={{ fontSize: '1rem', fontWeight: '600', lineHeight: '1.1' }}>
                            Stuck due to identified Issues
                        </p>
                        <button className="resolveButton mt-2" style={{ color: '#FA3E3E' }}>Resolve My Issues</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ClaimRejection;
import React from "react";
import "../../css/common/report-card.css";
import { PersonCircle } from 'react-bootstrap-icons';

function ReportCard({ profileData, homeData }) {
    return (
        <div className='row'>
            <div className='col-md-11 mt-2 mt-sm-0'>
                <div className="card text-white p-2" style={{ backgroundColor: "#04184a", borderRadius: "16px" }}>
                    <div className="d-flex align-items-center mb-2">
                        <PersonCircle className="fs-1" />
                        <div className='text-center flex-grow-1'>
                            <span className='reportUserName'>{profileData?.basicDetails?.fullName}</span><br></br>
                            <span className='reportUANno'>UAN: {profileData?.UAN}</span>
                        </div>
                    </div>
                    <div className="text-center my-3">
                        <p className="reportValueText">Current Value</p>
                        <span className='reportValueAmount'>{homeData?.totalBalance}</span>
                    </div>
                    <hr className="text-white" />
                    <div className="d-flex justify-content-center">
                        <div className="text-center">
                            {/* <p className="employeeText mb-1">Employee Share</p> */}
                            {/* <span className='employeeValue'>₹11,25,000</span> */}
                        </div>
                        <div className="text-center ms-5">
                            {/* <p className="employeeText mb-1">Employer Share</p> */}
                            {/* <span className='employeeValue'>₹11,25,000</span> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ReportCard;
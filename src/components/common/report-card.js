import React, { useEffect, useState } from "react";
import "../../css/common/report-card.css";
import { PersonCircle } from 'react-bootstrap-icons';

function ReportCard({ profileData, homeData }) {
    const [totalBalance, setTotalBalance] = useState("N/A")

    useEffect(() => {
        const parseCurrency = (value) => Number(value.replace(/[₹,]/g, ""));
        const formatCurrency = (value) => `₹ ${value.toLocaleString("en-IN")}`;
        // set total balance 
        const totalBalance = homeData?.memberWiseBalances.reduce((accu, item) => {
            return accu + parseCurrency(item.balance || "0");
        }, 0)
        setTotalBalance(formatCurrency(totalBalance))
    }, [])

    return (

        <div className='row'>
            <div className='col-md-12'>
                <div className="card text-white p-2" style={{ backgroundColor: "#04184a", borderRadius: "1rem" }}>
                    <div className="d-flex flex-column align-items-center">
                        <PersonCircle className="fs-1" />
                        <span className='reportUserName mb-0'>{profileData?.basicDetails?.fullName}</span>
                        <span className='reportUANno mb-0'>{`UAN: ${profileData?.UAN}`}</span>
                    </div>
                    <div className="text-center mt-3">
                        <p className="reportValueText">Current Value</p>
                        <span className='reportValueAmount'>{totalBalance}</span>
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
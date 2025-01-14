import React from "react";
import SummaryCard from "./summary-card";
import ClaimRejection from "./claim-rejection";
import './../../css/summary/account-details.css'
function AccountDetails() {

    const employmentData = [
        {
            employer: "Morningstar India Pvt. Ltd.",
            memberId: "1238712387922",
            tenure: "21 Feb'24 to Present",
            experience: "1 year 3 months",
            balance: "₹ 6,34,234",
        },
        {
            employer: "Morningstar India Pvt. Ltd.",
            memberId: "1238712387922",
            tenure: "21 Feb'24 to Present",
            experience: "5 year 0 months",
            balance: "₹ 6,34,234",
        },
        {
            employer: "Morningstar India Pvt. Ltd.",
            memberId: "1238712387922",
            tenure: "21 Feb'24 to Present",
            experience: "1 year 0 months",
            balance: "₹ 6,34,234",
        },
    ];

    const totalService = "7 year 3 months";
    return (
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
                <div className='col-lg-5 col-md-6 my-4'>
                    <SummaryCard></SummaryCard>
                    <div className="card shadow-sm py-3 px-lg-3 mt-3">
                        <p className="text-center employmentHistory">Employment History</p>
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th className="employmentTabelHeading">Employer</th>
                                    <th className="employmentTabelHeading">Tenure</th>
                                    <th className="employmentTabelHeading">Experience</th>
                                    <th className="employmentTabelHeading">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employmentData.map((data, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="employmentData">{data.employer}</div>
                                            <div className=" employmentData">
                                                Member ID: {data.memberId}
                                            </div>
                                        </td>
                                        <td className="employmentData">{data.tenure}</td>
                                        <td className="employmentData">{data.experience}</td>
                                        <td className="employmentData">{data.balance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-center employmentHistory mt-2">
                            Total Service: {totalService}
                        </div>
                    </div>

                    <div
                        className="card shadow-sm  mt-3 px-3 px-lg-5 py-3">

                        <div className="text-center">
                            <h5 className="employmentHistory">Overview</h5>
                        </div>

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="overViewTabelData">Total Service</td>
                                    <td className="overViewTabelSubData">
                                    7 years 3 Months
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">No. Of Employers</td>
                                    <td className="overViewTabelSubData">
                                        3
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">Current Employer</td>
                                    <td className="overViewTabelSubData">
                                    Morningstar India Pvt. Ltd
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">Current Value</td>
                                    <td className="overViewTabelSubData">
                                    ₹ 22,50,000
                                    </td>
                                </tr>
                                <tr>
                                    <td className="overViewTabelData">Last Contribution</td>
                                    <td className="overViewTabelSubData">
                                    ₹ 22,50,000
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td className="text-center align-middle">FY’24 Interest</td>
                                    <td className="text-center align-middle">
                                        ₹ 22,50,000
                                    </td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="card shadow-sm  mt-3 py-3 px-3 px-lg-5">
                            <div className="row">
                                <h5 className="text-center employmentHistory">Personal Details</h5>
                                <div className="col-6">
                                    <p className="mb-0 personalDetText">Fathers Name:</p>
                                    <p className="personalDetSubtext">DARSHAN</p>
                                </div>
                                <div className="col-6">
                                    <p className="mb-0 personalDetText">Date of Birth:</p>
                                    <p className="personalDetSubtext">17/11/1993</p>
                                </div>
                            </div>
                    </div>
                    <ClaimRejection></ClaimRejection>
                </div>
            </div>
        </div>
    )
}
export default AccountDetails;
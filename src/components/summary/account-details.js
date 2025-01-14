import React from "react";
import SummaryCard from "./summary-card";
import ClaimRejection from "./claim-rejection";
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
                <div className='col-md-5 mt-4'>
                    <SummaryCard></SummaryCard>
                    <div className="card shadow-sm p-3 my-4">
                        <h5 className="text-center fw-bold mb-4">Employment History</h5>
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th>Employer</th>
                                    <th>Tenure</th>
                                    <th>Experience</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employmentData.map((data, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="fw-bold">{data.employer}</div>
                                            <div className="text-muted" style={{ fontSize: "14px" }}>
                                                Member ID: {data.memberId}
                                            </div>
                                        </td>
                                        <td>{data.tenure}</td>
                                        <td>{data.experience}</td>
                                        <td>{data.balance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-center fw-bold mb-3">
                            Total Service: {totalService}
                        </div>
                    </div>

                    <div
                        className="card shadow-sm  mt-4 px-5"
                        style={{
                            borderRadius: "1rem",
                            padding: "1rem",
                            backgroundColor: "#ffffff",
                        }} >

                        <div className="text-center mb-2">
                            <h5 className="fw-bold">Overview</h5>
                        </div>

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Total Service</td>
                                    <td>
                                    7 years 3 Months
                                    </td>
                                </tr>
                                <tr>
                                    <td>No. Of Employers</td>
                                    <td>
                                        3
                                    </td>
                                </tr>
                                <tr>
                                    <td>Current Employer</td>
                                    <td>
                                    Morningstar India Pvt. Ltd
                                    </td>
                                </tr>
                                <tr>
                                    <td>Current Value</td>
                                    <td>
                                    ₹ 22,50,000
                                    </td>
                                </tr>
                                <tr>
                                    <td>Last Contribution</td>
                                    <td>
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
                        className="card shadow-sm  my-4 px-5"
                        style={{
                            borderRadius: "1rem",
                            padding: "1rem",
                            backgroundColor: "#ffffff",
                        }} >
                            <div className="row">
                                <h5 className="text-center">Personal Details</h5>
                                <div className="col-6">
                                    <p className="mb-0">Fathers Name:</p>
                                    <p className="">DARSHAN</p>
                                </div>
                                <div className="col-6">
                                    <p className="mb-0">Date of Birth:</p>
                                    <p>17/11/1993</p>
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
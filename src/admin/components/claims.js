import React, { useState } from "react";
import { ArrowLeft } from 'react-bootstrap-icons';
import getData from './jsonData.json'

const Claims = ({ jsonData, onBack }) => {
    let claimsData = jsonData?.data?.claims;
    let summary = jsonData?.data?.claims.summary;

    const [selectedTab, setSelectedTab] = useState("Pending Claims");
    // Data access functions
    const getPendingClaims = () => claimsData?.details?.["Pending Claims"]?.["Pending Claims"].filter(claim => claim.claimId) || [];
    const getSettledClaims = () => claimsData?.details?.["Settled Claims"]?.["Settled Claims"].filter(claim => claim.claimId) || [];
    const getRejectedClaims = () => claimsData?.details?.["Rejected Claims"]?.["Rejected Claims"].filter(claim => claim.claimId) || [];

    return (
        <>
        <button className="btn p-0 d-flex align-items-center mt-4 mb-md-3" onClick={onBack}>
                <ArrowLeft size={20} className="me-1" /> Back
            </button>
            <div className="container my-4">
                <h3>Claim Summary</h3>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Summary Item</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total Claims</td>
                            <td>{summary?.totalClaims}</td>
                        </tr>
                        <tr>
                            <td>Approved Settled Claims</td>
                            <td>{summary?.approvedSettledClaims}</td>
                        </tr>
                        <tr>
                            <td>Approved Settled Amount</td>
                            <td>{summary?.approvedSettledAmount}</td>
                        </tr>
                        <tr>
                            <td>Rejected Claims</td>
                            <td>{summary?.rejectedClaims}</td>
                        </tr>
                        <tr>
                            <td>Pending In-Process Claims</td>
                            <td>{summary?.pendingInProcessClaims}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                {/* Button Controls */}
                <div className="btn-group mb-3">
                    <button className="btn btn-primary" onClick={() => setSelectedTab("Pending Claims")}>
                        Pending Claims [{claimsData?.details?.["Pending Claims"]?.["Pending Claims"].filter(claim => claim.claimId).length}]
                    </button>
                    <button className="btn btn-success" onClick={() => setSelectedTab("Settled Claims")}>
                        Settled Claims [{claimsData?.details?.["Settled Claims"]?.["Settled Claims"].filter(claim => claim.claimId).length}]
                    </button>
                    <button className="btn btn-danger" onClick={() => setSelectedTab("Rejected Claims")}>
                        Rejected Claims [{claimsData?.details?.["Rejected Claims"]?.["Rejected Claims"].filter(claim => claim.claimId).length}]
                    </button>
                </div>

                {/* Table Rendering */}
                {selectedTab === "Pending Claims" && (
                    <div>
                        <h3>Pending Claims</h3>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Claim ID</th>
                                    <th>Receipt Date</th>
                                    <th>Member ID</th>
                                    <th>Form Type</th>
                                    <th>Description</th>
                                    <th>Rejection Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPendingClaims().map((claim, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{claim.claimId}</td>
                                        <td>{claim.receiptDate}</td>
                                        <td>{claim.memberId}</td>
                                        <td>{claim.formType}</td>
                                        <td>{claim.description}</td>
                                        <td>{claim.rejectionReason || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedTab === "Settled Claims" && (
                    <div>
                        <h3>Settled Claims</h3>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Claim ID</th>
                                    <th>Receipt Date</th>
                                    <th>Member ID</th>
                                    <th>Form Type</th>
                                    <th>Description</th>
                                    <th>Claim Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getSettledClaims().map((claim, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{claim.claimId}</td>
                                        <td>{claim.receiptDate}</td>
                                        <td>{claim.memberId}</td>
                                        <td>{claim.formType}</td>
                                        <td>{claim.description}</td>
                                        <td>{claim.rejectDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedTab === "Rejected Claims" && (
                    <div>
                        <h3>Rejected Claims</h3>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Claim ID</th>
                                    <th>Receipt Date</th>
                                    <th>Member ID</th>
                                    <th>Form Type</th>
                                    <th>Description</th>
                                    <th>Rejection Date</th>
                                    <th>Rejection Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getRejectedClaims().map((claim, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{claim.claimId}</td>
                                        <td>{claim.receiptDate}</td>
                                        <td>{claim.memberId}</td>
                                        <td>{claim.formType}</td>
                                        <td>{claim.description}</td>
                                        <td>{claim.rejectDate}</td>
                                        <td className="text-danger">{claim.rejectionReason || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
export default Claims
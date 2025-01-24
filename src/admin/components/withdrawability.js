import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from 'react-bootstrap-icons';
import '../../css/admin/withdrawability.css'
import ToastMessage from "../../components/common/toast-message";
import { get, post } from "../../components/common/api";
import { formatCurrency } from "../../helper/data-transform";

function Withdrawability({ jsonData, onBack }) {
    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);
    const isMessageActive = useRef(false); // Prevents multiple messages from being displayed at the same time.

    const [reportData, setReportData] = useState(null)

    const fetchReport = async () => {
        setLoading(true);
        try {
            setLoading(true);
            const result = await get('/admin/report/fetchByUanForAdmin/' + jsonData?.meta.uan);

            if (result.status === 400) {
                setLoading(false);
                setMessage({ type: "error", content: result.message });
            } else {
                if (result.data) {
                    setLoading(false);
                    setReportData(result.data)
                } else {
                    const dataToSend = {
                        userEmpHistoryCorrect: true,
                        userStillWorkingInOrganization: true,
                        currentOrganizationMemberId: jsonData?.data?.home?.currentEstablishmentDetails?.memberId || "",
                        kycStatus: {
                            fullName: true,
                            gender: true,
                            fatherHusbandName: true,
                            physicallyHandicapped: true,
                            UAN: true,
                            dateOfBirth: true,
                            aadhaar: true,
                            pan: true,
                            bankAccountNumber: true,
                            bankIFSC: true
                        },
                        isReqFromAdmin: true,
                        uanToSearch: jsonData?.meta.uan
                    };

                    const response = await post('admin/withdrawability-check', dataToSend);
                    setLoading(false);
                    setReportData(response);
                }
            }
        } catch (error) {
            setLoading(false);
            setMessage({ type: "error", content: error.message });
        }
    };

    useEffect(() => {
        fetchReport();
    }, [jsonData]);

    // Toast Message Auto Clear
    useEffect(() => {
        if (message.type) {
            isMessageActive.current = true; // Set active state when a message is displayed
            const timer = setTimeout(() => {
                setMessage({ type: "", content: "" });
                isMessageActive.current = false; // Reset active state
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const renderWithdrawabilityReport = (report) => (
        <div>
            {report?.map((item, index) => (
                <div key={index} className="mb-4">
                    <h5>{item?.category}</h5>
                    <ul className="list-group">
                        {item?.subCategory.map((sub, idx) => (
                            <li key={idx} className="list-group-item">
                                <div className="fw-bold">{sub?.name.replace(/_/g, ' ')}</div>
                                <div>
                                    Success: {sub?.success} | Critical: {sub?.critical} | Medium: {sub?.medium}
                                </div>
                                {item?.category?.toLowerCase() === 'epf pension records' && item?.isEpsMember &&  
                                    <div>
                                        EPS Member ({item?.isEpsMember}): {item?.isEpsMember?.toUpperCase() === "Y" ? <span className="text-success">Yes</span> : <span className="text-danger">No</span>}
                                    </div>
                                }
                                {sub?.errorMessages?.length > 0 && (
                                    <div className="text-danger">
                                        Errors:
                                        {sub?.errorMessages.map((msg, idx) => (
                                            <div key={idx}>{idx + 1}. {msg}</div>
                                        ))}
                                    </div>
                                )}
                                {sub?.successMessage?.length > 0 && (
                                    <div className="text-success">
                                        Success Messages:
                                        {sub?.successMessage.map((msg, idx) => (
                                            <div key={idx}>{idx + 1}. {msg}</div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

    const renderTable = (title, rows) => (
        <div className="mb-4">
            <h5 className="text-center my-4">{title}</h5>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>Year</th>
                        <th>Employee Share</th>
                        <th>Employer Share</th>
                        <th>Pension Share</th>
                        <th>Interest Share</th>
                    </tr>
                </thead>
                <tbody>
                    {rows &&
                        Object.entries(rows)
                            .sort(([yearA], [yearB]) => yearB - yearA) // Sort by year (latest first)
                            .map(([year, values]) => (
                                <tr key={year}>
                                    <td>{year}</td>
                                    <td>{values?.totalEmployeeShare}</td>
                                    <td>{values?.totalEmployerShare}</td>
                                    <td>{values?.totalPensionShare}</td>
                                    <td>{values?.totalInterestShare}</td>
                                </tr>
                            ))}
                    {rows && (
                        <tr>
                            <td><b>Total</b></td>
                            <td>
                                <b>
                                    {Object.values(rows).reduce((acc, curr) => acc + (curr.totalEmployeeShare || 0), 0)}
                                </b>
                            </td>
                            <td>
                                <b>
                                    {Object.values(rows).reduce((acc, curr) => acc + (curr.totalEmployerShare || 0), 0)}
                                </b>
                            </td>
                            <td>
                                <b>
                                    {Object.values(rows).reduce((acc, curr) => acc + (curr.totalPensionShare || 0), 0)}
                                </b>
                            </td>
                            <td>
                                <b>
                                    {Object.values(rows).reduce((acc, curr) => acc + (curr.totalInterestShare || 0), 0)}
                                </b>
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );

    return (
        <>
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-container">
                        <p className="loader-text">Fetching Report, Please wait...</p>
                    </div>
                </div>
            )}
            {message.type && <ToastMessage message={message.content} type={message.type} />}
            <button className="btn p-0 d-flex align-items-center mt-4 mb-md-3" onClick={onBack}>
                <ArrowLeft size={20} className="me-1" /> Back
            </button>
            <div className="container my-5">
                {/* General Information */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title text-center my-4">General Information</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <p>UAN: <strong>{reportData?.uan}</strong></p>
                                <p>Total PF Balance: <strong>{formatCurrency(reportData?.totalPfBalance) || 0}</strong></p>
                                <p>Maximum Withdrawable Limit: <strong>{formatCurrency(reportData?.maxWithdrawableLimit) || 0}</strong></p>
                                <p>Total Amount Stuck: <strong>{formatCurrency(reportData?.totalAmountStuck) || 0}</strong></p>
                                <p>Pension Withdrawable Amount : <strong>{formatCurrency(reportData?.pensionWithdrability?.withdrawableAmount) || 0}</strong></p>
                                <p>TDS on Amount : <strong>{formatCurrency(reportData?.tdsOnWithdrawal) || 0}</strong></p>
                            </div>
                            <div className="col-md-6">
                                <p>Estimated Resolution Time: <strong>{reportData?.estimatedResolutionTime || "-"}</strong></p>
                                <p>Amount Withdrawable Within 30 Days: <strong>{formatCurrency(reportData?.amountWithdrawableWithin30Days) || 0}</strong></p>
                                <p>Claim Rejection Probability: <strong>{reportData?.claimRejectionProbability || "-"}</strong></p>
                                <p>Last 6 Contribution Average: <strong>{formatCurrency(reportData?.averageOfLastSixTransactions) || 0}</strong></p>
                                <p>Pension Withdrawable Per Month : <strong>{formatCurrency(reportData?.pensionWithdrability?.pensionAmountPerMonth) || 0}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Amount Contributed */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title text-center my-4">Amount Contributed Information</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <p>Employee Share: <strong>{formatCurrency(reportData?.amountContributed?.totalEmployeeShare) || 0}</strong></p>
                                <p>Employer Share: <strong>{formatCurrency(reportData?.amountContributed?.totalEmployerShare) || 0}</strong></p>
                                <p>Pension Share: <strong>{formatCurrency(reportData?.amountContributed?.totalPensionShare) || 0}</strong></p>
                                <p>Total Interest: <strong>{formatCurrency(reportData?.amountContributed?.totalInterestShare) || 0}</strong></p>
                            </div>
                            <div className="col-md-6">
                                <p>Employee Share Interest: <strong>{formatCurrency(reportData?.amountContributed?.totalEmployeeShareInterest) || 0}</strong></p>
                                <p>Employer Share Interest: <strong>{formatCurrency(reportData?.amountContributed?.totalEmployerShareInterest) || 0}</strong></p>
                                <p>Pension Share Interest: <strong>{formatCurrency(reportData?.amountContributed?.totalPensionShareInterest) || 0}</strong></p>
                                <p>Current Year Interest: <strong>{formatCurrency(reportData?.amountContributed?.currentYearInterestShare) || 0}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Last Contribution */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title text-center my-4">Last Contribution</h5>
                        <p>Wage Month: <strong>{reportData?.lastContribution?.wageMonth || "-"}</strong></p>
                        <p>Transaction Date: <strong>{reportData?.lastContribution?.transactionDate || "-"}</strong></p>
                        <p>Transaction Type: <strong>{reportData?.lastContribution?.transactionType || "-"}</strong></p>
                        <p>EPF Wages: <strong>{reportData?.lastContribution?.epfWages || 0}</strong></p>
                        <p>EPS Wages: <strong>{reportData?.lastContribution?.epsWages || 0}</strong></p>
                        <p>Employee Share: <strong>{reportData?.lastContribution?.employeeShare || 0}</strong></p>
                        <p>Employer Share: <strong>{reportData?.lastContribution?.employerShare || 0}</strong></p>
                    </div>
                </div>

                {/* Withdrawability Checkup Report */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title text-center my-4">Withdrawability Checkup Report</h5>
                        {renderWithdrawabilityReport(reportData?.withdrawabilityCheckupReport)}
                    </div>
                </div>

                {/* Fund Values */}
                {renderTable('Fund Values', reportData?.fundValues)}
            </div>
        </>
    );
}

export default Withdrawability;
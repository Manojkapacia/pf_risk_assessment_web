import React from "react";
import { ArrowLeft } from 'react-bootstrap-icons';
import getData from './jsonData.json'
const PFPassbook = ({ jsonData, onBack }) => {
    // console.log("data get", getData);
    // let data = getData?.data?.passbooks;
    let data = jsonData?.data?.passbooks;


    return (
        <>
            <button className="btn p-0 d-flex align-items-center mt-4 mb-md-3" onClick={onBack}>
                <ArrowLeft size={20} className="me-1" /> Back
            </button>
            <div className="accordion" id="passbookAccordion">
                {Object.entries(data).map(([memberId, yearsData], index) => (
                    <div className="accordion-item" key={index}>
                        <h2 className="accordion-header" id={`heading-${index}`}>
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${index}`}
                                aria-expanded="true"
                                aria-controls={`collapse-${index}`}
                            >
                                Member ID: {memberId} &nbsp;&nbsp; 
                                {/* Member Name : {console.log} */}
                            </button>
                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent="#passbookAccordion"
                        >
                            <div className="accordion-body">
                                {yearsData.isTrust === 'true' ?(<h4>This passbook belongs to a trust</h4>) 
                                 :(
                                Object.entries(yearsData).map(([year, yearData], yearIndex) => (
                                    <div key={yearIndex}>
                                        <h5
                                            style={{
                                                cursor: "pointer",
                                                color: "blue",
                                                textDecoration: "underline",
                                            }}
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#details-${memberId}-${year}`}
                                        >
                                            Year: {year}
                                        </h5>
                                        <div
                                            id={`details-${memberId}-${year}`}
                                            className="collapse"
                                            style={{ marginLeft: "20px" }}
                                        >
                                            {console.log("year Data", yearData)}
                                            <div className="mt-3">
                                                <div className="mb-4">
                                                    <h4>Opening Balance</h4>
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Particulars</th>
                                                                <th>Employee Share</th>
                                                                <th>Employer Share</th>
                                                                <th>Pension Share</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>{yearData.openingBalance.particulars}</td>
                                                                <td>{yearData.openingBalance.employeeShare}</td>
                                                                <td>{yearData.openingBalance.employerShare}</td>
                                                                <td>{yearData.openingBalance.pensionShare}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mb-4">
                                                    <h4>Transactions</h4>
                                                    <div className="table-responsive">
                                                        <table className="table table-hover table-bordered text-center">
                                                            <thead>
                                                                <tr>
                                                                    <th>Wage Month</th>
                                                                    <th>Transaction Date</th>
                                                                    <th>Transaction Type</th>
                                                                    <th>Particulars</th>
                                                                    <th>EPF Wages</th>
                                                                    <th>EPS Wages</th>
                                                                    <th>Employee Share</th>
                                                                    <th>Employer Share</th>
                                                                    <th>Pension Share</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {yearData.transactions.map((txn, index) => (
                                                                    <tr key={index}>
                                                                        <td>{txn.wageMonth}</td>
                                                                        <td>{txn.transactionDate}</td>
                                                                        <td>{txn.transactionType}</td>
                                                                        <td>{txn.particulars}</td>
                                                                        <td>{txn.epfWages}</td>
                                                                        <td>{txn.epsWages}</td>
                                                                        <td>{txn.employeeShare}</td>
                                                                        <td>{txn.employerShare}</td>
                                                                        <td>{txn.pensionShare}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <h4>Totals</h4>
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Particulars</th>
                                                                <th>Employee Share</th>
                                                                <th>Employer Share</th>
                                                                <th>Pension Share</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.entries(yearData.totals).map(([key, total], index) => (
                                                                <tr key={index}>
                                                                    <td>{key}</td>
                                                                    <td>{total.employeeShare}</td>
                                                                    <td>{total.employerShare}</td>
                                                                    <td>{total.pensionShare}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mb-4">
                                                    <h4>Closing Balance</h4>
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Particulars</th>
                                                                <th>Employee Share</th>
                                                                <th>Employer Share</th>
                                                                <th>Pension Share</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>{yearData.closingBalance.particulars}</td>
                                                                <td>{yearData.closingBalance.employeeShare}</td>
                                                                <td>{yearData.closingBalance.employerShare}</td>
                                                                <td>{yearData.closingBalance.pensionShare}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mb-4">
                                                    <h4>Interest Details</h4>
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Particulars</th>
                                                                <th>Employee Share</th>
                                                                <th>Employer Share</th>
                                                                <th>Pension Share</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>{yearData.interestDetails.particulars}</td>
                                                                <td>{yearData.interestDetails.employeeShare}</td>
                                                                <td>{yearData.interestDetails.employerShare}</td>
                                                                <td>{yearData.interestDetails.pensionShare}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                 )}
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PFPassbook;


import React, { useState } from "react";
import { ArrowLeft } from 'react-bootstrap-icons';

const PFPassbook = ({ jsonData, onBack }) => {
    console.log("data passbook", jsonData);
    return;

    let data = jsonData.data.passbooks.MHBAN01266700000011534;
    const [selectedYear, setSelectedYear] = useState("");
    console.log("data passbook", data);
    
    // Handle select change
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div className="container">
            <div className="row">
            
                <div className="col-md-10 offset-md-1 mt-5">
                <button className="btn d-flex align-items-center mb-2 mt-3" onClick={onBack}>
                        <ArrowLeft size={20} className="me-1" /> Back
            </button>
                    <select className="form-select" value={selectedYear} onChange={handleYearChange}>
                        <option value="">Select a year</option>
                        {Object.keys(data).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    {selectedYear ?
                    <h2 className="text-center my-4">PF Passbook - Year Details {selectedYear}</h2>
                    :<h2 className="text-center my-4">Please Select the Year </h2>
                    }
                    {selectedYear && (
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
                                            <td>{data[selectedYear].openingBalance.particulars}</td>
                                            <td>{data[selectedYear].openingBalance.employeeShare}</td>
                                            <td>{data[selectedYear].openingBalance.employerShare}</td>
                                            <td>{data[selectedYear].openingBalance.pensionShare}</td>
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
                                            {data[selectedYear].transactions.map((txn, index) => (
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
                                        {Object.entries(data[selectedYear].totals).map(([key, total], index) => (
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
                                            <td>{data[selectedYear].closingBalance.particulars}</td>
                                            <td>{data[selectedYear].closingBalance.employeeShare}</td>
                                            <td>{data[selectedYear].closingBalance.employerShare}</td>
                                            <td>{data[selectedYear].closingBalance.pensionShare}</td>
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
                                            <td>{data[selectedYear].interestDetails.particulars}</td>
                                            <td>{data[selectedYear].interestDetails.employeeShare}</td>
                                            <td>{data[selectedYear].interestDetails.employerShare}</td>
                                            <td>{data[selectedYear].interestDetails.pensionShare}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default PFPassbook;


import React from "react";
import { ArrowLeft } from 'react-bootstrap-icons';
import '../../css/admin/transfer.css'

function Transfer({ jsonData, onBack }) {
    let data = jsonData?.transferData
    return (
        <>
            <button className="btn p-0 d-flex align-items-center mt-4 mb-md-3" onClick={onBack}>
                <ArrowLeft size={20} className="me-1" /> Back
            </button>
            <div className="data-table-container">
                <h1>Transaction Data</h1>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Member Id (From)</th>
                            <th>Claim ID</th>
                            <th>Amount</th>
                            <th>Approved Date</th>
                            <th>Type</th>
                            <th>Is Member Id (From) Trust?</th>
                            <th>Employed in Trust on Date of Transaction Approved?</th>
                            <th>Member Id (To)</th>
                            <th>Transaction Date</th>
                            <th>Transfer Employee Share</th>
                            <th>Transfer Employer Share</th>
                            <th>Pension Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row["Member Id (From)"] || "N/A"}</td>
                                <td>{row["Claim ID"] || "N/A"}</td>
                                <td>{row["Amount"] || "N/A"}</td>
                                <td>{row["Approved Date"] || "N/A"}</td>
                                <td>{row["Type"] || "N/A"}</td>
                                <td>{row["Is Member Id (From) Trust?"] || "N/A"}</td>
                                <td>{row["Employed in Trust on Date of Transaction Approved?"] || "N/A"}</td>
                                <td>{row["Member Id (To)"] || "N/A"}</td>
                                <td>{row["Transaction Date"] || "N/A"}</td>
                                <td>{row["Transfer Employee Share"] || "N/A"}</td>
                                <td>{row["Transfer Employer Share"] || "N/A"}</td>
                                <td>{row["Pension Share"] || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Transfer;
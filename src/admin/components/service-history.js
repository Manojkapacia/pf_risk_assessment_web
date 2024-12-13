import React, { useState } from "react";
import { Eye, ArrowLeft } from "react-bootstrap-icons";
import getData from './jsonData.json'

function ServiceHistory({ jsonData, onBack }) {
    // const data = getData.data.serviceHistory.history;
    const data = jsonData.data.serviceHistory.history;
    const overView = jsonData.data.serviceHistory.overview;
    const balance = jsonData.data.home


    // const handleOpenModal = (details) => {
    //     setCurrentDetails(details);
    // };


    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (index) => {
        setExpandedRows((prevState) => {
            // Check if the row is already expanded
            if (prevState.includes(index)) {
                // Remove it from the array (collapse)
                return prevState.filter((row) => row !== index);
            } else {
                // Add it to the array (expand)
                return [index,...prevState];
            }
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-10 offset-md-1">
                    <button className="btn p-0 d-flex align-items-center mt-3" onClick={onBack}>
                        <ArrowLeft size={20} className="me-1" /> Back
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 offset-md-1 mt-3">
                    <h3>Balance </h3>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">Member ID</th>
                                <th className="text-center">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {balance.memberWiseBalances.map((memberWiseBalances, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        {memberWiseBalances.memberId}
                                    </td>
                                    <td className="text-center">
                                        {memberWiseBalances.balance}
                                    </td>
                                </tr>

                            ))}
                            <tr>
                            <td className="text-center">
                                    <h6>Total Balance</h6>
                                </td>
                                <td className="text-center">
                                    {balance.totalBalance}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 offset-md-1 mt-3">
                    <h3>Summary </h3>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">Total Experience</th>
                                <th className="text-center">Date of Joining</th>
                                <th className="text-center">Total NCP days</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-center">
                                    {overView["Total Experience"]}
                                </td>
                                <td className="text-center">
                                    {overView["Date of Joining"]}
                                </td>
                                <td className="text-center">
                                    {overView["Total NCP Days"]}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="row">
                <div className="col-md-10 offset-md-1 mt-3">
                    <h3>History </h3>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">Sr. No.</th>
                                <th className="text-center">Period</th>
                                <th className="text-center">Company</th>
                                <th className="text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="text-center">
                                            {item.heading}
                                        </td>
                                        <td className="text-center">
                                            {item.period}
                                        </td>
                                        <td className="text-center">
                                            {item.company}
                                        </td>
                                        <td className="text-center">
                                            <Eye size={20} 
                                            // data-bs-toggle="modal"
                                                // data-bs-target="#exampleModal"
                                                style={{ cursor: 'pointer' }}
                                                
                                                onClick={() => toggleRow(index)} />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
                    {/* Accordions Section */}
            <div className="row mt-3">
                <div className="col-md-10 offset-md-1">
                    {expandedRows.map((index) => {
                        const item = data[index];
                        return (
                            <div key={index} className="accordion-item mb-3">
                                <div className="accordion-header bg-light p-3 border">
                                    <h5>Details for: {item.company}</h5>
                                </div>
                                <div className="accordion-body border p-3">
                                    <p><strong>Member ID:</strong> {item.details['Member Id'] || "N/A"}</p>
                                    <p><strong>Est Id:</strong> {item.details['Est Id'] || "N/A"}</p>
                                    <p><strong>NCP Days:</strong> {item.details['NCP Days'] || "N/A"}</p>
                                    <p><strong>Joining Date:</strong> {item.details['Joining Date']|| "N/A"}</p>
                                    <p><strong>Total Service:</strong> {item.details['Total Service'] || "N/A"}</p>
                                    <p><strong>Exit Date:</strong> {item.details['Exit Date']|| "N/A"}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-bordered">
                                <tbody>
                                    {Object.entries(currentDetails).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{value || "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>


    );
}

export default ServiceHistory
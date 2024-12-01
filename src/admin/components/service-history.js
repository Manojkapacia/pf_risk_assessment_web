import React, { useState } from "react";
import { Eye, ArrowLeft } from "react-bootstrap-icons";

function ServiceHistory({ jsonData, onBack }) {
    const data = jsonData.data.serviceHistory.history;

    const [currentDetails, setCurrentDetails] = useState({});

    const handleOpenModal = (details) => {
        setCurrentDetails(details);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-10 offset-md-1 mt-5">
                    <button className="btn p-0 d-flex align-items-center mt-3" onClick={onBack}>
                        <ArrowLeft size={20} className="me-1" /> Back
                    </button>
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
                                            <Eye size={20} data-bs-toggle="modal"
                                                data-bs-target="#exampleModal"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleOpenModal(item.details)} />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
            </div>
        </div>


    );
}

export default ServiceHistory
import React from 'react';
import { BsArrowLeft } from "react-icons/bs";

const ScanResult = (props) => {

    const handleBackClick = () => {
        props.backButtonClicked()
    }

    return (
        <div className="container my-5 p-4 border rounded">
        <div className="mb-2 d-flex align-items-center w-100 back-arrow">
            <BsArrowLeft style={{cursor: 'pointer'}} onClick={handleBackClick}/>&nbsp; <span className="">BACK TO SCAN RESULTS</span>
        </div>
        <h2 className="fw-bold">Dates Mismatch</h2>
        <p className="text-muted text-center">
            Lorem ipsum dolor sit amet consectetur. Viverra adipiscing diam mus dictumst et proin faucibus lacus sed. Aliquet.
        </p>

        <div className="row g-3 mt-3 mb-3">
            <div className="col-md-6">
            <div className="p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">Date of Exit</span>
                <span className="text-danger">- Failed</span>
                </div>
                <span className="badge bg-danger text-uppercase mb-2">Critical</span>
                <p className="mb-0 text-muted">Date of exit not marked for <strong>Tata Consultancy Services LTD.</strong></p>
            </div>
            </div>

            <div className="col-md-6">
            <div className="p-3 border rounded bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">Service Overlap</span>
                <span className="text-danger">- Failed</span>
                </div>
                <span className="badge bg-danger text-uppercase mb-2">Critical</span>
                <p className="mb-0 text-muted">Service overlap found between <strong>Tata Consultancy Services LTD</strong> and <strong>Accenture</strong></p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default ScanResult;

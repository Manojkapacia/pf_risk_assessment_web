import React from 'react';
import { BsArrowLeft } from "react-icons/bs";
import '../../css/scanning/doc-scan.css'

const ScanResult = (props) => {

    const handleBackClick = () => {
        props.backButtonClicked()
    }

    return (
        <div className="container my-5 p-4 border rounded">
        <div className="mb-2 w-100 back-arrow">
            <BsArrowLeft style={{cursor: 'pointer'}} onClick={handleBackClick}/>&nbsp; <span>BACK TO SCAN RESULTS</span>
        </div>
        <div className="pfRiskheading text-center">Dates Mismatch</div>
        <p className="text-muted text-center">
            Lorem ipsum dolor sit amet consectetur. Viverra adipiscing diam mus dictumst et proin faucibus lacus sed. Aliquet.
        </p>

        <div className="row g-3 mt-3 mb-3">
            <div className="col-md-6">
            <div className="py-3 px-2 border rounded bg-light scanResCol">
                <div className="d-flex justify-content-between align-items-center">
                <span className="scanResultLabel">Date of Exit</span>
                <span className="text-danger">-Failed</span>
                </div>
                <span className="badge bg-danger text-uppercase">Critical</span>
                <p className="text-muted mt-2">Date of exit not marked for <strong>Tata Consultancy Services LTD.</strong></p>
            </div>
            </div>

            <div className="col-md-6">
            <div className="py-3 px-2 border rounded bg-light scanResCol" >
                <div className="d-flex justify-content-between align-items-center">
                <span className="scanResultLabel">Service Overlap</span>
                <span className="text-danger">- Failed</span>
                </div>
                <span className="badge bg-danger text-uppercase">Critical</span>
                <p className="text-muted mt-2">Service overlap found between <strong>Tata Consultancy Services LTD</strong> and <strong>Accenture</strong></p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default ScanResult;

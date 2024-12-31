import React from 'react';
import { BsArrowLeft } from "react-icons/bs";
import '../../css/scanning/doc-scan.css'

const ScanResult = (props) => {
    const selectedCategory = props.selectedCategory

    const handleBackClick = () => {
        props.backButtonClicked()
    }

    return (
        <div className="container my-5 p-4 border rounded">
            <div className="mb-2 w-100 back-arrow">
                <BsArrowLeft style={{cursor: 'pointer'}} onClick={handleBackClick}/>&nbsp; <span>BACK TO SCAN RESULTS</span>
            </div>
            <div className="pfRiskheading text-center">{selectedCategory.category}</div>
            <p className="text-muted text-center">
            {selectedCategory.category === "Contributions" ? <p>On time and consistent deduction of employee Share, Employer share as well as Pension share as per EPF rules is very important</p> 
             :selectedCategory.category === "Service History" ?<p>Checking any anomaly like missing Date of Exit or Date of joining or 
                overlapping work experience</p>
             :selectedCategory.category === "Transfer" ?<p>Every UAN must have a balanced Tranfer ledger, any mismatched transfer In or transfer out can force the EPFO to block access to your money </p>
             :<p>There has been many changes in the EPS rules in past years and many employers, often make clerical mistakes in record keeping in accordance to the rules, this leads to blocking of access to your EPF amount</p>}
            </p>
            <div className="row g-3 mt-3 mb-3">
                {selectedCategory.subCategory.map((subCategory, index) => (
                    (subCategory.critical > 0 || subCategory.medium > 0) &&
                    <div className="col-md-6" key={index}>
                        <div className="py-3 px-2 border rounded bg-light scanResCol">
                            <div className="d-flex justify-content-between align-items-center">
                            <span className="scanResultLabel">{subCategory.name.replace(/_/g, " ")}</span>
                            {subCategory.critical > 0 && <span className="text-danger">Failed</span>}
                            {subCategory.critical === 0 && subCategory.medium > 0 && <span className="text-warning">Partially Failed</span>}
                            </div>

                            {subCategory.critical > 0 && (<><span className="badge bg-danger text-uppercase">Critical</span>&nbsp;&nbsp;</>)}
                            {subCategory.medium > 0 && <span className="badge bg-warning text-uppercase">Medium</span>}
                            {subCategory.errorMessages.map((message,index) => (
                               <p
                                    className="text-muted mt-2 font-small"
                                    dangerouslySetInnerHTML={{
                                        __html: message.replace(/:(.*)/, ": <strong>$1</strong>"),
                                    }}
                                    key={index}
                                ></p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScanResult;
